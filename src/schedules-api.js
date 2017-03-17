'use strict';

console.log('Loading function');

// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');
const response = require('./lib/response');
const ScheduleController = require('./controllers/schedule/schedule-controller').ScheduleController;

console.log('Requires completed');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  console.log('Received schedule:', JSON.stringify(event, null, 2));

  // eslint-disable-next-schedule
  const scheduleController = new ScheduleController(dynamo, event.stageVariables.db_stage, event.stageVariables.current_wave);
  const done = response(callback);

  let pathParameters = null;

  switch (event.httpMethod) {
    case 'GET':
      if (event.pathParameters && event.pathParameters.scheduleId) {
        pathParameters = event.pathParameters.scheduleId;
      }

      scheduleController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    case 'PATCH': {
      const body = JSON.parse(event.body);

      scheduleController
        .update(event.pathParameters.scheduleId, body)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    }
    case 'POST': {
      const body = JSON.parse(event.body);

      scheduleController
        .create(body)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    }
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
      break;
  }
};
