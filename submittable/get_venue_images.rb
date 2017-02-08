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
class GetVenueImages
  IMAGE_BUCKET_NAME = 'treefort-venue-images'.freeze


  def run
    # Using a "Treefort" AWS profile on my machine as described on
    # http://docs.aws.amazon.com/sdkforruby/api/index.html#Configuration
    Aws.config.update({region: 'us-west-2', profile:'Treefort'})
    @s3 = Aws::S3::Resource.new

    image_bucket = @s3.bucket(IMAGE_BUCKET_NAME)

    VENUES.each do |venue|
      venue_image_url = venue[:ImageUrl]
      venue_name = venue[:Name]

      response = CurbFu.get(venue_image_url)
      if response.status == 200
        bucket_key = "#{venue_name}.jpg"

        File.open("/tmp/#{bucket_key}", 'wb') do |f|
          f.binmode
          f.write response.body
          f.close
        end

        begin
          puts "Writing venue image to S3 for #{venue_name}: #{bucket_key}"
          image_bucket.object(bucket_key).upload_file("/tmp/#{bucket_key}")
        rescue => error
          puts 'Unable to add image'
          puts "#{error.message}"
        end
      else
        puts "Couldn't download image for venue #{venue_name}: #{venue_image_url}"
      end
    end

  end


end

# ----------------------------------------------------------------------------------------------------------------------
# only run this if running directly from script
GetVenueImages.new.run if __FILE__ == $PROGRAM_NAME
