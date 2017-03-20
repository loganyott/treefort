#!/usr/bin/env ruby

require 'trollop'
require 'aws-sdk'

# see Trollop description
class DayPlaylist
  attr_accessor :opts

  ENVIRONMENTS = %w(etl dev prod).freeze

  # noinspection RubyStringKeysInHashInspection
  def run
    @opts = Trollop.options do
      banner <<-EOS
        Usage:
          xxx.rb [options]

      EOS

      opt :environment, "Where to write the data. Possible values: #{ENVIRONMENTS.join(', ')}",
          type: :string,
          default: 'prod' # this script only works on prod because etl doesn't have songs in the same format as prod
      opt :write, 'Actually write, otherwise just report on what would be done'
    end

    Trollop.die 'Invalid environment' unless ENVIRONMENTS.include?(@opts[:environment])

    puts "----- Starting: #{Time.now.strftime('%Y/%m/%d %H:%M')}. Writing to #{@opts[:environment]}"

    # Using a "Treefort" AWS profile on my machine as described on
    # http://docs.aws.amazon.com/sdkforruby/api/index.html#Configuration
    Aws.config.update({region: 'us-west-2', profile:'Treefort'})
    @db = Aws::DynamoDB::Client.new

    begin
      resp = @db.scan({table_name: "#{@opts[:environment]}-event", attributes_to_get: %w(performers start_time)}).to_h
      events = resp[:items]
      resp = @db.scan({table_name: "#{@opts[:environment]}-performer", attributes_to_get: %w(id name song)}).to_h
      performers = resp[:items]

      # any event starting before 3am is considered part of the previous day.
      events.map do |event|
        event['festival_day'] = Time.strptime(event['start_time'], '%Y-%m-%eT%H:%M') - (3 * 60 * 60)
        event['weekday'] = event['festival_day'].strftime('%A')
      end

      day_playlists = {'Wednesday' => [], 'Thursday' => [], 'Friday' => [], 'Saturday' => [], 'Sunday' => []}
      events.each do |event|
        event['performers'].each do |event_performer|
          full_performer = performers.find{ |p| p['id'] == event_performer['id'] }

          song = nil
          song = full_performer['song'] unless full_performer.nil?
          day_playlists[event['weekday']] << song unless song.nil?
        end
        # puts "#{event['start_time']}"
      end

      sort_order = 4 # because 0-3 are taken
      day_playlists.each do |name, songs|
        playlist_db = { 'id' => name, 'name' => "Fest Day: #{name}", 'order' => "A#{sort_order}", 'songs' => songs}
        puts "Writing #{songs.count} songs to #{name}"
        puts songs.map{ |s| s['artist_name']}.join("\n")

        if @opts[:write]
          @db.put_item({ table_name: "#{@opts[:environment]}-playlist", item: playlist_db})
        end
        sort_order += 1
      end

    rescue  Aws::DynamoDB::Errors::ServiceError => error
      puts "#{error.message}"
    end

    # puts "\n- #{playlists_count} playlists processed. #{@opts[:write] ? 'Written to DynamoDB' : 'Did not write to DynamoDB (use -w)'}"
    # puts "\n#{bad_performers.count} Bad Performers"
    # puts bad_performers
    puts "----- Ending: #{Time.now.strftime('%Y/%m/%d %H:%M')}. Writing to #{@opts[:environment]}\n\n"

  end

end

# ----------------------------------------------------------------------------------------------------------------------
# only run this if running directly from script
DayPlaylist.new.run if __FILE__ == $PROGRAM_NAME
