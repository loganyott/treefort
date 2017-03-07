# Server Setup for Instance `i-06f3fae79294fa61e` (ruby-etl)

These steps were performed by @elloboblanco on behalf of @bernhardtgl on 3/7/17. The steps to upload
our custom Ruby code are performed on builds by Circle CI (see circle.yml) in this repo's base 
directory.

## Instance Base Setup

The instance is a t2.micro running Amazon Linux in the default VPC in us-west-2. The instance has
a single security group allowing SSH (port 22) access from the entire world. Our build config in
Circle CI has treefort-backend.pem uploaded for this specific host so we can scp easily from 
within our build container.

##### Setup `$NICKNAME` and change prompts for ease of use
http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/set-hostname.html#set-hostname-shell

##### Set timezone to `America/Denver` 
http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/set-time.html

##### Install Ruby with RVM on Amazon Linux
Steps from: https://www.phusionpassenger.com/library/walkthroughs/deploy/ruby/aws/nginx/oss/install_language_runtime.html

###### Install Dependencies
    sudo yum install -y curl libcurl-devel gpg gcc gcc-c++ make

###### Install RVM
    sudo gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
    curl -sSL https://get.rvm.io | sudo bash -s stable
    sudo usermod -a -G rvm `whoami`

###### Install Ruby & Bundler
    rvm install ruby-2.2.2
    rvm --default use ruby-2.2.2
    gem install bundler --no-rdoc --no-ri

##### Make ~/submittable subdir and the logging subdirectory
    mkdir ~/submittable
    sudo mkdir /var/log/ruby-etl
    sudo chmod a+x /var/log/ruby-etl
    sudo chown ec2-user:ec2-user /var/log/ruby-etl
    touch /var/log/ruby-etl/parse_schedule.log
    touch /var/log/ruby-etl/parse_submittable.log

## Install Custom Code to Instance and Setup Cron

##### SCP this directory 
    scp -i ~/.ssh/treefort-backend.pem ./* ec2-user@ec2-54-245-4-151.us-west-2.compute.amazonaws.com:~/submittable/

##### Install ruby-etl Required gems
    bundle install

##### Setup crontab entries

    # run this command every hour on the hour
    0 * * * * /home/ec2-user/submittable/parse_schedule.rb -e prod >> /var/log/ruby-etl/parse_schedule.log

    # run this command at 4 and 10, am and pm
    0 4,10,16,22 * * * /home/submittable/parse_submittable.rb -a OTgwODRlMDMzZWM1NDEwNGExMTY1YTUwYzc5OWRhODU6 >> /var/log/ruby-etl/parse_submittable.log
