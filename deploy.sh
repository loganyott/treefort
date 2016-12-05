#!/bin/sh

zip -j events-api.zip ./src/events-api.js
aws lambda update-function-code --function-name eventsAPI --zip-file fileb://events-api.zip

zip -r ./performers-api.zip ./src/performers-api.js ./src/lib ./src/controllers ./node_modules;
aws lambda update-function-code --function-name performersAPI --zip-file fileb://performers-api.zip

zip -j venues-api.zip ./src/venues-api.js
aws lambda update-function-code --function-name venuesAPI --zip-file fileb://venues-api.zip

zip -r ./playlists-api.zip ./src/playlists-api.js ./src/lib ./src/controllers ./node_modules;
aws lambda update-function-code --function-name playlistsAPI --zip-file fileb://playlists-api.zip

aws apigateway put-rest-api --rest-api-id 7n74ikdn58 --mode overwrite --body 'file://./src/api-gateway/TreefortAPI-dev-swagger.json'
aws apigateway create-deployment --rest-api-id 7n74ikdn58 --stage-name dev
