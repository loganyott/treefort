const assert = require('chai').assert;
const PlaylistController = require('./playlist-controller').PlaylistController;
// const dynamoDbPerformers = require('./playlist-controller.mock').performers;

const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com",
});
const dynamo = new AWS.DynamoDB.DocumentClient();

describe('PlaylistController', function() {
    describe('#get', function() {
        it('Creates an object hash of playlists that contains a playlist keyed at 1', function(done) {
            const playlistController = new PlaylistController(dynamo);
            playlistController.get()
                .then((result) => {
                    assert.property(result, '1', 'Playlists object contains a playlist that is keyed by 1');
                    assert.lengthOf(result['1'].Tracks, 75), 'Playlist 1 has a length of 75';
                    done();
                });
        });
    });
});

