import AWS from 'aws-sdk';
import response from '../../utils/response';
import PerformerController from './performers.controller';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router =  (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const done = response(callback);
  if (!event.stageVariables) {
    console.error('ERROR: event.stageVariables.current_wave has not been set');
    done(new Error('Internal server error.'));
  }

  let performerController;
  try {
    // TODO: (bdietz) - Fix this to be dynamic again
    // performerController = new PerformerController(dynamo, event.stageVariables.db_stage, event.stageVariables.current_wave);
    performerController = new PerformerController(dynamo, 'dev', 5);
  } catch (error) {
    console.error(JSON.stringify(error));
    done(new Error('ERROR: Internal server error'));
  }

  let pathParameters = null;

  switch (event.method) {
    case 'POST':
      performerController
        .create((event.path ? event.path : null))
        .then(postResponse => done(null, postResponse))
        .catch(error => done(error));
      break;
    case 'GET':
      if (event.path && event.path.performerId) {
        pathParameters = event.path.performerId;
      }
      performerController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));
      break;
      // TODO: (bdietz) - Should probably fix this to be a patch to make it more uniform with the lines endpoint
    case 'PUT':
      performerController
        .update(event.path.performerId, JSON.parse(event.body).performer)
        .then(putResponse => done(null, putResponse))
        .catch(error => done(error));
      break;
    case 'DELETE':
      performerController
        .remove(event.path.performerId)
        .then(deleteResponse => done(null, deleteResponse))
        .catch(error => done(error));
      break;
    default:
      done(new Error(`Unsupported method "${event.method}"`));
      break;
  }
};

export default router;
