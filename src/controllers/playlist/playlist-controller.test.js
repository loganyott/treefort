/* eslint prefer-arrow-callback: "off" */

'use strict';

const AWS = require('aws-sdk');
const PlaylistController = require('./playlist-controller').PlaylistController;
const assert = require('chai').assert;
const _ = require('lodash');

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'https://dynamodb.us-west-2.amazonaws.com',
});
const dynamo = new AWS.DynamoDB.DocumentClient();
const currentWave = '1';
const dbStage = 'dev';

describe('PlaylistController', function testPlaylistController() {
  describe('#get/0', function testGet() {
    it('Creates an object hash of playlists that contains a playlist keyed at 1', function testObjectHash(done) {
      const playlistController = new PlaylistController(dynamo, dbStage, currentWave);
      playlistController.get()
        .then((result) => {
          const playlistsById = _.keyBy(result, 'id');
          assert.property(playlistsById, '1', 'Playlists object contains a playlist that is keyed by 1');
          assert.lengthOf(playlistsById['1'].songs, 75, 'Playlist 1 has a length of 75');
          done();
        });
    });
  });

  describe('#get/1', function testGetWithId() {
    it('Returns a single object that matches the current id.', function getPlaylistWithKey1(done) {
      const playlistController = new PlaylistController(dynamo, dbStage, currentWave);
      playlistController.get('1')
        .then((result) => {
          assert.equal(result.id, 1);
          assert.lengthOf(result.songs, 75, 'Playlist 1 has a length of 75');
          done();
        });
    });
  });
});
