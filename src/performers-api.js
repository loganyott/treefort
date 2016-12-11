'use strict';

console.log('Loading function');

// eslint-disable-next-line
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const response = require('./lib/response');
const PerformerController = require('./controllers/performer/performer-controller').PerformerController;

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const done = response(callback);
  if (!event.stageVariables) {
    console.error('ERROR: event.stageVariables.current_wave has not been set');
    done(new Error('Internal server error.'));
  }
  const performerController = new PerformerController(dynamo, event.stageVariables.current_wave);
  let pathParameters = null;

  switch (event.httpMethod) {
    case 'POST':
      performerController
        .create((event.pathParameters ? event.pathParameters : null))
        .then(postResponse => done(null, postResponse))
        .catch(error => done(error));
      break;
    case 'GET':
      if (event.pathParameters && event.pathParameters.performerId) {
        pathParameters = event.pathParameters.performerId;
      }
      performerController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));
      break;
    case 'PUT':
      performerController
        .update(event.pathParameters.performerId, JSON.parse(event.body).performer)
        .then(putResponse => done(null, putResponse))
        .catch(error => done(error));
      break;
    case 'DELETE':
      performerController
        .remove(event.pathParameters.performerId)
        .then(deleteResponse => done(null, deleteResponse))
        .catch(error => done(error));
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};
