'use strict';

const assert = require('chai').assert;
const playlistMocks = require('./transform-playlist.mock');
const performerMocks = require('./transform-performer.mock');
const transform = require('./transform-playlist').transform;

describe('transform-playlist', function () {
  describe('#transform', function () {
    it('A song to the playlist', function () {
      const expectedPlaylist = playlistMocks.cleanPlaylist;
      const transformedPlaylist = transform(
        [playlistMocks.dirtyPlaylist],
        [performerMocks.cleanPerformerWithSong])[0];

      Object.keys(expectedPlaylist)
        .forEach((key) => {
          assert.deepEqual(transformedPlaylist[key], expectedPlaylist[key]);
        });
    });
  });
});
