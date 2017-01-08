/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('chai').assert;
const performerMocks = require('./transform-performer.mock');
const cleanPerformer = require('./transform-performer').cleanPerformer;


describe('transform-performer', function () {
  describe('#cleanPerformer', function () {
    it('A song to the performer', function () {
      const dirtyPerformer = performerMocks.dirtyPerformer;
      const expectedPerformer = performerMocks.cleanPerformer;

      const cleanedPerformer = cleanPerformer(dirtyPerformer);

      Object.keys(expectedPerformer)
        .forEach((key) => {
          assert.deepEqual(cleanedPerformer[key], expectedPerformer[key]);
        });
    });
  });
});
