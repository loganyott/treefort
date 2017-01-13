/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('chai').assert;
const performerMocks = require('./transform-performer.mock');
const songMocks = require('./transform-song.mock');
const cleanPerformer = require('./transform-performer').cleanPerformer;
const transformPerformer = require('./transform-performer').transform;


describe('transform-performer', function () {
  describe('#cleanPerformer', function () {
    it('Creates a performer that matches the model without a song on it.', function () {
      const dirtyPerformer = performerMocks.dirtyPerformer;
      const expectedPerformer = performerMocks.cleanPerformer;

      const cleanedPerformer = cleanPerformer(dirtyPerformer);

      Object.keys(expectedPerformer)
        .forEach((key) => {
          assert.deepEqual(cleanedPerformer[key], expectedPerformer[key]);
        });
    });

    it('Creates a performer that matches the model with a song on it.', function() {
      const performerWithoutSong = performerMocks.cleanPerformer;
      const song = songMocks.cleanSong;
      const expectedPerformer = performerMocks.cleanPerformerWithSong;
      const performerWithSong = transformPerformer([performerWithoutSong], [song])[0];

      Object.keys(expectedPerformer)
        .forEach((key) => {
          assert.deepEqual(performerWithSong[key], expectedPerformer[key]);
        });
    });
  });
});
