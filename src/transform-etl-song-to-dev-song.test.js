/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('chai').assert;
const transformEtlSongToDevSong = require('./transform-etl-song-to-dev-performer-and-dev-playlist').handler;

describe('transform-etl-song-to-dev-song', function testTransformEtlSongToDevSong() {
  describe('#handler', function testTransformEtlSongToDevSongHandler() {
    it('Runs', function testExistenceOfStageVariables(done) {
      transformEtlSongToDevSong({}, {}, () => {
        done();
      });
    });
  });
});
