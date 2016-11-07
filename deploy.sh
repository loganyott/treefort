#!/bin/sh

zip events-api.zip ./src/events-api.js
aws lambda update-function-code --function-name eventsAPI --zip-file fileb://events-api.zip

zip performers-api.zip ./src/performers-api.js
aws lambda update-function-code --function-name performersAPI --zip-file fileb://performers-api.zip

zip venues-api.zip ./src/venues-api.js
aws lambda update-function-code --function-name venuesAPI --zip-file fileb://venues-api.zip