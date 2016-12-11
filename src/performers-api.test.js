/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('chai').assert;
const performersApi = require('./performers-api').handler;
const event = require('./performers-api.mock').event;

describe('performers-api', function testPerformersApi() {
  describe('#handler', function testPerformersApiHandler() {
    it('Errors when the stage variables are not set.', function testExistenceOfStageVariables(done) {
      performersApi(event, { }, (ignore, response) => {
        assert(response.statusCode, '400');
        done();
      });
    });
  });
});
