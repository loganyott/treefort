/* eslint prefer-arrow-callback: "off" */

'use strict';

const AWS = require('aws-sdk');
const PerformerController = require('./performer-controller').PerformerController;
const _ = require('lodash');
const assert = require('chai').assert;
const testPerformer = require('./performer-controller.mock').testPerformer;

// const dynamoDbPerformers = require('./playlist-controller.mock').performer;

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'https://dynamodb.us-west-2.amazonaws.com',
});
const dynamo = new AWS.DynamoDB.DocumentClient();
const dbStage = 'dev';

const cleanUpTestUser = (dynamoCallback) => {
  const deleteParams = {
    TableName: 'dev-performer',
    Key: {
      id: testPerformer.id,
    },
  };

  dynamo.delete(deleteParams, dynamoCallback);
};

beforeEach(function beforeEach(done) {
  cleanUpTestUser(() => {
    dynamo.put({ TableName: 'dev-performer', Item: testPerformer }, done);
  });
});

afterEach(function afterEach(done) {
  cleanUpTestUser(done);
});

describe('PerformerController', function testPerformerController() {
  describe('#get', function testGet() {
    it('Test get by id', function testGetById(done) {
      const currentWave = '1';
      const performerController = new PerformerController(dynamo, dbStage, currentWave);
      const performerId = '2017-6725769';
      // TODO: (bdietz) eventullay just move to using promises instead of calling done.
      performerController
        .get(performerId)
        .then((result) => {
          assert.equal(result.id, performerId);
        })
        .catch(() => {
          assert(false, 'An error occured.');
        })
        .finally(() => {
          done();
        });
    });

    it('The result does not contain a wave that is greater than the current wave.', function testWaveNumbe(done) {
      const currentWave = '1';
      const performerController = new PerformerController(dynamo, currentWave);

      // TODO: (bdietz) eventullay just move to using promises instead of calling done.
      performerController
        .get()
        .then((result) => {
          const waves = _
            .chain(result.Items)
            .map(performer => performer.wave)
            .filter(wave => wave > Number(currentWave))
            .value();

          assert.lengthOf(waves, 0, 'Should not contain any performers that are part of a wave greater than the current wave');
        })
        .catch(() => {
          assert(false, 'An error occured.');
        })
        .finally(() => {
          done();
        });
    });

    it('Deny requests that for performers that belong to a wave that is after the current wave.', function testCurrentWave(done) {
      const currentWave = '1';
      const performerController = new PerformerController(dynamo, dbStage, currentWave);

      performerController
        .get(testPerformer.id)
        .then(() => {
          assert(false, 'This should have thrown an error because the we do not support requests for artists that belong to a wave that is greater than the current wave');
        })
        .catch(() => {
          assert(true, 'This should throw an error because the performerId was for a performer whose wave was after the current wave.');
        })
        .finally(() => {
          done();
        });
    });
  });
});
