#!/usr/bin/env ruby

require 'google_drive'
require 'trollop'

# see Trollop description
class ParseOfficialSchedule
  attr_accessor :opts

  VENUE_HEADER_ROW = 4
  ALLAGES_HEADER_ROW = 5
  SCHEDULE_START_ROW = 6

  START_COL = 2
  FESTIVAL_START = Time.new(2017,03,22,0,0,0,'-07:00')

  # noinspection RubyStringKeysInHashInspection
  PROD_SHEETS ={
      'WEDNESDAY' => Time.new(2017,03,22,0,0,0,'-07:00'),
      'THURSDAY'  => Time.new(2017,03,23,0,0,0,'-07:00'),
      'FRIDAY'    => Time.new(2017,03,24,0,0,0,'-07:00'),
      'SATURDAY'  => Time.new(2017,03,25,0,0,0,'-07:00'),
      'SUNDAY'    => Time.new(2017,03,26,0,0,0,'-07:00'),
      }

  def run
    @opts = Trollop.options do
      banner <<-EOS
        Usage:
          parse_official_schedule.rb [options]

          parse doc at: https://docs.google.com/spreadsheets/d/1m04dsW5fy11_mOKgEnl2IjjltYvBK5jWnJ8LHIubAyU/edit#gid=10
      EOS
    end

    # Next 2 lines are from: https://github.com/google/google-api-ruby-client/issues/253
    # to avoid error: Uncaught exception: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed
    cert_path = Gem.loaded_specs['google-api-client'].full_gem_path+'/lib/cacerts.pem'
    ENV['SSL_CERT_FILE'] = cert_path

    # See this document to learn how to create config.json:
    # https://github.com/gimite/google-drive-ruby/blob/master/doc/authorization.md
    session = GoogleDrive::Session.from_service_account_key('Treefort Events 2017-d9872630951c.json')

    sheets = PROD_SHEETS
    sheets.each do |title, sheet_day|
      puts "Processing sheet '#{title}'"
      ws = session.spreadsheet_by_key('1m04dsW5fy11_mOKgEnl2IjjltYvBK5jWnJ8LHIubAyU').worksheet_by_title(title)

      # check_cols(ws, SCHEDULE_COLS, SCHEDULE_HEADER_ROW)

      venue_cols = []
      (START_COL..ws.max_cols).each do |col|
        v = {}
        v[:name] = ws[VENUE_HEADER_ROW, col].strip
        v[:all_ages] = ws[ALLAGES_HEADER_ROW, col].strip
        venue_cols << v
      end

      (START_COL..ws.max_cols).each do |col|
        (SCHEDULE_START_ROW..ws.max_rows).each do |row|
          next if ws[row, col] == ''

          e = {}
          text = ws[row,col]
          parts = text.split("\n")
          next if parts.count != 2

          e[:performer] = parts[0]
          start_end = parts[1].split(' - ')
          e[:start_time] = start_end[0] + "pm"
          e[:end_time] = start_end[1] + "pm"
          e[:date] = sheet_day
          e[:venue] = venue_cols[col - START_COL][:name]
          e[:all_ages] = venue_cols[col - START_COL][:all_ages]
          puts "#{e[:performer]}\t\t\t\t\tTreefort\t\t\t\t#{e[:date].strftime('%m/%d/%Y')}\t#{e[:start_time]}\t#{e[:end_time]}\t#{e[:venue]}\t\t\t\t#{e[:all_ages]}"
        end

      end
    end
  end
end

# ----------------------------------------------------------------------------------------------------------------------
# only run this if running directly from script
ParseOfficialSchedule.new.run if __FILE__ == $PROGRAM_NAME
