#!/bin/sh

# override these settings if you want to tweak the build
CIRCLE_PROJECT_REPONAME=${CIRCLE_PROJECT_REPONAME:-'api-fort'}
CIRCLE_BRANCH=${CIRCLE_BRANCH:-`git branch | grep \* | cut -d ' ' -f2`}
CIRCLE_SHA1=${CIRCLE_SHA1:-'developer deployment'}

AWS_STAGE=${AWS_STAGE:-'dev'}
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-'us-west-2'}

# useful output to verify our settings
echo "Deploying ${CIRCLE_PROJECT_REPONAME}/${CIRCLE_BRANCH} to ${AWS_STAGE} stage in ${AWS_DEFAULT_REGION}"

# deploy the events lambda function
# TODO: implement a staged approach here
zip -j events-api.zip ./src/events-api.js > /dev/null
aws lambda update-function-code --function-name eventsAPI --zip-file fileb://events-api.zip

# deploy the performers lambda function to the desired stage
# NOTE: we use a naming convention to determine which lambda function to use, see ${AWS_STAGE}
cd src
zip -r ../performers-api.zip ./performers-api.js ./lib ./controllers ../node_modules > /dev/null
cd ..
aws lambda update-function-code --function-name ${AWS_STAGE}-performers-api --zip-file fileb://performers-api.zip

# deploy the venues lambda function to the desired stage
# TODO: implement a staged approach here
zip -j venues-api.zip ./src/venues-api.js > /dev/null
aws lambda update-function-code --function-name venuesAPI --zip-file fileb://venues-api.zip

# deploy the playlists lambda function to the desired stage, see ${AWS_STAGE}
cd src
zip -r ../playlists-api.zip ./playlists-api.js ./lib ./controllers ../node_modules > /dev/null
cd ..
aws lambda update-function-code --function-name ${AWS_STAGE}-playlists-api --zip-file fileb://playlists-api.zip

# deploy our API Gateway definition
aws --region us-west-2 apigateway put-rest-api --rest-api-id 7n74ikdn58 --mode overwrite --body 'file://./src/api-gateway/TreefortAPI-dev-swagger.json'

# create our actual API Gateway deployment
aws --region us-west-2 apigateway create-deployment --rest-api-id 7n74ikdn58 --stage-name ${AWS_STAGE} --description "${CIRCLE_SHA1}"

# OLD NOTES:
# aws --region us-west-2 lambda create-function --function-name dev-playlist --runtime nodejs4.3 --role arn:aws:iam::025660771593:role/APIGatewayLambdaExecRole --handler playlists-api.handler --zip-file ./performers-api.zip
