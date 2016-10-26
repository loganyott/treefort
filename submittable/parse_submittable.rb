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
      }
  end
end

# see Trollop description
class ParseSubmittable
  attr_accessor :opts

  HOST = 'https://api.submittable.com'.freeze
  YEAR = '2017'

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
    end

    # text = File.read('categories.json')

    CurbFu::Request.global_headers = {
        :'Authorization' => "Basic #{@opts[:submittable_auth]}",
        :'Cache-Control' => 'no-cache'
    }

    response = CurbFu.get(HOST + '/v1/categories')
    categories = JSON.parse(response.body)
    year_categories = categories['items'].select { |cat| cat['name'].include?('2017') }
    year_filter = year_categories.collect { |cat| "&category_id=#{cat['category_id']}" }.join

    # response = CurbFu.get(HOST + "/v1/submissions?status=accepted")
    # TODO: waiting for Megan to response on how to filter the submissions - not by "accepted" status
    result_page = 1
    page_size = 2
    performers = []
    loop do
      response = CurbFu.get(HOST + "/v1/submissions?count=#{page_size}&page=#{result_page}#{year_filter}")
      submissions = JSON.parse(response.body)
      page_count = submissions['total_pages']
      page_count = [2, page_count].min if @opts[:debug]

      submissions['items'].each do |submission|
        # filter by label?
        # next unless labels.include?('TO WEB TEAM')

        p = Performer.new
        p.name = submission['title']
        p.code = "#{YEAR}-#{submission['submission_id']}"
        p.forts = [ submission['category']['name'].strip ] # some have trailing spaces

        if submission['files']
          images = submission['files'].select { |file| file['mime_type'].start_with?('image') }
          songs  = submission['files'].select { |file| file['mime_type'].start_with?('audio') }
        end

        # think we might need these
        if submission['labels'].nil?
          labels = []
        else
          label_items = submission['labels']['items']
          labels = label_items.collect { |label| "#{label['label_text']}" }
        end

        performers << p
        puts "#{p.name}\t#{p.code}\t#{p.forts}\t#{labels}"
      end
      result_page += 1
      break if result_page > page_count

    end

    write_performers(performers) if @opts[:write_data]
  end

  def write_performers(performers)

    # I'm using this method of getting credentials to ruby in ~/.profile
    # export AWS_ACCESS_KEY_ID=...
    # export AWS_SECRET_ACCESS_KEY=...
    # Other methods mentioned on http://docs.aws.amazon.com/sdkforruby/api/index.html#Configuration
    # ,endpoint: "http://localhost:8000" to run local
    Aws.config.update({region: 'us-west-2', profile:'Treefort'})

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
