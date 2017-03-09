#!/usr/bin/env ruby

require 'trollop'
# require 'net/scp'
require 'json'
require 'curb-fu'
require 'aws-sdk'
require 'id3tag'
require 'mini_magick'
require_relative 'song_overrides'
require 'cgi'
class Performer
  attr_accessor :code
  attr_accessor :bio
  attr_accessor :forts
  attr_accessor :tags
  attr_accessor :home_town
  attr_accessor :name
  attr_accessor :wave
  attr_accessor :tier
  attr_accessor :sort_order_within_tier
  attr_accessor :genres
  attr_accessor :class_title
  attr_accessor :class_summary

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
    @tags = []
    @genres = []
  end

  def to_json
    {
      name: name,
      code: code,
      id: code, # junger wanted this too, same as code
      bio: bio,
      forts: forts,
      tags: tags,
      home_town: home_town,
      genres: genres,
      wave: wave,
      tier: tier,
      sort_order_within_tier: sort_order_within_tier,

      image_url: image_url,
      image_url_med: image_url_med,
      image_app_url: image_app_url,
      song_url: song_url,
      orig_song_name: orig_song_name,

      class_title: class_title,
      class_summary: class_summary,

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

  # different forms in Treefort/Hackfort/Comedyfort. Grrr
  IMAGE_FORM_IDS = [784411,685181, 748881, 693367, 740786, 740838, 862943, 884097, 912075, 912732, 794773, 685249, 692837].freeze
  IMAGE_APP_FORM_IDS = [826341, 828739, 842155, 842157, 842161, 862950, 884114, 912744, 912745, 842156, 842159].freeze

  ENVIRONMENTS = %w(etl dev).freeze
  LOCAL_IMAGE_SRC_PATH = '/Users/gregb/dev/treefort/app-fort/www/img/performers/'.freeze
  # change this to your path to check in images to app-fort too
  # LOCAL_IMAGE_SRC_PATH = '/tmp/'.freeze

  def run
    @opts = Trollop.options do
      banner <<-EOS
        Usage:
          xxx.rb [options]

          Read data from submittable.

          Write data to AWS DynamoDB and files to S3. If files already exist in S3 they are not
          rewritten unless you specify --overwrite

      EOS

      opt :auth_token_submittable, 'token to use for submittable login. See @gregb',
          type: :string
      opt :debug, 'For debugging, only load a small number of results'
      opt :environment, "Where to write the data. Possible values: #{ENVIRONMENTS.join(', ')}",
          type: :string,
          default: ENVIRONMENTS.first()
      opt :overwrite, 'Write data to AWS DynamoDB and files to S3. Write files EVEN IF they already exist in S3'
      opt :performer, 'just do this named performer',
          type: :string
      opt :delete_all_first, 'clear out before starting', short: 'x'
      opt :start_page, 'start at this submittable page',
          type: :integer, default: 1

      conflicts :start_page, :performer
    end

    Trollop.die 'Invalid environment' unless ENVIRONMENTS.include?(@opts[:environment])

    puts "----- Starting: #{Time.now.strftime('%Y/%m/%d %H:%M')}. Writing to #{@opts[:environment]}"

    CurbFu::Request.global_headers = {
        :'Authorization' => "Basic #{@opts[:auth_token_submittable]}",
        :'Cache-Control' => 'no-cache'
    }
    # Using a "Treefort" AWS profile on my machine as described on
    # http://docs.aws.amazon.com/sdkforruby/api/index.html#Configuration
    Aws.config.update({region: 'us-west-2', profile:'Treefort'})
    @s3 = Aws::S3::Resource.new
    @db = Aws::DynamoDB::Client.new

    write_count = 0

    response = CurbFu.get(HOST + '/v1/categories')
    categories = JSON.parse(response.body)
    year_categories = categories['items'].select { |cat| cat['name'].include?('2017') }
    year_filter = year_categories.collect { |cat| "&category_id=#{cat['category_id']}" }.join

    result_page = @opts[:start_page]
    page_size = @opts[:debug] ? 20 : 200
    ready_to_begin = @opts[:performer].nil?

    if @opts[:delete_all_first]
      puts 'Clearing DynamoDB table'

      begin
        @db.delete_table( {table_name: "#{@opts[:environment]}-performer"})
      rescue Aws::DynamoDB::Errors::ResourceNotFoundException => error
        puts 'Table does not exist to delete. Skipping'
      end

      begin
        retries ||= 0
        @db.create_table({table_name: "#{@opts[:environment]}-performer",
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
                                  read_capacity_units: 5,
                                  write_capacity_units: 5
                              }
                         })
      rescue Aws::DynamoDB::Errors::ServiceError
        puts "Not deleted yet. Try #{retries + 1}"
        sleep 2 # seconds
        retry if (retries += 1) < 10
      end
    end

    puts 'Searching submittable for performers meeting your criteria'
    loop do
      if @opts[:performer]
        esc_performer = CGI.escape(@opts[:performer])
        response = CurbFu.get(HOST + "/v1/submissions?count=#{page_size}&search=#{esc_performer}#{year_filter}")
      else
        response = CurbFu.get(HOST + "/v1/submissions?count=#{page_size}&page=#{result_page}#{year_filter}")
      end
      submissions = JSON.parse(response.body)
      page_count = submissions['total_pages']
      page_count = [2, page_count].min if @opts[:debug]
      puts "Page #{result_page} of #{page_count} from submittable"

      submissions['items'].each do |submission|
        # filter by label
        labels = []
        if !submission['labels'].nil?
          label_items = submission['labels']['items']
          if !label_items.nil?
            labels = label_items.collect { |label| "#{label['label_text']}" }
            labels = labels.map(&:downcase) # so we can call "include" in a case-insensitive way
          end
        end

        # if not debugging, pick the "real" artists
        next unless
            labels.include?("1st announce (#{YEAR})") ||
            labels.include?("2nd announce (#{YEAR})") ||
            labels.include?("3rd announce (#{YEAR})") ||
            labels.include?("alefort#{YEAR}") ||
            labels.include?("comedyfort#{YEAR}") ||
            labels.include?("filmfort#{YEAR}") ||
            labels.include?("foodforttastes#{YEAR}") ||
            labels.include?("foodforttalks#{YEAR}") ||
            labels.include?("gallery#{YEAR}") ||
            labels.include?("hackfort#{YEAR}") ||
            labels.include?("kidfort#{YEAR}") ||
            labels.include?("performanceart#{YEAR}") ||
            labels.include?("storyfort#{YEAR}") ||
            labels.include?("yogafort#{YEAR}")

        next if submission['is_archived']

        # just do a single one
        unless @opts[:performer].nil?
          ready_to_begin = ready_to_begin || (submission['title'].downcase == @opts[:performer].downcase)
        end
        next unless ready_to_begin

        p = Performer.new
        p.name = submission['title']
        p.code = "#{YEAR}-#{submission['submission_id']}"

        category = submission['category']['name'].strip # some have trailing spaces
        p.forts =
            case category
              when 'MUSIC SUBMISSIONS 2017'               then ['Treefort']
              when 'CONFIRMED ARTIST ASSETS 2017'         then ['Treefort']
              else
                []
            end
        p.forts << 'Alefort'        if labels.include?("alefort#{YEAR}")
        p.forts << 'Comedyfort'     if labels.include?("comedyfort#{YEAR}")
        p.forts << 'Filmfort'       if labels.include?("filmfort#{YEAR}")
        p.forts << 'Foodfort'       if labels.include?("foodfort#{YEAR}")
        p.forts << 'Galleryfort'    if labels.include?("gallery#{YEAR}")
        p.forts << 'Hackfort'       if labels.include?("hackfort#{YEAR}")
        p.forts << 'Kidfort'        if labels.include?("kidfort#{YEAR}")
        p.forts << 'Performanceart' if labels.include?("performanceart#{YEAR}")
        p.forts << 'Storyfort'      if labels.include?("storyfort#{YEAR}")
        p.forts << 'Yogafort'       if labels.include?("yogafort#{YEAR}")

        p.forts << 'Filmfortfeature' if labels.include?("featurefilm")
        p.forts << 'Filmfortshort'  if labels.include?("shortfilm")
        p.forts << 'Filmfortspecial' if labels.include?("special events")
        p.forts << 'Foodforttastes' if labels.include?("foodforttastes#{YEAR}")
        p.forts << 'Foodforttalks'  if labels.include?("foodforttalks#{YEAR}")
        p.forts << 'YogafortArtist' if labels.include?("yogafort #{YEAR} artist")
        p.forts << 'YogafortInstructor' if labels.include?("yogafort #{YEAR} instructor")

        if labels.include?('canada')
          p.tags << 'Canada'
        end

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
          puts "Warning, no tier specified for #{p.name}" if p.forts.include? 'Treefort'
          p.tier = 5
        end

        p.home_town              = submission_form_field(submission, 'City, State')
        p.bio                    = submission_form_field(submission, 'Description')
        if p.name == 'Fortcraft'
          # submittable is returning old data!
          p.bio = "New in 2017, Fortcraft is an open interactive building experience for kids and parents and anyone in between. Like a real world Minecraft you can use cardboard, tape, markers and chalk to build the fort of your dreams, add on to other forts, decorate existing structures or make something else entirely.\n\nThroughout the event, structures will be made, taken down and remade again into something new. There is no wrong way to Fortcraft.\n\nUnder the direction of Travis Olson, challenges will be suggested. Kids can choose to participate in them or ignore them completely. Examples: Connect Four Forts Challenge, Tall Fort Challenge, Robot Costume Challenge, Dinosaur Challenge."
        elsif p.name == 'Michael Robinson'
          p.bio = "For \"Rules Of The Game\", choreographer Jonah Bokaer, esteemed set designer Daniel Arsham, and the Grammy- winning musician Pharrell Williams join forces with producers and directors Ben Paluba and Michael Robinson . The result is a groundbreaking performance piece. \n\n“Skin In The Game” is a project that explores the process behind resetting, refining and presenting a dance performance and seeks to promote new avenues for audiences to be transported by the art of choreography and movement. Using new methods and technologies, including panoramic 360º video capture of the dancers in rehearsal, we are able to give viewers a never before seen position and perspective inside the dance, literally amongst the dancers, as they prepare work for the stage. \n\nThe inspiration for “Skin in the Game” was a shared vision of Virtual Reality as a truly collaborative intersection between choreographer, dancers, director, visual artist and technologist. The VR environment has great power to expand the creative potential for movement production, presentation, and duplication, as well as fostering interdisciplinary dialogue with artists and creators across the media landscape.\n\n__________________________________________\n\nSkin in the Game will show in the JUMP Pioneer Room lobby  from 11:30 am-12:45 pm on Friday, 11:00 am-12:30 pm Saturday, and 11:30am-1:00pm Sunday."
        end
        if p.bio.nil?
          # Comedyfort
          p.bio                  = submission_form_field(submission, 'Artist Bio')
        end
        if p.bio.nil?
          # Hackfort
          p.bio                  = submission_form_field(submission, 'Please provide a brief description or bio of yourself. This can include previous projects, skills or accomplishments related to your field. ')
        end
        if p.bio.nil?
          # Yogafort
          p.bio                  = submission_form_field(submission, 'Instructor Biography ')
        end
        if p.bio.nil?
          # Storyfort
          p.bio                  = submission_form_field(submission, 'Writer Bio')
        end
        if p.bio.nil?
          # Filmfort
          p.bio                  = submission_form_field(submission, 'Synopsis')
        end
        if p.bio.nil?
          # Foodfort
          p.bio = submission_form_field(submission, 'CHEF NAME')
          add = submission_form_field(submission, 'DISH 1 NAME AND DESCRIPTION')
          p.bio = p.bio + "\n\n" + add unless add.nil?
          add = submission_form_field(submission, 'DISH 2 NAME AND DESCRIPTION')
          p.bio = p.bio + "\n" + add unless add.nil?
          add = submission_form_field(submission, 'FEATURED FARM PRODUCER 1')
          p.bio = p.bio + "\n\n" + add unless add.nil?
          add = submission_form_field(submission, 'FEATURED FARM PRODUCER 2')
          p.bio = p.bio + "\n" + add unless add.nil?
        end

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

        p.class_title   = submission_form_field(submission, 'Class Title')
        p.class_summary = submission_form_field(submission, 'Short Class Summary')

        puts "\t#{p.name}\t#{p.code}\t#{p.forts.join(',')}\t#{p.home_town}"

        if submission['files']
          images = submission['files'].select     { |file| IMAGE_FORM_IDS.include?(file['form_field_id']) }
          images_app = submission['files'].select { |file| IMAGE_APP_FORM_IDS.include?(file['form_field_id']) }
          songs  = submission['files'].select     { |file| file['mime_type'] && (
                                                           file['mime_type'].start_with?('audio/mp3') ||
                                                           file['mime_type'].start_with?('audio/mpeg'))}

          puts "Warning: #{images.count} images for #{p.name}. Using first one." if images.count > 1
          puts "Warning: No images for #{p.name}." if images.count == 0

          puts "Warning: #{images_app.count} app images for #{p.name}. Using first one." if images_app.count > 1
          puts "Warning: No app images for #{p.name}." if images_app.count == 0

          puts "Warning: #{songs.count} songs for #{p.name}. Using first one." if songs.count > 1
          puts "Warning: No songs for #{p.name}." if songs.count == 0 && p.forts.include?('Treefort')

          if images.count >= 1
            p.orig_image_url = HOST + images.first['url']
            p.image_url = "#{IMAGE_BUCKET_URL}#{p.code}.jpg"
            p.image_url_med = "#{IMAGE_BUCKET_URL}#{p.code}-med.jpg"
          end
          if images_app.count >= 1
            p.orig_image_app_url = HOST + images_app.first['url']
            p.image_app_url = "#{IMAGE_BUCKET_URL}#{p.code}-app.jpg"
          end
          if songs.count >= 1
            p.orig_song_url = HOST + songs.first['url']
            p.orig_song_name = songs.first['file_name']
            p.song_url = "#{SONG_BUCKET_URL}#{p.code}.mp3"
          end
        else
          puts "Warning: No songs or images for #{p.name}."
        end

        # puts "Performer: #{p.name}"

        write_files(p)
        write_performer(p)
        write_count += 1

      end
      result_page += 1
      break if result_page > page_count

    end
    puts "\n- #{write_count} performers written."
    puts "----- Ending: #{Time.now.strftime('%Y/%m/%d %H:%M')}. Writing to #{@opts[:environment]}\n\n"

  end

  def submission_form_field(submission, field_name)
    ret = nil
    if submission['form']['items']
      item = submission['form']['items'].find { |item|
        unless item['label'].nil?
          item['label'].strip.downcase == field_name.strip.downcase
        end
      }
      ret = item['data'] unless item.nil?
      ret = (ret == '') ? nil : ret
    end
    ret
  end

  def write_files(p)
    image_bucket = @s3.bucket(IMAGE_BUCKET_NAME)
    song_bucket = @s3.bucket(SONG_BUCKET_NAME)

    if p.orig_image_url
      bucket_key = "#{p.code}.jpg"
      begin
        if image_bucket.object(bucket_key).exists? && !@opts[:overwrite]
          # puts "Skipping existing large image. Already in S3 for performer #{p.name}"
        else
          response = CurbFu.get(p.orig_image_url)
          if response.status == 200

            File.open("/tmp/#{bucket_key}", 'wb') do |f|
              f.binmode
              f.write response.body
              f.close
            end

            puts "Writing large image to S3 for performer #{p.name}: #{bucket_key}"
            image_bucket.object(bucket_key).upload_file("/tmp/#{bucket_key}")
          else
            puts "Couldn't download image for performer #{p.name}: #{p.orig_image_url}"
          end
        end
      rescue => error
        puts 'Unable to add image'
        puts "#{error.message}"
      end
    end

    if p.orig_image_url
      bucket_key = "#{p.code}-med.jpg"
      begin
        if image_bucket.object(bucket_key).exists? && !@opts[:overwrite]
          # puts "Skipping existing medium image. Already in S3 for performer #{p.name}"
        else
          response = CurbFu.get(p.orig_image_url)
          if response.status == 200

            File.open("#{LOCAL_IMAGE_SRC_PATH}#{bucket_key}", 'wb') do |f|
              f.binmode
              f.write response.body
              f.close
            end

            # resize it
            image = MiniMagick::Image.new("#{LOCAL_IMAGE_SRC_PATH}#{bucket_key}")
            image.resize '400' # 400 wide, as much height as needed to preserve aspect ratio

            puts "Writing medium image to S3 for performer #{p.name}: #{bucket_key}"
            image_bucket.object(bucket_key).upload_file("#{LOCAL_IMAGE_SRC_PATH}#{bucket_key}")
          end
        end
      rescue => error
        puts 'Unable to add image'
        puts "#{error.message}"
      end
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
          if image_bucket.object(bucket_key).exists? && !@opts[:overwrite]
            # puts "Skipping existing app image. Already in S3 for performer #{p.name}"
          else
            puts "Writing app image to S3 for performer #{p.name}: #{bucket_key}"
            image_bucket.object(bucket_key).upload_file("/tmp/#{bucket_key}")
          end
        rescue => error
          puts 'Unable to add image'
          puts "#{error.message}"
        end
      else
        puts "Couldn't download app image for performer #{p.name}: #{p.orig_image_app_url}"
      end
    end

    if p.orig_song_url
      bucket_key = "#{p.code}.mp3"
      if song_bucket.object(bucket_key).exists? && !@opts[:overwrite]
        # puts "Skipping existing song. Already in S3 for performer #{p.name}"
      else
        response = CurbFu.get(p.orig_song_url)
        if response.status == 200
          File.open("/tmp/#{bucket_key}", 'wb') do |f|
            f.binmode
            f.write response.body
            f.close
          end

          begin
            puts "Writing song  to S3 for performer #{p.name}: #{bucket_key}"
            song_bucket.object(bucket_key).upload_file("/tmp/#{bucket_key}")
          rescue Aws::S3::Errors::ServiceError => error
            puts 'Unable to add song'
            puts "#{error.message}"
          rescue => error
            puts 'Unable to add song; Other error'
            puts "#{error.message}"
          end

          orig_song_filename = p.orig_song_name.sub('.mp3','')

          # extract title
          mp3_file = File.open("/tmp/#{bucket_key}", "rb")
          tag = ID3Tag.read(mp3_file)

          song = {id: p.code, title: tag.title, performer: p.name, orig_song_filename: orig_song_filename}
          song[:title] = nil if song[:title] == '' # Found an empty string from one song
          song[:title] = orig_song_filename if song[:title].nil?

          # write the override_title if it exists. These are done by hand by @gregb because MP3 files and metadata are
          # usually wrong
          if SongOverrides::OVERRIDES.key?(p.code.to_sym)
            song[:override_title] = SongOverrides::OVERRIDES[p.code.to_sym]
          else
            # never seen this song before, note it for @gregb to process. Add more info to make it easier
            write_item_to_table(song, "#{@opts[:environment]}-song-check")
            song[:override_title] = nil
          end

          # extract the album art
          if tag.get_frames(:PIC) == [] && tag.get_frames(:APIC) == []
            puts 'No album art'
          else
            content = tag.get_frames(:PIC) unless tag.get_frames(:PIC) == []
            content = tag.get_frames(:APIC) unless tag.get_frames(:APIC) == []
            content = content.first.content

            image_filename = "#{p.code}-albumart.jpg"
            song[:album_art] = IMAGE_BUCKET_URL + image_filename
            image_full_path = "/tmp/#{image_filename}"
            File.open(image_full_path, 'wb') do |f|
              f.binmode
              f.write content
              f.close
            end

            # resize it, some embedded mp3 images are huge (8.7Mb)
            image = MiniMagick::Image.new(image_full_path)
            image.resize '300x300'

            puts "Writing album art to S3 for performer #{p.name}: #{image_filename}"
            image_bucket.object(image_filename).upload_file(image_full_path)
          end
          write_item_to_table(song, "#{@opts[:environment]}-song")

        else
          puts "Couldn't download song for performer #{p.name}: #{p.orig_song_url}"
        end
      end
    end
  end

  def write_item_to_table(item, table_name)
    begin
      # j = item.to_json
      @db.put_item({ table_name: table_name, item: item})
    rescue  Aws::DynamoDB::Errors::ServiceError => error
      puts 'Unable to add item'
      puts "#{error.message}"
    end

  end

  def write_performer(p)
    # puts 'Writing performer info to DynamoDB'
    begin
      jp = p.to_json
      @db.put_item({ table_name: "#{@opts[:environment]}-performer", item: jp})
    rescue  Aws::DynamoDB::Errors::ServiceError => error
      puts 'Unable to add performer'
      puts "#{error.message}"
    end

  end

end

# ----------------------------------------------------------------------------------------------------------------------
# only run this if running directly from script
ParseSubmittable.new.run if __FILE__ == $PROGRAM_NAME
