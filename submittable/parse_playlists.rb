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

  PERFORMER_COLS = ['ARTIST','CITY, ST','ANNOUNCE DATE','ORDER','','NOTES','PLAYLIST'].freeze


  def run
    @opts = Trollop.options do
      banner <<-EOS
        Usage:
          xxx.rb [options]

      EOS

      opt :environment, "Where to write the data. Possible values: #{ENVIRONMENTS.join(', ')}",
          type: :string,
          default: 'prod' # this script only works on prod because etl doesn't have songs in the same format as prod
      opt :playlist_names, 'Only the named playlists', type: :strings
      opt :write, 'Actually write, otherwise just report on what would be done'
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

    ws = session.spreadsheet_by_key('1Dbemc4xy6uVPTvojga7mzZK4CbzfqlVOCLs5ffbUrm0').worksheet_by_title('Bandzzzz')
    playlists = Set.new
    performer_info = sheet_to_json(ws, PERFORMER_COLS)
    performer_info.map! { |p|
      if p['playlist'].nil?
        p['playlist_list'] = []
      else
        p['playlist_list'] = p['playlist'].split(',')
        p['playlist_list'].map! { |list_item| list_item.strip.downcase }

        p['playlist_list'].each { |list_item| playlists << list_item unless list_item == ''}
      end
      p
    }
    playlists = playlists.sort_by(&:downcase)
    # playlists.each { |p| puts p }

    # Using a "Treefort" AWS profile on my machine as described on
    # http://docs.aws.amazon.com/sdkforruby/api/index.html#Configuration
    Aws.config.update({region: 'us-west-2', profile:'Treefort'})
    @db = Aws::DynamoDB::Client.new

    bad_performers = []
    playlists_count = 0
    begin
      resp = @db.scan({table_name: "#{@opts[:environment]}-performer", attributes_to_get: %w(id name song)}).to_h
      performers = resp[:items]

      playlists.each do |playlist_name|
        next unless @opts[:playlist_names].nil? || @opts[:playlist_names].include?(playlist_name)

        playlist_performers = performer_info.select{ |pi| pi['playlist_list'].include?(playlist_name)}

        # AWS uses string for hash keys, so using strings to be consistent
        # noinspection RubyStringKeysInHashInspection
        playlist_db = { 'id' => playlist_name, 'name' => playlist_name, 'order' => playlist_name, 'songs' => []}
        playlist_performers.each do |pp|
          performer_name = pp['artist']
          performer = performers.find{ |p| p['name'].downcase == performer_name.downcase}
          if performer.nil?
            bad_performers << performer_name
            # puts "Bad performer: #{performer_name}"
          else
            playlist_db['songs'] << performer['song'] unless performer['song'].nil?
          end
        end
        puts "#{playlist_name}\tfound #{playlist_db['songs'].count} songs."
        playlists_count += 1
        if @opts[:write]
          @db.put_item({ table_name: "#{@opts[:environment]}-playlist", item: playlist_db})
        end
      end
    rescue  Aws::DynamoDB::Errors::ServiceError => error
      puts "#{error.message}"
    end


    puts "\n- #{playlists_count} playlists processed. #{@opts[:write] ? 'Written to DynamoDB' : 'Did not write to DynamoDB (use -w)'}"
    puts "\n#{bad_performers.count} Bad Performers"
    puts bad_performers
    puts "----- Ending: #{Time.now.strftime('%Y/%m/%d %H:%M')}. Writing to #{@opts[:environment]}\n\n"

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

  # check to make sure the worksheet is in the expected format
  def check_cols(ws, cols, header_row)
    (1..cols.size).each do |col|
      unless ws[header_row, col].start_with?(cols[col - 1])
        abort "Unexpected column #{col} in google xls: #{ws[header_row, col]}. Expected: #{cols[col - 1]}"
      end
    end
  end

end

# ----------------------------------------------------------------------------------------------------------------------
# only run this if running directly from script
ParseSchedule.new.run if __FILE__ == $PROGRAM_NAME
