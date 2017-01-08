'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const Promise = require('bluebird');
const transform = require('./lib/transform-song').transform;
const dynamoPromise = require('./lib/dynamo-promise')(dynamo);

console.log('Completed requires');

exports.handler = (event, context, callback) => {
  const etlSongTable = dynamoPromise.table('etl-song');
  const devSongTable = dynamoPromise.table('dev-song');
  const etlPerformerTable = dynamoPromise.table('etl-performer');

  Promise.all([
    etlSongTable.scan(),
    etlPerformerTable.scan(),
  ])
    .then((tableResponses) => {
      // TODO: (bdietz) this could be simplified with full es6 support. Looks like array destructuring isn't supported in 4.3
      const allETLSongs = tableResponses[0];
      const allETLPerformers = tableResponses[1];

      const devSongUpdatePromises = transform(allETLPerformers, allETLSongs)
        .map(cleanedSong => devSongTable.put(cleanedSong));

      return Promise.all(devSongUpdatePromises);
    })
    .then(() => {
      callback(null, 'SUCCESS');
    })
    .catch((error) => {
      console.error(`ERROR: An error occured while transforming etl-song to dev-song. ${JSON.stringify(error)}`);
      callback(error);
    });
};
