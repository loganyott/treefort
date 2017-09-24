// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';
import response from '../../utils/response';
import LineController from './lines.controller';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  // TODO: (bdietz) - Fix this to be dynamic again
  // const lineController = new LineController(dynamo, event.stageVariables.db_stage, event.stageVariables.current_wave);
  const lineController = new LineController(dynamo, 'dev', 5);
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
      let pathParameters = null;

      if (event.path && event.path.lineId) {
        pathParameters = event.path.lineId;
      }

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
