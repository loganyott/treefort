'use strict';

console.log('Loading function');

// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');
const response = require('./lib/response');
const LineController = require('./controllers/line/line-controller').LineController;

console.log('Requires completed');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  console.log('Received line:', JSON.stringify(line, null, 2));
  const lineController = new LineController(
    dynamo,
    event.stageVariables.db_stage,
    event.stageVariables.current_wave
  );
  const done = response(callback);

  let pathParameters = null;

  switch (event.httpMethod) {
    case 'GET':
      if (event.pathParameters && event.pathParameters.lineId) {
        pathParameters = event.pathParameters.lineId;
      }

      lineController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
      break;
  }
};
