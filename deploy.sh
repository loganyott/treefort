#!/bin/sh

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
# aws lambda create-function --function-name etl --runtime nodejs4.3 --role arn:aws:iam::025660771593:role/APIGatewayLambdaExecRole --handler etl.handler --zip-file fileb://etl.zip

# deploy the events lambda function
# echo "Deploying events-api lambda function";
# TODO: implement a staged approach here
# zip -j events-api.zip ./src/events-api.js > /dev/null;
# aws lambda create-function --function-name eventsAPI --runtime nodejs4.3 --role arn:aws:iam::025660771593:role/APIGatewayLambdaExecRole --handler events-api.handler --zip-file fileb://events-api.zip

# deploy the performers lambda function to the desired stage
# NOTE: we use a naming convention to determine which lambda function to use, see ${AWS_STAGE}
cd src;
zip -r ../performers-api.zip ./performers-api.js ./lib ./controllers ../node_modules > /dev/null;
cd ..;
aws lambda update-function-code --function-name ${AWS_STAGE}-performers-api --zip-file fileb://performers-api.zip;
# aws lambda create-function --function-name ${AWS_STAGE}-performers-api --runtime nodejs4.3 --role arn:aws:iam::025660771593:role/APIGatewayLambdaExecRole --handler performers-api.handler --zip-file fileb://performers-api.zip

# deploy the playlists lambda function to the desired stage, see ${AWS_STAGE}
cd src
zip -r ../playlists-api.zip ./playlists-api.js ./lib ./controllers ../node_modules > /dev/null
cd ..
aws lambda update-function-code --function-name ${AWS_STAGE}-playlists-api --zip-file fileb://playlists-api.zip;
# aws --region us-west-2 lambda create-function --function-name dev-playlist --runtime nodejs4.3 --role arn:aws:iam::025660771593:role/APIGatewayLambdaExecRole --handler playlists-api.handler --zip-file ./performers-api.zip

# deploy the venues lambda function to the desired stage
# TODO: implement a staged approach here
# zip -j venues-api.zip ./src/venues-api.js > /dev/null
# aws lambda create-function --function-name venuesAPI --runtime nodejs4.3 --role arn:aws:iam::025660771593:role/APIGatewayLambdaExecRole --handler venues-api.handler --zip-file fileb://venues-api.zip
# aws lambda update-function-code --function-name venuesAPI --zip-file fileb://venues-api.zip

# deploy our API Gateway definition
aws --region us-west-2 apigateway put-rest-api --rest-api-id 7n74ikdn58 --mode overwrite --body 'file://./src/api-gateway/TreefortAPI-dev-swagger.json'

# create our actual API Gateway deployment
aws --region us-west-2 apigateway create-deployment --rest-api-id 7n74ikdn58 --stage-name ${AWS_STAGE} --description "${CIRCLE_SHA1}"

# OLD NOTES:
# aws lambda add-permission --function-name arn:aws:lambda:us-west-2:025660771593:function:dev-playlists-api --source-arn 'arn:aws:execute-api:us-west-2:025660771593:7n74ikdn58/*/GET/v1/playlists' --principal apigateway.amazonaws.com --statement-id 310f8231-16cc-4a94-9286-3b789ec8d551 --action lambda:InvokeFunction
# aws lambda add-permission --function-name arn:aws:lambda:us-west-2:025660771593:function:dev-playlists-api --source-arn 'arn:aws:execute-api:us-west-2:025660771593:7n74ikdn58/*/GET/v1/playlists/*' --principal apigateway.amazonaws.com --statement-id 4193c562-4b58-41db-abc9-2ed113b570de --action lambda:InvokeFunction
# aws lambda add-permission --function-name arn:aws:lambda:us-west-2:025660771593:function:prod-playlists-api --source-arn 'arn:aws:execute-api:us-west-2:025660771593:7n74ikdn58/*/GET/v1/playlists' --principal apigateway.amazonaws.com --statement-id 310f8231-16cc-4a94-9286-3b789ec8d551 --action lambda:InvokeFunction
# aws lambda add-permission --function-name arn:aws:lambda:us-west-2:025660771593:function:prod-playlists-api --source-arn 'arn:aws:execute-api:us-west-2:025660771593:7n74ikdn58/*/GET/v1/playlists/*' --principal apigateway.amazonaws.com --statement-id 4193c562-4b58-41db-abc9-2ed113b570de --action lambda:InvokeFunction
