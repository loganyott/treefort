// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';
import response from '../../utils/response';
import LineController from './lines.controller';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  console.log('Received line:', JSON.stringify(event, null, 2));

  // TODO: (bdietz) - Fix this to be dynamic again
  // const lineController = new LineController(dynamo, event.stageVariables.db_stage, event.stageVariables.current_wave);
  // eslint-disable-next-line
  const lineController = new LineController(dynamo, 'dev', 5);
  const done = response(callback);

  let pathParameters = null;

  switch (event.method) {
    case 'GET':
      if (event.path && event.path.lineId) {
        pathParameters = event.path.lineId;
      }

      lineController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    case 'PATCH': {
      if (event.path && event.path.lineId) {
        pathParameters = event.path.lineId;
      }
      const body = JSON.parse(event.body);

      lineController
        .update(event.path.lineId, body)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    }
    case 'POST': {
      const body = JSON.parse(event.body);

      lineController
        .create(body)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    }
    default:
      done(new Error(`Unsupported method "${event.method}"`));
      break;
  }
};

export default router;
