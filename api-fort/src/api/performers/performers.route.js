import AWS from 'aws-sdk';
import response from '../../utils/response';
import PerformerController from './performers.controller';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  const done = response(callback);

  const performerController = new PerformerController(
    dynamo,
    process.env.STAGE,
    process.env.CURRENT_YEAR
  );

  switch (event.method) {
    case 'GET': {
      const pathParameters =
        event.path && event.path.performerId ? event.path.performerId : null;

      performerController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));
      break;
    }
    case 'PATCH': {
      performerController
        .update(event.path.performerId, event.body)
        .then(putResponse => done(null, putResponse))
        .catch(error => done(error));
      break;
    }
    case 'DELETE': {
      performerController
        .delete(event.path.performerId)
        .then(deleteResponse => done(null, deleteResponse))
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
