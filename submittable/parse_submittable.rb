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
  attr_accessor :name
  attr_accessor :wave
  attr_accessor :genres

  # URLs to our CDN in S3
  attr_accessor :image_url
  attr_accessor :song_url

  # social URLs
  attr_accessor :music_url
  attr_accessor :video_url
  attr_accessor :website_url
  attr_accessor :facebook_url
  attr_accessor :twitter_url
  attr_accessor :instagram_url

  attr_accessor :orig_song_name

  # Submittable URLs for things that we will upload into S3 to store in our own CDN
  attr_accessor :orig_image_url # from submittable
  attr_accessor :orig_song_url  # from submittable

  def initialize
    @forts = []
    @genres = []
  end

  def to_json
    {
      code: code,
      bio: bio,
      forts: forts,
      home_town: home_town,
      name: name,
      genres: genres,
      wave: wave,
      image_url: image_url,
      song_url: song_url,

      music_url: music_url,
      video_url: video_url,
      website_url: website_url,
      facebook_url: facebook_url,
      twitter_url: twitter_url,
      instagram_url: instagram_url
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

      opt :auth_token_submittable, 'token to use for submittable login. See @gregb',
          type: :string
      opt :debug, 'For debugging, only load a small number of results'
      opt :write_performers, 'Actually write data to AWS DynamoDB',
          short: 'p'
      opt :write_files, 'Actually write songs and images to AWS S3',
          short: 'f'
      opt :performer_to_start_at, 'Writing MP3s takes time, in case something fails, start with this named performer',
          short: 's',
          type: :string
    end

    CurbFu::Request.global_headers = {
        :'Authorization' => "Basic #{@opts[:auth_token_submittable]}",
        :'Cache-Control' => 'no-cache'
    }
    # Using a "Treefort" AWS profile on my machine as described on
    # http://docs.aws.amazon.com/sdkforruby/api/index.html#Configuration
    Aws.config.update({region: 'us-west-2', profile:'Treefort'})

    response = CurbFu.get(HOST + '/v1/categories')
    categories = JSON.parse(response.body)
    year_categories = categories['items'].select { |cat| cat['name'].include?('2017') }
    year_filter = year_categories.collect { |cat| "&category_id=#{cat['category_id']}" }.join

    result_page = 1
    page_size = @opts[:debug] ? 20 : 100
    performers = []
    ready_to_start = @opts[:performer_to_start_at].nil?

    loop do
      response = CurbFu.get(HOST + "/v1/submissions?count=#{page_size}&page=#{result_page}#{year_filter}")
      submissions = JSON.parse(response.body)
      page_count = submissions['total_pages']
      page_count = [2, page_count].min if @opts[:debug]

      submissions['items'].each do |submission|
        # filter by label
        if submission['labels'].nil?
          labels = []
        else
          label_items = submission['labels']['items']
          labels = label_items.collect { |label| "#{label['label_text']}" }
        end

        # if not debugging, pick the "real" artists
        next unless @opts[:debug] ||
            labels.include?("1st announce (#{YEAR})") ||
            labels.include?("2nd announce (#{YEAR})") ||
            labels.include?("3rd announce (#{YEAR})")

        # allows the app skip a bunch of work if it failed in the middle of a batch of processing
        unless @opts[:performer_to_start_at].nil?
          ready_to_start = ready_to_start || (submission['title'] == @opts[:performer_to_start_at])
        end
        next unless ready_to_start

        p = Performer.new
        p.name = submission['title']
        p.code = "#{YEAR}-#{submission['submission_id']}"
        category = submission['category']['name'].strip # some have trailing spaces
        fort =
            case category
              when 'MUSIC SUBMISSIONS 2017'               then 'Treefort'
              when 'CONFIRMED ARTIST ASSETS 2017'         then 'Treefort'
              when 'PERFORMANCE ART SUBMISSIONS 2017'     then 'Performance Art'
              when 'FILMFORT SUBMISSIONS 2017'            then 'Filmfort'
              when 'COMEDYFORT SUBMISSIONS 2017'          then 'Comedyfort'
              when 'YOGAFORT 2017 PERFORMER SUBMISSIONS'  then 'Yogafort'
              when 'YOGAFORT 2017 TEACHER SUBMISSIONS'    then 'Yogafort'
              else
                puts "Warning: unknown caetgory #{category}"
                ''
            end
        p.forts = [fort] # array of 1 item for now

        if labels.include?("1st announce (#{YEAR})")
          p.wave = 1
        elsif labels.include?("2nd announce (#{YEAR})")
          p.wave = 2
        elsif labels.include?("3rd announce (#{YEAR})")
          p.wave = 3
        else
          p.wave = 0
        end

        p.home_town     = submission_form_field(submission, 'City, State')
        p.bio           = submission_form_field(submission, 'Description')
        p.genres        = submission_form_field(submission, 'Genre')
        p.genres = p.genres.split(',') unless p.genres.nil?
        p.music_url     = submission_form_field(submission, 'Music')
        p.video_url     = submission_form_field(submission, 'Video 1')
        p.website_url   = submission_form_field(submission, 'Website')
        p.facebook_url  = submission_form_field(submission, 'Facebook')
        p.twitter_url   = submission_form_field(submission, 'Twitter')
        p.instagram_url = submission_form_field(submission, 'Instagram')

        if submission['files']
          images = submission['files'].select { |file| file['mime_type'].start_with?('image/jpeg') }
          songs  = submission['files'].select { |file| file['mime_type'].start_with?('audio/mp3') }
          puts "Warning: #{images.count} images for #{p.name}. Using first one." if images.count > 1
          puts "Warning: No images for #{p.name}." if images.count == 0
          puts "Warning: #{songs.count} songs for #{p.name}. Using first one." if songs.count > 1
          puts "Warning: No songs for #{p.name}." if songs.count == 0

          if images.count == 1
            p.orig_image_url = HOST + images.first['url']
            p.image_url = "#{IMAGE_BUCKET_URL}#{p.code}.jpg"
          end
          if songs.count == 1
            p.orig_song_url = HOST + songs.first['url']
            p.orig_song_name = songs.first['file_name']
            p.song_url = "#{SONG_BUCKET_URL}#{p.code}.mp3"
          end
        else
          puts "Warning: No songs or images for #{p.name}."
        end

        performers << p
        puts "Performer: #{p.name}"
      end
      result_page += 1
      break if result_page > page_count

    end

    puts
    write_files(performers) if @opts[:write_files]
    write_performers(performers) if @opts[:write_performers]
  end

  def submission_form_field(submission, field_name)
    ret = nil
    item = submission['form']['items'].find { |item| item['label'] == field_name }
    ret = item['data'] unless item.nil?
    ret = (ret == '') ? nil : ret
    ret
  end

  def write_files(performers)
    puts 'Writing image and song files to S3'
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
    puts 'Writing performer info to DynamoDB'

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
