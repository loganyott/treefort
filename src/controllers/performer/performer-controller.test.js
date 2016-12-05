const assert = require('chai').assert;
const _ = require('lodash');
const PerformerController = require('./performer-controller').PerformerController;
// const dynamoDbPerformers = require('./playlist-controller.mock').performer;
const testPerformer = require('./performer-controller.mock').testPerformer;

const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com",
});
const dynamo = new AWS.DynamoDB.DocumentClient();

const cleanUpTestUser = (dynamoCallback) => {
    const deleteParams = {
        TableName: 'Performer',
        Key: {
            'code': testPerformer.code,
        }
    };

    dynamo.delete(deleteParams, dynamoCallback);
};

beforeEach(function (done) {
    cleanUpTestUser(() => {
        dynamo.put({TableName: 'Performer', Item: testPerformer}, done);
    });
});

afterEach(function (done) {
    cleanUpTestUser(done);
});

describe('PerformerController', function () {
    describe('#get', function () {
        it('The result does not contain a wave that is greater than the current wave.', function (done) {
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
                .catch((result) => {
                    assert(false, 'An error occured.');
                })
                .finally(() => {
                    done();
                });
        });

        it('Deny requests that for performers that belong to a wave that is after the current wave.', function (done) {
            const currentWave = '1';
            const performerController = new PerformerController(dynamo, currentWave);

            performerController
                .get(testPerformer.code)
                .then((result) => {
                    assert(false, 'This should have thrown an error because the we do not support requests for artists that belong to a wave that is greater than the current wave');
                })
                .catch((result) => {
                    assert(true, 'This should throw an error because the performerId was for a performer whose wave was after the current wave.');
                })
                .finally(() => {
                    done();
                });
        });
    });
});
