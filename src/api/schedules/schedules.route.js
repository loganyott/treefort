import AWS from 'aws-sdk';
import response from '../../utils/response';
import ScheduleController from './schedules.controller';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  console.log('Received schedule:', JSON.stringify(event, null, 2));

  // const scheduleController = new ScheduleController(dynamo, event.stageVariables.db_stage, event.stageVariables.current_wave);
  // TODO: (bdietz) - Fix this to be dynamic again
  const scheduleController = new ScheduleController(dynamo, 'dev', 5);
  const done = response(callback);

  let pathParameters = null;

  switch (event.method) {
    case 'POST': {
      const body = JSON.parse(event.body);

      scheduleController
        .create(body)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    }
    case 'GET':
      if (event.path && event.path.scheduleId) {
        pathParameters = event.path.scheduleId;
      }

      scheduleController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    case 'PATCH': {
      const body = JSON.parse(event.body);

      scheduleController
        .update(event.path.scheduleId, body)
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
