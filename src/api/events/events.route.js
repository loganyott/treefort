// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';
import EventController from './events.controller';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const eventController = new EventController(dynamo, event.stageVariables.db_stage, event.stageVariables.current_wave);
  const done = response(callback);

  let pathParameters = null;

  switch (event.httpMethod) {
    case 'GET':
      if (event.pathParameters && event.pathParameters.eventId) {
        pathParameters = event.pathParameters.eventId;
      }
      eventController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
      break;
  }
};

export default router;
