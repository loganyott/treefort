#!/usr/bin/env ruby

require 'trollop'
# require 'net/scp'
require 'json'
require 'curb-fu'
require 'aws-sdk'

class Performer
  attr_accessor :code
  attr_accessor :bio
  attr_accessor :forts
  attr_accessor :home_town
  attr_accessor :image_url
  attr_accessor :name
  attr_accessor :social_url
  attr_accessor :song_url
  attr_accessor :wave

  attr_accessor :orig_song_name
  attr_accessor :orig_image_url # from submittable
  attr_accessor :orig_song_url  # from submittable

  def initialize
    @forts = []
  end

  def to_json
    {
      code: code,
      bio: bio,
      forts: forts,
      home_town: home_town,
      image_url: image_url,
      name: name,
      social_url: social_url,
      song_url: song_url,
      wave: wave
      # ,orig_song_name: orig_song_name   # not yet in API
      }
  end
end

# see Trollop description
class ParseSubmittable
  attr_accessor :opts

  HOST = 'https://api.submittable.com'.freeze
  YEAR = '2017'.freeze
  IMAGE_BUCKET_NAME = 'treefort-images'.freeze
  SONG_BUCKET_NAME  = 'treefort-songs'.freeze
  IMAGE_BUCKET_URL = "https://s3-us-west-2.amazonaws.com/#{IMAGE_BUCKET_NAME}/".freeze
  SONG_BUCKET_URL  = "https://s3-us-west-2.amazonaws.com/#{SONG_BUCKET_NAME}/".freeze
  def run
    @opts = Trollop.options do
      banner <<-EOS
        Usage:
          xxx.rb [options]

          sadhash

      EOS

      opt :submittable_auth, 'token to use for submittable login. See @gregb', type: :string
      opt :debug, 'For debugging, only load a small number of results'
      opt :write_data, 'Actually write data to AWS DynamoDB'
      opt :performer_to_start_at, 'Writing MP3s takes time, in case something fails, start with this named performer',
          type: :string
    end

    # text = File.read('categories.json')

    CurbFu::Request.global_headers = {
        :'Authorization' => "Basic #{@opts[:submittable_auth]}",
        :'Cache-Control' => 'no-cache'
    }
    # Using a "Treefort" AWS profile on my machine as described on
    # http://docs.aws.amazon.com/sdkforruby/api/index.html#Configuration
    Aws.config.update({region: 'us-west-2', profile:'Treefort'})

    response = CurbFu.get(HOST + '/v1/categories')
    categories = JSON.parse(response.body)
    year_categories = categories['items'].select { |cat| cat['name'].include?('2017') }
    year_filter = year_categories.collect { |cat| "&category_id=#{cat['category_id']}" }.join

    # response = CurbFu.get(HOST + "/v1/submissions?status=accepted")
    # TODO: waiting for Megan to response on how to filter the submissions - not by "accepted" status
    result_page = 1
    page_size = 20
    performers = []
    ready_to_start = @opts[:performer_to_start_at].nil?

    loop do
      response = CurbFu.get(HOST + "/v1/submissions?count=#{page_size}&page=#{result_page}#{year_filter}")
      submissions = JSON.parse(response.body)
      page_count = submissions['total_pages']
      page_count = [2, page_count].min if @opts[:debug]

      submissions['items'].each do |submission|
        # filter by label?
        # next unless labels.include?('TO WEB TEAM')

        # for debugging, let the app skip a bunch of work
        unless @opts[:performer_to_start_at].nil?
          ready_to_start = ready_to_start || (submission['title'] == @opts[:performer_to_start_at])
        end
        next unless ready_to_start

        p = Performer.new
        p.name = submission['title']
        p.code = "#{YEAR}-#{submission['submission_id']}"
        p.forts = [ submission['category']['name'].strip ] # some have trailing spaces

        if submission['files']
          images = submission['files'].select { |file| file['mime_type'].start_with?('image/jpeg') }
          songs  = submission['files'].select { |file| file['mime_type'].start_with?('audio/mp3') }
          puts "Warning: #{images.count} images for #{p.name}. Using first one." if images.count > 1
          puts "Warning: No images for #{p.name}." if images.count == 0
          puts "Warning: #{songs.count} songs for #{p.name}. Using first one." if songs.count > 1
          puts "Warning: No songs for #{p.name}." if songs.count == 0

          p.orig_image_url = HOST + images.first['url'] if images.count == 1
          p.orig_song_url = HOST + songs.first['url'] if songs.count == 1
          p.orig_song_name = songs.first['file_name'] if songs.count == 1
        else
          puts "Warning: No songs or images for #{p.name}."
        end

        # think we might need these
        if submission['labels'].nil?
          labels = []
        else
          label_items = submission['labels']['items']
          labels = label_items.collect { |label| "#{label['label_text']}" }
        end

        performers << p
        # puts "#{p.name}\t#{p.code}\t#{p.forts}\t#{labels}"
      end
      result_page += 1
      break if result_page > page_count

    end

    write_files(performers)
    write_performers(performers) if @opts[:write_data]
  end

  def write_files(performers)
    resource = Aws::S3::Resource.new
    image_bucket = resource.bucket(IMAGE_BUCKET_NAME)
    song_bucket = resource.bucket(SONG_BUCKET_NAME)

    performers.each do |p|
      if p.orig_image_url
        response = CurbFu.get(p.orig_image_url)
        if response.status == 200
          bucket_key = "#{p.code}.jpg"
          File.open("/tmp/#{bucket_key}", 'wb') do |f|
            f.binmode
            f.write response.body
            f.close
          end

          begin
            puts "Writing image to S3 for performer #{p.name}"
            image_bucket.object(bucket_key).upload_file("/tmp/#{bucket_key}")
            p.image_url = "#{IMAGE_BUCKET_URL}#{bucket_key}"
          rescue Aws::S3::Errors::ServiceError => error
            puts 'Unable to add image'
            puts "#{error.message}"
          end
        end
      end

      if p.orig_song_url
        response = CurbFu.get(p.orig_song_url)
        if response.status == 200
          bucket_key = "#{p.code}.mp3"
          File.open("/tmp/#{bucket_key}", 'wb') do |f|
            f.binmode
            f.write response.body
            f.close
          end

          begin
            puts "Writing song  to S3 for performer #{p.name}"
            song_bucket.object(bucket_key).upload_file("/tmp/#{bucket_key}")
            p.song_url = "#{SONG_BUCKET_URL}#{bucket_key}"
          rescue Aws::S3::Errors::ServiceError => error
            puts 'Unable to add song'
            puts "#{error.message}"
          end
        end
      end
    end
  end

  def write_performers(performers)

    db = Aws::DynamoDB::Client.new
    begin
      performers.each do |p|
        jp = p.to_json
        db.put_item({ table_name: 'Performer', item: jp})
      end
    rescue  Aws::DynamoDB::Errors::ServiceError => error
      puts 'Unable to add performer'
      puts "#{error.message}"
    end

  end

end

# ----------------------------------------------------------------------------------------------------------------------
# only run this if running directly from script
ParseSubmittable.new.run if __FILE__ == $PROGRAM_NAME
