import AWS from 'aws-sdk';
import response from '../../utils/response';
import ScheduleController from './schedules.controller';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  console.log('Received schedule:', JSON.stringify(event, null, 2));

  const scheduleController = new ScheduleController(
    dynamo,
    process.env.STAGE,
    process.env.CURRENT_WAVE
  );

  const done = response(callback);

  switch (event.method) {
    case 'POST': {
      scheduleController
        .create(event.body)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    }
    case 'GET': {
      const pathParameters =
        event.path && event.path.scheduleId ? event.path.scheduleId : null;

      scheduleController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    }
    case 'PATCH': {
      scheduleController
        .update(event.path.scheduleId, event.body)
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
