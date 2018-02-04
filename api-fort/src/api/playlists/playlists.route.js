import AWS from 'aws-sdk';
import response from '../../utils/response';
import PlaylistController from './playlists.controller';

const dynamo = new AWS.DynamoDB.DocumentClient();

const router = (event, context, callback) => {
  // console.log('Received event:', JSON.stringify(event, null, 2));

  const playlistController = new PlaylistController(
    dynamo,
    process.env.STAGE,
    process.env.CURRENT_YEAR
  );
  const done = response(callback);

  switch (event.method) {
    case 'POST': {
      playlistController
        .create(event.body)
        .then(postResponse => {
          done(null, postResponse);
        })
        .catch(error => done(error));

      break;
    }
    case 'GET': {
      const pathParameters =
        event.path && event.path.playlistId ? event.path.playlistId : null;

      playlistController
        .get(pathParameters)
        .then(getResponse => done(null, getResponse))
        .catch(error => done(error));
      break;
    }
    case 'PATCH': {
      playlistController
        .update(event.path.playlistId, event.body)
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
