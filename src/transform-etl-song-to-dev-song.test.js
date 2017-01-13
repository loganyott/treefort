/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('chai').assert;
const transformEtlSongToDevSong = require('./etl').handler;

// describe('transform-etl-song-to-dev-song', function testTransformEtlSongToDevSong() {
//   describe('#handler', function testTransformEtlSongToDevSongHandler() {
//     it('Runs', function testExistenceOfStageVariables(done) {
//     });
//   });
// });

transformEtlSongToDevSong({}, {}, () => {
  console.log('done');
});
