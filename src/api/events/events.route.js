// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';
import EventController from './events.controller';
import response from '../../utils/response';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // TODO: (bdietz) - Make sure that this can be dynamic again
  // const eventController = new EventController(dynamo, event.stageVariables.db_stage, event.stageVariables.current_wave);
  const eventController = new EventController(dynamo, 'dev', 5);
  const done = response(callback);

  let pathParameters = null;

  // TODO: (bdietz) - Need to update the rest of the endpoints to reference the newly namespaced event object, may also need to
  // make sure that the other parameters that are being referenced have not changed location in the namespace.
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
