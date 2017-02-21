'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const dynamoPromise = require('./lib/dynamo-promise')(dynamo);
const _ = require('lodash');
const Promise = require('bluebird');
const transformPlaylist = require('./lib/transform-playlist').transform;
const transformPerformer = require('./lib/transform-performer').transform;
const transformSong = require('./lib/transform-song').transform;

console.log('Completed requires');

exports.handler = (event, context, callback) => {
  const etlSongTable = dynamoPromise.table('etl-song');
  const etlPerformerTable = dynamoPromise.table('etl-performer');
  const etlPlaylist = dynamoPromise.table('etl-playlist');

  const devPerformer = dynamoPromise.table('dev-performer');
  const devPlaylist = dynamoPromise.table('dev-playlist');

  Promise.all([
    etlSongTable.scan(),
    etlPerformerTable.scan(),
    etlPlaylist.scan(),
    devPerformer.scan(),
  ])
    .then((scanResponses) => {
      /**
       * TODO: (bdietz) this could be simplified with full es6 support.
       * Looks like array destructuring isn't supported in 4.3.
       * TODO: (bdietz) streaming alternative would be kind of cool :P
       */
      const allETLSongs = scanResponses[0];
      const allETLPerformers = scanResponses[1];
      const allETLPlaylists = scanResponses[2];
      const allDevPerformers = scanResponses[3];

      const devSoftDeletedPerformers = _.differenceBy(allDevPerformers, allETLPerformers, 'id')
        .map(performer => Object.assign({}, performer, { wave: 99999 }));

      const transformedSongs = transformSong(allETLPerformers, allETLSongs);
      const performersWithSongs = transformPerformer(allETLPerformers, transformedSongs);
      const playlistsWithArtists = transformPlaylist(allETLPlaylists, performersWithSongs);

      return Promise.all([
        devPerformer.batchPut(performersWithSongs),
        devPlaylist.batchPut(playlistsWithArtists),
        devPerformer.batchPut(devSoftDeletedPerformers),
      ]);
    })
    .then(() => {
      callback(null, 'SUCCESS');
    })
    .catch((error) => {
      console.error(`ERROR: An error occured while transforming etl-song to dev-song. ${JSON.stringify(error)}`);
      callback(error);
    });
};
