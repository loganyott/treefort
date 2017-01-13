#!/usr/bin/env ruby

require 'trollop'
# require 'net/scp'
require 'json'
require 'curb-fu'
require 'aws-sdk'
require 'id3tag'
require 'mini_magick'
require_relative 'song_overrides'

# see Trollop description
class SongMetadata
  attr_accessor :opts

  YEAR = '2017'.freeze
  SONG_BUCKET_NAME  = 'treefort-songs'.freeze
  IMAGE_BUCKET_NAME = 'treefort-images'.freeze
  SONG_BUCKET_URL  = "https://s3-us-west-2.amazonaws.com/#{SONG_BUCKET_NAME}/".freeze
  IMAGE_BUCKET_URL = "https://s3-us-west-2.amazonaws.com/#{IMAGE_BUCKET_NAME}/".freeze

  ENVIRONMENTS = %w(etl dev).freeze

  def run
    @opts = Trollop.options do
      banner <<-EOS
        Usage:
          xxx.rb [options]

          sadhash

      EOS

      opt :environment, "Where to write the data. Possible values: #{ENVIRONMENTS.join(', ')}",
          type: :string,
          default: ENVIRONMENTS.first()

      # opt :write_files, 'Write songs and images to AWS S3, unless they already exist',
      #     short: 'f'
      opt :performer_id, 'just do this IDed performer',
          short: 'p',
          type: :string
    end
    Trollop.die 'Invalid environment' unless ENVIRONMENTS.include?(@opts[:environment])

    # Using a "Treefort" AWS profile on my machine as described on
    # http://docs.aws.amazon.com/sdkforruby/api/index.html#Configuration
    Aws.config.update({region: 'us-west-2', profile:'Treefort'})
    resource = Aws::S3::Resource.new
    song_bucket = resource.bucket(SONG_BUCKET_NAME)
    image_bucket = resource.bucket(IMAGE_BUCKET_NAME)

    Dir.mkdir('/tmp/albumart/') unless Dir.exist?('/tmp/albumart/')

    db = Aws::DynamoDB::Client.new
    begin
      # songs = []
      song_bucket.objects.select do |song_file|
        performer_id = song_file.key.sub('.mp3','')
        next if @opts[:performer_id] &&  @opts[:performer_id] != performer_id

        puts song_file.key
        song_file.get(response_target: "/tmp/#{song_file.key}")
        mp3_file = File.open("/tmp/#{song_file.key}", "rb")
        tag = ID3Tag.read(mp3_file)
        puts "#{tag.artist} - #{tag.title}"

        song = {id: performer_id, title: tag.title}
        song[:title] = nil if song[:title] == '' # Dynamo does not like empty strings

        # write the override_title if it exists. These are done by hand by @gregb because MP3 files and metadata are
        # usually wrong
        song[:override_title] = SongOverrides::OVERRIDES[performer_id.to_sym]

        if tag.get_frames(:PIC) == [] && tag.get_frames(:APIC) == []
          puts 'No album art'
        else
          content = tag.get_frames(:PIC) unless tag.get_frames(:PIC) == []
          content = tag.get_frames(:APIC) unless tag.get_frames(:APIC) == []
          content = content.first.content

          image_filename = "#{performer_id}-albumart.jpg"
          song[:album_art] = IMAGE_BUCKET_URL + image_filename
          image_full_path = "/tmp/albumart/#{image_filename}"
          File.open(image_full_path, 'wb') do |f|
            f.binmode
            f.write content
            f.close
          end

          # resize it, some embedded mp3 images are huge (8.7Mb)
          image = MiniMagick::Image.new(image_full_path)
          image.resize '300x300'

          puts "Writing album art image to S3 for performer #{performer_id}"
          image_bucket.object(image_filename).upload_file(image_full_path)
        end
        db.put_item({ table_name: "#{@opts[:environment]}-song", item: song})

        # get out early
        exit if @opts[:performer_id]
      end
    end

  end

  # def write_songs(songs)
  #   puts 'Writing song info to DynamoDB'
  #
  #   db = Aws::DynamoDB::Client.new
  #   begin
  #     songs.each do |p|
  #       # jp = p.to_json
  #       db.put_item({ table_name: 'Song', item: p})
  #     end
  #   rescue  Aws::DynamoDB::Errors::ServiceError => error
  #     puts 'Unable to add song'
  #     puts "#{error.message}"
  #   end
  #
  # end

end

# ----------------------------------------------------------------------------------------------------------------------
# only run this if running directly from script
SongMetadata.new.run if __FILE__ == $PROGRAM_NAME
