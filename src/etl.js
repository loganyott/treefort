'use strict';

const AWS = require('aws-sdk');
const Promise = require('bluebird');
const dynamo = new AWS.DynamoDB.DocumentClient();
const dynamoPromise = require('./lib/dynamo-promise')(dynamo);
const transformPerformer = require('./lib/transform-performer').transform;
const transformSong = require('./lib/transform-song').transform;
const playlistUtils = require('./lib/playlist-utils');

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
  ])
    .then((scanResponses) => {
      /**
       * TODO: (bdietz) this could be simplified with full es6 support.
       * Looks like array destructuring isn't supported in 4.3.
       */
      const allETLSongs = scanResponses[0];
      const allETLPerformers = scanResponses[1];
      const allETLPlaylists = scanResponses[2];

      const transformedSongs = transformSong(allETLPerformers, allETLSongs);
      const performersWithSongs = transformPerformer(allETLPerformers, transformedSongs);
      const allPlaylists = playlistUtils.createPerRoundPlaylists(performersWithSongs);
      allPlaylists.push(playlistUtils.createAllPerformerPlaylist(performersWithSongs));

      return Promise.all([
        devPerformer.batchPut(performersWithSongs),
        devPlaylist.batchPut(allPlaylists),
      ]);
    })
    .then(() => {
      callback(null, 'SUCCESS');
    })
    .catch((error) => {
      console.error(`ERROR: An error occurred. ${JSON.stringify(error)}`);
      callback(error);
    });
};
