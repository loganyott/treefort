// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';
import EventController from './events.controller';
import response from '../../utils/response';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  const done = response(callback);

  const eventController = new EventController(
    dynamo,
    process.env.STAGE,
    process.env.CURRENT_YEAR
  );

  switch (event.method) {
    case 'GET': {
      const pathParameters =
        event.path && event.path.eventId ? event.path.eventId : null;

      eventController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));
      break;
    }
    default: {
      done(new Error(`Unsupported method "${event.method}"`));
      break;
    }
  }
};

export default router;
