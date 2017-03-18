#!/usr/bin/env ruby

require 'google_drive'
require 'trollop'
# require 'net/scp'
require 'curb-fu'
require 'aws-sdk'
# require 'id3tag'
# require 'mini_magick'
# require_relative 'venue.rb'

# see Trollop description
class ParseSchedule
  attr_accessor :opts

  ENVIRONMENTS = %w(etl dev prod).freeze
  PROD_ENVIRONMENT = 'prod'.freeze

  SCHEDULE_HEADER_ROW = 2
  FESTIVAL_START = Time.new(2017,03,22,0,0,0,'-07:00')
  # VENUE_IMAGE_BUCKET_URL = "https://s3-us-west-2.amazonaws.com/treefort-venue-images/".freeze

  SCHEDULE_COLS =
      ['Primary Performer', '2nd Performer', '3rd Performer', '4th Performer', '5th Performer',
       '6th Performer', '7th Performer', '8th Performer',
       'Primary Fort', '2nd Fort', 'Event Identifier',
       'Event Name', 'Date', 'Start Time', 'End Time', 'Venue', 'Description',
       'Kidfort Approved', 'Cancelled', 'All Ages',
       'Event ID',
       'Primary Performer ID', '2nd Performer ID', '3rd Performer ID', '4th Performer ID', '5th Performer ID',
       '6th Performer ID', '7th Performer ID', '8th Performer ID',
       ]

  VENUE_COLS = ['Name', 'Street', 'City', 'State', 'Zip', 'Extra Info'].freeze
  PERFORMER_COLS = %w(name id forts home_town).freeze

  DEV_SHEETS = ['Example']
  PROD_SHEETS =['Treefort', 'Alefort', 'Comedyfort', 'Filmfort', 'Foodfort', 'Hackfort', 'Kidfort',
                'Performance Art', 'Skatefort', 'Storyfort', 'Yogafort']

  def run
    @opts = Trollop.options do
      banner <<-EOS
        Usage:
          xxx.rb [options]

      EOS

      opt :environment, "Where to write the data. Possible values: #{ENVIRONMENTS.join(', ')}",
          type: :string,
          default: ENVIRONMENTS.first
      opt :sheets, 'just do these named sheets',
          type: :strings
      opt :delete_all_first, 'clear out before starting', short: 'x'

    end

    Trollop.die 'Invalid environment' unless ENVIRONMENTS.include?(@opts[:environment])

    # Next 2 lines are from: https://github.com/google/google-api-ruby-client/issues/253
    # to avoid error: Uncaught exception: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed
    cert_path = Gem.loaded_specs['google-api-client'].full_gem_path+'/lib/cacerts.pem'
    ENV['SSL_CERT_FILE'] = cert_path

    puts "----- Starting: #{Time.now.strftime('%Y/%m/%d %H:%M')}. Writing to #{@opts[:environment]}"

    # See this document to learn how to create config.json:
    # https://github.com/gimite/google-drive-ruby/blob/master/doc/authorization.md
    keyfile = File.dirname(__FILE__) + '/Treefort Events 2017-d9872630951c.json'
    session = GoogleDrive::Session.from_service_account_key(keyfile)

    ws = session.spreadsheet_by_key('1KcErm07C4Hf_wBk-rxSOa9b8-4mUChcDyBhjmPyCSGU').worksheet_by_title('Venues')
    venues = sheet_to_json(ws, VENUE_COLS)

    ws = session.spreadsheet_by_key('1KcErm07C4Hf_wBk-rxSOa9b8-4mUChcDyBhjmPyCSGU').worksheet_by_title('Performers')
    performers = sheet_to_json(ws, PERFORMER_COLS)
    performers.map! { |p|
      p['forts'] = p['forts'].split(',') unless p['forts'].nil?
      p
    }

    # Using a "Treefort" AWS profile on my machine as described on
    # http://docs.aws.amazon.com/sdkforruby/api/index.html#Configuration
    Aws.config.update({region: 'us-west-2', profile:'Treefort'})
    @db = Aws::DynamoDB::Client.new

    if @opts[:delete_all_first]
      puts 'Clearing DynamoDB table'

      begin
        @db.delete_table( {table_name: "#{@opts[:environment]}-event"})
      rescue Aws::DynamoDB::Errors::ResourceNotFoundException => error
        puts 'Table does not exist to delete. Skipping'
      end

      begin
        retries ||= 0
        @db.create_table({table_name: "#{@opts[:environment]}-event",
                          attribute_definitions: [
                              {
                                  attribute_name: 'id',
                                  attribute_type: 'S'
                              }
                          ],
                          key_schema: [{
                                           attribute_name: 'id',
                                           key_type: 'HASH'
                                       }],
                          provisioned_throughput:
                              {
                                  read_capacity_units: 50,
                                  write_capacity_units: 15
                              }
                         })
      rescue Aws::DynamoDB::Errors::ServiceError
        puts "Not deleted yet. Try #{retries + 1}"
        sleep 2 # seconds
        retry if (retries += 1) < 10
      end
    end

    # title = 'Day Example'
    # day_offset = 0
    event_count = 0
    skipped_count = 0
    dupe_event_count = 0
    bad_venues = []
    bad_performers = []

    # sheets = (@opts[:environment] == PROD_ENVIRONMENT) ? PROD_SHEETS : DEV_SHEETS
    sheets = PROD_SHEETS
    if @opts[:sheets]
      sheets &= @opts[:sheets]
    end

    sheets.each do |title|
      puts "Processing sheet '#{title}'"
      ws = session.spreadsheet_by_key('1KcErm07C4Hf_wBk-rxSOa9b8-4mUChcDyBhjmPyCSGU').worksheet_by_title(title)

      event_ids = Set.new
      check_cols(ws, SCHEDULE_COLS, SCHEDULE_HEADER_ROW)

      # good spreadsheet, let's do this
      (SCHEDULE_HEADER_ROW + 1..ws.max_rows).each do |row|
        # don't do blank rows, but allow them just in case someone skips a row
        next if ws[row, 1] == ''

        e = {}
        e[:performers] = []
        e[:performers] << get_performer(ws, row, performers, 'Primary ')
        e[:performers] << get_performer(ws, row, performers, '2nd ')
        e[:performers] << get_performer(ws, row, performers, '3rd ')
        e[:performers] << get_performer(ws, row, performers, '4th ')
        e[:performers] << get_performer(ws, row, performers, '5th ')
        e[:performers] << get_performer(ws, row, performers, '6th ')
        e[:performers] << get_performer(ws, row, performers, '7th ')
        e[:performers] << get_performer(ws, row, performers, '8th ')
        e[:performers] = e[:performers].compact

        e[:cancelled]  = get_boolean(ws, row, 'Cancelled')

        if e[:performers].count == 0
          unless e[:cancelled]
            bad_name = ws[row, get_col('Primary Performer')]
            puts "Skipping unknown primary performer '#{bad_name}'"
            bad_performers << bad_name
            skipped_count += 1
          end
          next
        end

        e[:id] = ws[row, get_col('Event ID')]

        if event_ids.include?(e[:id])
          puts "Warning: Duplicate event IDs row #{row} ID: #{e[:id]} - fill in the Event Identifier column"
          dupe_event_count += 1
          next
        else
          event_ids.add(e[:id])
        end

        e[:forts] = []
        e[:forts] << get_fort(ws, row, 'Primary ')
        e[:forts] << get_fort(ws, row, '2nd ')
        e[:forts] = e[:forts].compact

        e[:name] = get_optional_string(ws, row, 'Event Name')
        e[:name] = e[:performers][0][:name] if e[:name].nil?

        # Recommended here to store DynamoDb datetime values in ISO 8601 string format
        # http://stackoverflow.com/questions/40905056/what-is-the-best-way-to-store-time-in-dynamodb-when-accuracy-is-important
        # but foster wants them without time zones so formatting as he requested
        e[:start_time]        = get_event_time(ws, row, 'Date', 'Start Time')
        e[:end_time]          = get_event_time(ws, row, 'Date', 'End Time')
        if e[:start_time] > e[:end_time]
          e[:end_time] = e[:end_time] + (24*60*60)
        end
        e[:start_time] = e[:start_time].strftime("%Y-%m-%eT%H:%M")
        e[:end_time] = e[:end_time].strftime("%Y-%m-%eT%H:%M")

        venue                 = get_required_string(ws, row, 'Venue')
        e[:venue]             = venues.find{ |value|
            value['name'] == venue
        }
        if e[:venue].nil?
          puts "Unknown venue: '#{venue}'"
          bad_venues << "#{e[:forts][0]}: #{e[:name]}: #{venue}"
        end

        # e[:venue][:image_url] = VENUE_IMAGE_BUCKET_URL + e[:venue][:Name] + '.jpg'
        e[:description]       = get_optional_string(ws, row, 'Description')
        e[:kidfort_approved]  = get_boolean(ws, row, 'Kidfort Approved')
        e[:all_ages]          = get_boolean(ws, row, 'All Ages')
        # e[:festival_day]      = day_offset

        begin
          puts "Writing event: #{e[:name]}"
          @db.put_item({ table_name: "#{@opts[:environment]}-event", item: e})
          event_count += 1
        rescue  Aws::DynamoDB::Errors::ServiceError => error
          puts 'Unable to add item'
          puts "#{error.message}"
        end
      end
    end
    puts "- #{event_count} events added, #{dupe_event_count} dupe events, #{skipped_count} unknown performers skipped, #{bad_venues.count} bad venues."

    puts "\nBad Venues:"
    puts bad_venues
    puts "\nBad Performers:"
    puts bad_performers
    puts "\n----- Ending: #{Time.now.strftime('%Y/%m/%d %H:%M')}. Writing to #{@opts[:environment]}\n\n"

  end

  # check to make sure the worksheet is in the expected format
  def check_cols(ws, cols, header_row)
    (1..cols.size).each do |col|
      unless ws[header_row, col].start_with?(cols[col - 1])
        abort "Unexpected column #{col} in google xls: #{ws[header_row, col]}. Expected: #{cols[col - 1]}"
      end
    end
  end

  def sheet_to_json(ws, expected_cols)
    check_cols(ws, expected_cols, 1)

    result = []
    (2..ws.max_rows).each do |row|
      # don't do blank rows, but allow them just in case someone skips a row
      next if ws[row, 1] == ''

      r = {}
      (1..expected_cols.count).each do |col|
        key_name = expected_cols[col - 1].downcase.gsub(' ', '_')
        r[key_name] = ws[row,col]
        r[key_name] = nil if r[key_name] == ''
      end
      result << r
    end
    result
  end

  def get_relative_time(ws, row, col_name, day_offset)
    time_string = ws[row, get_col(col_name)]
    time = FESTIVAL_START
    time = time + (day_offset * 24 * 60 * 60)
    event_time = Time.parse(time_string)
    time = time + (24 * 60 * 60) if event_time.hour < 6
    time + (event_time.hour * 60 * 60) + (event_time.min * 60)
  end

  def get_event_time(ws, row, date_col, time_col)
    date_string = ws[row, get_col(date_col)]
    time_string = ws[row, get_col(time_col)]

    full_string = "#{date_string} #{time_string} -0700"
    begin
      event_time = Time.strptime(full_string, "%m/%e/%Y %H:%M %z")
    rescue Exception => e
      puts "Invalid time format row: #{row}\t#{date_string}\t#{time_string}"
      return nil
    end
    event_time
  end

  def get_required_string(ws, row, col_name)
    value = ws[row, get_col(col_name)]
    puts "Invalid value '#{value}' for required string column '#{col_name}' row #{row}" if value == ''
    value
  end

  def get_optional_string(ws, row, col_name)
    value = ws[row, get_col(col_name)]
    value = nil if value == ''
    value
  end

  def get_boolean(ws, row, col_name)
    value = ws[row, get_col(col_name)]
    if value.downcase == 'yes'
      true
    elsif value.downcase == 'no'
      false
    elsif value == ''
      false
    else
      puts "Invalid value '#{value}' for boolean column '#{col_name}' row #{row}"
      false
    end
  end

  def get_performer(ws, row, performers, prefix)
    p = {}
    p[:id]  = ws[row, get_col("#{prefix}Performer ID")]
    p = nil if (p[:id] == '#N/A') || (p[:id] == '')

    unless p.nil?
      lookup = performers.find { |x| x['id'] == p[:id]}
      p[:name] = lookup['name']
      p[:home_town] = lookup['home_town']
      p[:forts] = lookup['forts']
    end
    p
  end

  def get_fort(ws, row, prefix)
    fort = ws[row, get_col("#{prefix}Fort")]
    fort = nil if fort == ''
    fort
  end

  def get_col(col_name)
    SCHEDULE_COLS.find_index(col_name) + 1
  end

end

# ----------------------------------------------------------------------------------------------------------------------
# only run this if running directly from script
ParseSchedule.new.run if __FILE__ == $PROGRAM_NAME
