#!/usr/bin/env ruby

require 'google_drive'
require 'trollop'
# require 'net/scp'
require 'curb-fu'
require 'aws-sdk'
# require 'id3tag'
# require 'mini_magick'
require_relative 'venue.rb'

# see Trollop description
class ParseSchedule
  attr_accessor :opts

  ENVIRONMENTS = %w(etl dev prod).freeze
  PROD_ENVIRONMENT = 'prod'.freeze

  HEADER_ROW = 2
  FESTIVAL_START = Time.new(2017,03,22,0,0,0,'-07:00')
  VENUE_IMAGE_BUCKET_URL = "https://s3-us-west-2.amazonaws.com/treefort-venue-images/".freeze

  COLS =
      ['Primary Performer', '2nd Performer', '3rd Performer', '4th Performer', '5th Performer',
       'Primary Fort', '2nd Fort', 'Event Identifier',
       'Event Name', 'Date', 'Start Time', 'End Time', 'Venue', 'Description',
       'Kidfort Approved', 'Cancelled', 'All Ages',
       'Event ID',
       'Primary Performer ID', '2nd Performer ID', '3rd Performer ID', '4th Performer ID', '5th Performer ID']

  DEV_SHEETS = ['Example']
  PROD_SHEETS =['Treefort', 'Alefort', 'Comedyfort', 'Filmfort', 'Foodfort', 'Hackfort', 'Kidfort',
                'Performance Art', 'Skatefort', 'Yogafort']

  def run
    @opts = Trollop.options do
      banner <<-EOS
        Usage:
          xxx.rb [options]

      EOS

      opt :environment, "Where to write the data. Possible values: #{ENVIRONMENTS.join(', ')}",
          type: :string,
          default: ENVIRONMENTS.first
      opt :performer, 'just do this named performer',
          type: :string

    end

    Trollop.die 'Invalid environment' unless ENVIRONMENTS.include?(@opts[:environment])

    # Next 2 lines are from: https://github.com/google/google-api-ruby-client/issues/253
    # to avoid error: Uncaught exception: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed
    cert_path = Gem.loaded_specs['google-api-client'].full_gem_path+'/lib/cacerts.pem'
    ENV['SSL_CERT_FILE'] = cert_path

    puts "----- Starting: #{Time.now.strftime('%Y/%m/%d %H:%M')}. Writing to #{@opts[:environment]}"

    # See this document to learn how to create config.json:
    # https://github.com/gimite/google-drive-ruby/blob/master/doc/authorization.md
    session = GoogleDrive::Session.from_service_account_key('Treefort Events 2017-d9872630951c.json')

    # Using a "Treefort" AWS profile on my machine as described on
    # http://docs.aws.amazon.com/sdkforruby/api/index.html#Configuration
    Aws.config.update({region: 'us-west-2', profile:'Treefort'})
    @db = Aws::DynamoDB::Client.new

    # title = 'Day Example'
    # day_offset = 0
    sheets = (@opts[:environment] == PROD_ENVIRONMENT) ? PROD_SHEETS : DEV_SHEETS
    sheets.each do |title|
      puts "Processing sheet '#{title}'"
      ws = session.spreadsheet_by_key('1KcErm07C4Hf_wBk-rxSOa9b8-4mUChcDyBhjmPyCSGU').worksheet_by_title(title)

      event_ids = Set.new
      # check to make sure the worksheet is in the expected format
      (1..COLS.size).each do |col|
        unless ws[HEADER_ROW, col].start_with?(COLS[col - 1])
          abort "Unexpected column #{col} in google xls: #{ws[HEADER_ROW, col]}. Expected: #{COLS[col - 1]}"
        end
      end

      # good spreadsheet, let's do this
      (HEADER_ROW + 1..ws.max_rows).each do |row|
        # don't do blank rows, but allow them just in case someone skips a row
        next if ws[row, 1] == ''

        e = {}
        e[:id] = ws[row, get_col('Event ID')]

        if event_ids.include?(e[:id])
          puts "Warning: Duplicate event IDs: #{e[:id]} row #{row} - fill in the Event Identifier column"
          next
        else
          event_ids.add(e[:id])
        end

        e[:performers] = []
        e[:performers] << get_performer(ws, row, 'Primary ')
        e[:performers] << get_performer(ws, row, '2nd ')
        e[:performers] << get_performer(ws, row, '3rd ')
        e[:performers] << get_performer(ws, row, '4th ')
        e[:performers] << get_performer(ws, row, '5th ')
        e[:performers] = e[:performers].compact

        e[:forts] = []
        e[:forts] << get_fort(ws, row, 'Primary ')
        e[:forts] << get_fort(ws, row, '2nd ')
        e[:forts] = e[:forts].compact

        e[:name] = ws[row, get_col('Event Name')]
        e[:name] = e[:performers][0][:name] if e[:name] == ''

        # Recommended here to store DynamoDb datetime values in ISO 8601 string format
        # http://stackoverflow.com/questions/40905056/what-is-the-best-way-to-store-time-in-dynamodb-when-accuracy-is-important
        e[:start_time]        = get_event_time(ws, row, 'Date', 'Start Time').iso8601
        e[:end_time]          = get_event_time(ws, row, 'Date', 'End Time').iso8601
        venue                 = get_required_string(ws, row, 'Venue')
        e[:venue]             = VENUES.find{ |value|
            value[:Name] == venue
        }
        puts "Unknown venue: '#{venue}'" if e[:venue].nil?

        e[:venue][:image_url] = VENUE_IMAGE_BUCKET_URL + e[:venue][:Name] + '.jpg'
        e[:description]       = get_optional_string(ws, row, 'Description')
        e[:kidfort_approved]  = get_boolean(ws, row, 'Kidfort Approved')
        e[:cancelled]         = get_boolean(ws, row, 'Cancelled')
        e[:all_ages]          = get_boolean(ws, row, 'All Ages')
        # e[:festival_day]      = day_offset

        begin
          puts "Writing event: #{e[:name]}"
          @db.put_item({ table_name: "#{@opts[:environment]}-event", item: e})
        rescue  Aws::DynamoDB::Errors::ServiceError => error
          puts 'Unable to add item'
          puts "#{error.message}"
        end
      end
    end
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
    Time.strptime(full_string, "%m/%e/%Y %H:%M %z")
    # Time.strptime(full_string, '%e/%m/%Y %H:%M')

    # after_midnight = (event_time.hour < 6)

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

  def get_performer(ws, row, prefix)
    p = {}
    p[:id]  = ws[row, get_col("#{prefix}Performer ID")]
    p[:name] = ws[row, get_col("#{prefix}Performer")]
    p = nil if p[:id] == '#N/A'
    p
  end

  def get_fort(ws, row, prefix)
    fort = ws[row, get_col("#{prefix}Fort")]
    fort = nil if fort == ''
    fort
  end

  def get_col(col_name)
    COLS.find_index(col_name) + 1
  end

end

# ----------------------------------------------------------------------------------------------------------------------
# only run this if running directly from script
ParseSchedule.new.run if __FILE__ == $PROGRAM_NAME
