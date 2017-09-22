import AWS from 'aws-sdk';
import response from '../../utils/response';
import PlaylistController from './playlists.controller';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // TODO: (bdietz) - Fix this to be dynamic again
  // const playlistController = new PlaylistController(dynamo, event.stageVariables.db_stage, event.stageVariables.current_wave);
  const playlistController = new PlaylistController(dynamo, 'dev', 5);
  const done = response(callback);

  let pathParameters = null;

  switch (event.method) {
    case 'POST': {
      const body = JSON.parse(event.body);

      playlistController
        .create(body)
        .then((postResponse) => {
          done(null, postResponse);
        })
        .catch(error => done(error));

      break;
    }
    case 'GET':
      if (event.path && event.path.playlistId) {
        pathParameters = event.path.playlistId;
      }

      playlistController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));

      break;
    case 'PATCH': {
      if (event.path && event.path.playlistId) {
        pathParameters = event.path.playlistId;
      }
      const body = JSON.parse(event.body);

      playlistController
        .update(event.path.playlistId, body)
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
