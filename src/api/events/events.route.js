// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';
import EventController from './events.controller';
import response from '../../utils/response';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const eventController = new EventController(
    dynamo,
    process.env.STAGE,
    process.env.CURRENT_WAVE
  );
  const done = response(callback);

  let pathParameters = null;

  switch (event.method) {
    case 'GET':
      if (event.path && event.path.eventId) {
        pathParameters = event.path.eventId;
      }
      eventController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    default:
      done(new Error(`Unsupported method "${event.method}"`));
      break;
  }
};

export default router;
