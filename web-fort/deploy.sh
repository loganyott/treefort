#!/bin/sh

echo "Removing hidden files and directories prior to upload"
rm -rf .[!.]*

echo "Removing any node_modules subdirectories in this repo"
find . -name "node_modules" -type d -exec rm -rf "{}" \;

echo "Writing build details to footer.php"
sed -i "s/__user__/$CIRCLE_PROJECT_USERNAME/g" footer.php
sed -i "s/__repo__/$CIRCLE_PROJECT_REPONAME/g" footer.php
sed -i "s/__branch__/$CIRCLE_BRANCH/g" footer.php
sed -i "s/__build__/$CIRCLE_BUILD_NUM/g" footer.php

echo "Writing in the proper includes for tf-app"
sed -i "s|__PERFORMER_REACT_BUNDLE_JS__|$(ls ./tf-app/build/static/js/*.js)|g" header.php
sed -i "s|__PERFORMER_REACT_BUNDLE_CSS__|$(ls ./tf-app/build/static/css/*.css)|g" header.php

echo "Writing in the proper includes for tf-sched"
sed -i "s|__SCHEDULE_REACT_BUNDLE_JS__|$(ls ./tf-sched/build/static/js/*.js)|g" header.php
sed -i "s|__SCHEDULE_REACT_BUNDLE_CSS__|$(ls ./tf-sched/build/static/css/*.css)|g" header.php

echo "Uploading webfort theme with SFTP..."

# SSHPASS and username are passed in by circle.yml set in CircleCI config
export SSHPASS=$2
sshpass -e sftp -o BatchMode=no -o Port=2222 -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no -b - $1@104.199.122.45 << !
  -mkdir /web-fort
  put -r . /web-fort
  bye
!

if [ $? -eq 0 ]
then
  echo "All done, might need to purge cache!"
  exit 0
else
  echo "Something bad happened, SFTP failure!"
  exit 1
fi
