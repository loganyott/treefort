/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('chai').assert;
const songMocks = require('./transform-song.mock');
const performerMocks = require('./transform-performer.mock');
const transform = require('./transform-song').transform;

describe('transform-song', function () {
  describe('#cleanSong', function () {
    it('Converts the dirty etl data to a clean model.', function () {
      const dirtySong = songMocks.dirtySong;
      const cleanSong = songMocks.cleanSong;
      const cleanedSong = transform([performerMocks.dirtyPerformer], [dirtySong])[0];

      // All but artist will be set. Artist will be null but we don't care about that.
      Object.keys(cleanSong)
        .forEach((key) => {
          assert.equal(cleanedSong[key], cleanSong[key]);
        });
    });
  });
});
