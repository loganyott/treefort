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
  attr_accessor :tier
  attr_accessor :sort_order_within_tier
  attr_accessor :genres

  # URLs to our CDN in S3
  attr_accessor :image_url
  attr_accessor :image_url_med
  attr_accessor :image_app_url
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
  attr_accessor :orig_image_app_url # from submittable
  attr_accessor :orig_song_url  # from submittable

  def initialize
    @forts = []
    @genres = []
  end

  def to_json
    {
      name: name,
      code: code,
      id: code, # junger wanted this too, same as code
      bio: bio,
      forts: forts,
      home_town: home_town,
      genres: genres,
      wave: wave,
      tier: tier,
      sort_order_within_tier: sort_order_within_tier,

      image_url: image_url,
      image_url_med: image_url_med,
      image_app_url: image_app_url,
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
  IMAGE_FORM_IDS = [784411,685181]
  IMAGE_APP_FORM_IDS = [826341, 828739]

  def run
    @opts = Trollop.options do
      banner <<-EOS
        Usage:
          xxx.rb [options]

          sadhash

      EOS

      opt :auth_token_submittable, 'token to use for submittable login. See @gregb',
          type: :string,
          short: 'a'
      opt :debug, 'For debugging, only load a small number of results',
          short: 'd'
      opt :write_performers, 'Actually write data to AWS DynamoDB',
          short: 'w'
      opt :write_files, 'Write songs and images to AWS S3, unless they already exist',
          short: 'f'
      opt :overwrite_files, 'Write songs and images to AWS S3, EVEN IF they already exist',
          short: 'o'
      opt :performer, 'just do this named performer',
          short: 'p',
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
    page_size = @opts[:debug] ? 20 : 200
    performers = []
    ready_to_begin = @opts[:performer].nil?

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
          labels = labels.map(&:downcase) # so we can call "include" in a case-insensitive way
        end

        # if not debugging, pick the "real" artists
        next unless @opts[:debug] ||
            labels.include?("1st announce (#{YEAR})")
            # || labels.include?("2nd announce (#{YEAR})")
            # || labels.include?("3rd announce (#{YEAR})")

        # allows the app skip a bunch of work if it failed in the middle of a batch of processing
        unless @opts[:performer].nil?
          ready_to_begin = ready_to_begin || (submission['title'].downcase == @opts[:performer].downcase)
        end
        next unless ready_to_begin

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

        if labels.include?('tier 1')
          p.tier = 1
        elsif labels.include?('tier 2')
          p.tier = 2
        elsif labels.include?('tier 3')
          p.tier = 3
        elsif labels.include?('tier 4')
          p.tier = 4
        else
          puts "Warning, no tier specified for #{p.name}"
          p.tier = 5
        end

        p.home_town              = submission_form_field(submission, 'City, State')
        p.bio                    = submission_form_field(submission, 'Description')
        p.genres                 = submission_form_field(submission, 'Genre')
        p.genres = p.genres.split(',') unless p.genres.nil?
        p.music_url              = submission_form_field(submission, 'Music')
        p.video_url              = submission_form_field(submission, 'Video 1')
        p.website_url            = submission_form_field(submission, 'Website')
        p.facebook_url           = submission_form_field(submission, 'Facebook')
        p.twitter_url            = submission_form_field(submission, 'Twitter')
        p.instagram_url          = submission_form_field(submission, 'Instagram')
        p.sort_order_within_tier = submission_form_field(submission, 'Venue ID')

        if p.sort_order_within_tier.nil?  # make un-set values last
          p.sort_order_within_tier = 999999
        else
          p.sort_order_within_tier = p.sort_order_within_tier.to_i
        end

        if submission['files']
          images = submission['files'].select     { |file| IMAGE_FORM_IDS.include?(file['form_field_id']) }
          images_app = submission['files'].select { |file| IMAGE_APP_FORM_IDS.include?(file['form_field_id']) }

          songs  = submission['files'].select { |file| file['mime_type'].start_with?('audio/mp3') || file['mime_type'].start_with?('audio/mpeg')}
          puts "Warning: #{images.count} images for #{p.name}. Using first one." if images.count > 1
          puts "Warning: No images for #{p.name}." if images.count == 0

          puts "Warning: #{images_app.count} app images for #{p.name}. Using first one." if images_app.count > 1
          puts "Warning: No app images for #{p.name}." if images_app.count == 0

          puts "Warning: #{songs.count} songs for #{p.name}. Using first one." if songs.count > 1
          puts "Warning: No songs for #{p.name}." if songs.count == 0

          if images.count == 1
            p.orig_image_url = HOST + images.first['url']
            p.image_url = "#{IMAGE_BUCKET_URL}#{p.code}.jpg"
            p.image_url_med = "#{IMAGE_BUCKET_URL}#{p.code}-med.jpg"
          end
          if images_app.count == 1
            p.orig_image_app_url = HOST + images_app.first['url']
            p.image_app_url = "#{IMAGE_BUCKET_URL}#{p.code}-app.jpg"
          end
          if images.count == 1
            p.orig_image_url = HOST + images.first['url']
            p.image_url = "#{IMAGE_BUCKET_URL}#{p.code}.jpg"
            p.image_url_med = "#{IMAGE_BUCKET_URL}#{p.code}-med.jpg"
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
        puts "Performer: #{p.name} sort #{p.sort_order_within_tier}"

        # stop doing stuff
        unless @opts[:performer].nil?
          ready_to_begin = false
        end
      end
      result_page += 1
      break if result_page > page_count

    end

    puts
    write_files(performers) if @opts[:write_files] || @opts[:overwrite_files]
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
      begin
          if p.orig_image_url
          bucket_key = "#{p.code}.jpg"
          begin
            if image_bucket.object(bucket_key).exists? && !@opts[:overwrite_files]
              puts "Skipping existing large image. Already in S3 for performer #{p.name}"
            else
              response = CurbFu.get(p.orig_image_url)
              if response.status == 200

                File.open("/tmp/#{bucket_key}", 'wb') do |f|
                  f.binmode
                  f.write response.body
                  f.close
                end
                puts "Writing large image to S3 for performer #{p.name}"
                image_bucket.object(bucket_key).upload_file("/tmp/#{bucket_key}")
                p.image_url = "#{IMAGE_BUCKET_URL}#{bucket_key}"
              else
                puts "Couldn't download image for performer #{p.name}: #{p.orig_image_url}"
              end
            end
          rescue Aws::S3::Errors::ServiceError => error
            puts 'Unable to add image'
            puts "#{error.message}"
          end
        end

        # if there is a medium size image locally (created by @gbernhardt batch process right now, upload it
        # as well
        begin
          bucket_key = "#{p.code}-med.jpg"
          if image_bucket.object(bucket_key).exists? && !@opts[:overwrite_files]
            puts "Skipping existing medium image. Already in S3 for performer #{p.name}"
          else
            if File.exists?("/tmp/#{bucket_key}")
              puts "Writing medium image to S3 for performer #{p.name} #{bucket_key}"
              image_bucket.object(bucket_key).upload_file("/tmp/#{bucket_key}")
              p.image_url_med = "#{IMAGE_BUCKET_URL}#{bucket_key}"
            else
              puts "Warning, No medium image locally for performer #{p.name} #{bucket_key}"
            end
          end
        rescue Aws::S3::Errors::ServiceError => error
          puts 'Unable to add image'
          puts "#{error.message}"
        end

        if p.orig_image_app_url
          response = CurbFu.get(p.orig_image_app_url)
          if response.status == 200
            bucket_key = "#{p.code}-app.jpg"

            File.open("/tmp/#{bucket_key}", 'wb') do |f|
              f.binmode
              f.write response.body
              f.close
            end

            begin
              if image_bucket.object(bucket_key).exists? && !@opts[:overwrite_files]
                puts "Skipping existing app image. Already in S3 for performer #{p.name}"
              else
                puts "Writing app image to S3 for performer #{p.name}"
                image_bucket.object(bucket_key).upload_file("/tmp/#{bucket_key}")
                p.image_app_url = "#{IMAGE_BUCKET_URL}#{bucket_key}"
              end
            rescue Aws::S3::Errors::ServiceError => error
              puts 'Unable to add image'
              puts "#{error.message}"
            end
          else
            puts "Couldn't download app image for performer #{p.name}: #{p.orig_image_app_url}"
          end
        end

        if p.orig_song_url
          bucket_key = "#{p.code}.mp3"
          if song_bucket.object(bucket_key).exists? && !@opts[:overwrite_files]
            puts "Skipping existing song. Already in S3 for performer #{p.name}"
          else
            response = CurbFu.get(p.orig_song_url)
            if response.status == 200
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
            else
              puts "Couldn't download song for performer #{p.name}: #{p.orig_song_url}"
            end
          end
        end
      rescue Error => error
        puts 'Unable to so soemthing'
        puts "#{error.message}"
        puts "#{error.class}"
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
