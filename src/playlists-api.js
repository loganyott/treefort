'use strict';

console.log('Loading function');

// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');
const response = require('./lib/response');
const PlaylistController = require('./controllers/playlist/playlist-controller').PlaylistController;

console.log('Requires completed');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const playlistController = new PlaylistController(dynamo, event.stageVariables.db_stage, event.stageVariables.current_wave);
  const done = response(callback);

  let pathParameters = null;

  switch (event.httpMethod) {
    case 'GET':
      if (event.pathParameters && event.pathParameters.playlistId) {
        pathParameters = event.pathParameters.playlistId;
      }

      playlistController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    case 'PATCH': {
      if (event.pathParameters && event.pathParameters.playlistId) {
        pathParameters = event.pathParameters.playlistId;
      }
      const body = JSON.parse(event.body);

      playlistController
        .update(event.pathParameters.playlistId, body)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    }
    case 'POST': {
      const body = JSON.parse(event.body);

      playlistController
        .create(body)
        .then((postResponse) => {
          console.log(postResponse);
          done(null, postResponse);
        })
        .catch(error => done(error));

      break;
    }
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
      break;
  }
};
