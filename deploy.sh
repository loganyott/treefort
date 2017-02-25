#!/bin/sh

# NOTE: we use a naming convention to determine which lambda function to use, see ${AWS_STAGE}

# override these settings if you want to tweak the build
CIRCLE_PROJECT_REPONAME=${CIRCLE_PROJECT_REPONAME:-'api-fort'}
CIRCLE_BRANCH=${CIRCLE_BRANCH:-`git branch | grep \* | cut -d ' ' -f2`}
CIRCLE_SHA1=${CIRCLE_SHA1:-'developer deployment'}

AWS_STAGE=${AWS_STAGE:-'dev'}
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-'us-west-2'}

# useful output to verify our settings
echo "Deploying ${CIRCLE_PROJECT_REPONAME}/${CIRCLE_BRANCH} to ${AWS_STAGE} stage in ${AWS_DEFAULT_REGION}"

echo "Deploying etl lambda function";
cd src;
zip -r ../etl.zip ./etl.js ./lib ../node_modules > /dev/null;
cd ..;
aws lambda update-function-code --function-name etl --zip-file fileb://etl.zip;

echo "Deploying events-api lambda function";
cd src;
zip -r ../events-api.zip ./events-api.js ./lib ./controllers ../node_modules > /dev/null;
cd ..;
aws lambda update-function-code --function-name ${AWS_STAGE}-events-api --zip-file fileb://events-api.zip;

echo "Deploying lines-api lambda function";
cd src
zip -r ../lines-api.zip ./lines-api.js ./lib ./controllers ../node_modules > /dev/null
cd ..
aws lambda update-function-code --function-name ${AWS_STAGE}-lines-api --zip-file fileb://lines-api.zip;

echo "Deploying performers-api lambda function";
cd src;
zip -r ../performers-api.zip ./performers-api.js ./lib ./controllers ../node_modules > /dev/null;
cd ..;
aws lambda update-function-code --function-name ${AWS_STAGE}-performers-api --zip-file fileb://performers-api.zip;

echo "Deploying playlists-api lambda function";
cd src
zip -r ../playlists-api.zip ./playlists-api.js ./lib ./controllers ../node_modules > /dev/null
cd ..
aws lambda update-function-code --function-name ${AWS_STAGE}-playlists-api --zip-file fileb://playlists-api.zip;

echo "Uploading apigateway definition";
aws --region us-west-2 apigateway put-rest-api --rest-api-id 7n74ikdn58 --mode overwrite --body 'file://./src/api-gateway/TreefortAPI-dev-swagger.json'

# create our actual API Gateway deployment

echo "Deploying apigateway definition to stage: ${AWS_STAGE}";
aws --region us-west-2 apigateway create-deployment --rest-api-id 7n74ikdn58 --stage-name ${AWS_STAGE} --description "${CIRCLE_SHA1}"
