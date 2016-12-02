'use strict';

console.log('Loading function');

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const Artist = require('./lib/artist');
const Track = require('./lib/track');
const Playlist = require('./lib/playlist');

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
    });

    switch (event.httpMethod) {
        case 'GET':
            getPlaylists();
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }

    function getPlaylists() {
        const dynamoTableName = 'Performer';
        dynamo.scan({ TableName: dynamoTableName }, (error, response) => {
            const tracks = _.map(response.Items, (item) => mapItemToTrack(item));
            const tracksGroupedByWave = _.groupBy(tracks, (track) => track.Artist.Wave);
            const playlists = _.map(_.keys(tracksGroupedByWave), (key) => {
                return new Playlist({
                    Name: `Wave ${key}`,
                    Tracks: tracksGroupedByWave[key],
                    Id: key,
                });
            });
            const playlistsByKeys = _.keyBy(playlists, 'Id');
            console.log(playlistsByKeys);

            done(error, playlistsByKeys);
        });
    }

// TODO: (bdietz) Note that the commented out properties below are artifacts from treefort 2016.
// TODO: (bdietz) Also I think that the model capitalization is wonky af we should lower-snake-case at some point plz.
// Keeping the casing for now just for the sake of uniformity.

    function mapItemToTrack(item) {
        const artist = mapItemToArtist(item);

        return new Track({
            Artist: artist,
            //TODO: This doesn't feel right
            Id: item.code ,
            // Title: item.Title,
            // SCTitle: item.SCTitle,
            ArtworkUrl: item.image_url,
            StreamUrl: item.song_url,
        });
    }

    function mapItemToArtist(item) {
        return new Artist({
            Id: item.code,
            Name: item.name,
            // SCTrackId: item.SCTrackId,
            // LiveDate: item.LiveDate,
            // DisplayOrder: item.sort_order_within_tier,
            Wave: item.wave,
            Tier: item.tier,
        });
    }
};

