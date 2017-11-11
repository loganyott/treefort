// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';
import response from '../../utils/response';
import LineController from './lines.controller';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  const lineController = new LineController(
    dynamo,
    process.env.STAGE,
    process.env.CURRENT_YEAR
  );
  const done = response(callback);

  switch (event.method) {
    case 'POST': {
      lineController
        .create(event.body)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    }
    case 'GET': {
      const pathParameters =
        event.path && event.path.lineId ? event.path.lineId : null;

      lineController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    }
    case 'PATCH': {
      if (event.path && event.path.lineId) {
        lineController
          .update(event.path.lineId, event.body)
          .then(getResponse => done(null, getResponse))
          .catch(error => done(error));
      } else {
        done(new Error(`Unsupported parameteris`));
      }

      break;
    }
    default:
      done(new Error(`Unsupported method "${event.method}"`));
      break;
  }
};

export default router;
