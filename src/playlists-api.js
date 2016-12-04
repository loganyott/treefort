'use strict';

console.log('Loading function');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const response = require('./lib/response');
const PlaylistController = require('./controllers/playlist-controller').PlaylistController;
console.log('Requires completed');

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const playlistController = new PlaylistController(dynamo);
    const done = response(callback);

    try {
        switch (event.httpMethod) {
            case 'GET':
                console.log('in get');
                 playlistController.get()
                     .then((response) => {
                         done(null, response);
                     })
                     .catch((error) => {
                         done(error);
                     });
                break;
            default:
                done(new Error(`Unsupported method "${event.httpMethod}"`));
        }
    }
    catch(error) {
        console.log(`ERROR: ${error}`);
        done(error);
    }
};
