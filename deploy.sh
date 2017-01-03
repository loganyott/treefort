#!/bin/sh

zip -j events-api.zip ./src/events-api.js
aws lambda update-function-code --function-name eventsAPI --zip-file fileb://events-api.zip

cd src; zip -r ../performers-api.zip ./performers-api.js ./lib ./controllers ../node_modules; cd ..;
aws lambda update-function-code --function-name dev-performers-api --zip-file fileb://performers-api.zip

#cd src; zip -r ../performers-api.zip ./performers-api.js ./lib ./controllers ../node_modules; cd ..;
#aws lambda update-function-code --function-name prod-performers-api --zip-file fileb://performers-api.zip

zip -j venues-api.zip ./src/venues-api.js
aws lambda update-function-code --function-name venuesAPI --zip-file fileb://venues-api.zip

cd src; zip -r ../playlists-api.zip ./playlists-api.js ./lib ./controllers ../node_modules; cd ..;
aws lambda update-function-code --function-name dev-playlists-api --zip-file fileb://playlists-api.zip

#cd src; zip -r ../playlists-api.zip ./playlists-api.js ./lib ./controllers ../node_modules; cd ..;
#aws lambda update-function-code --function-name prod-playlists-api --zip-file fileb://playlists-api.zip

aws apigateway put-rest-api --rest-api-id 7n74ikdn58 --mode overwrite --body 'file://./src/api-gateway/TreefortAPI-dev-swagger.json'

#aws lambda create-function --function-name dev-playlist --runtime nodejs4.3 --role arn:aws:iam::025660771593:role/APIGatewayLambdaExecRole --handler playlists-api.handler --zip-file ./performers-api.zip

aws apigateway create-deployment --rest-api-id 7n74ikdn58 --stage-name $1 --description $GIT_COMMIT_DESC
