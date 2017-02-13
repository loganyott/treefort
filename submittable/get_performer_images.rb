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
class GetPerformerImages
  IMAGE_BUCKET_NAME = 'treefort-images'.freeze
  WRITE_PATH = '/Users/gregb/dev/treefort/app-fort/www/img/performers/'.freeze

  def run
    # Using a "Treefort" AWS profile on my machine as described on
    # http://docs.aws.amazon.com/sdkforruby/api/index.html#Configuration
    Aws.config.update({region: 'us-west-2', profile:'Treefort'})
    @s3 = Aws::S3::Resource.new

    image_bucket = @s3.bucket(IMAGE_BUCKET_NAME)
    count = 0
    image_bucket.objects.each do |s3file|
      name = s3file.key
      next unless name.end_with?('-med.jpg')

      s3file.get({response_target: "#{WRITE_PATH}#{name}"} )
      count += 1
      # File.open("#{WRITE_PATH}#{name}", 'wb') do |outputfile|
      #   outputfile.write(s3file.get)
      # end
    end
    puts "#{count} images copied to #{WRITE_PATH}"
  end


end

# ----------------------------------------------------------------------------------------------------------------------
# only run this if running directly from script
GetPerformerImages.new.run if __FILE__ == $PROGRAM_NAME
