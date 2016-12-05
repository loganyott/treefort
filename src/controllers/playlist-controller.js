'use strict';
const _ = require('lodash');
const Artist = require('../lib/artist');
const Track = require('../lib/track');
const Playlist = require('../lib/playlist');
const Promise = require('bluebird');

// TODO: (bdietz) Note that the commented out properties below are artifacts from treefort 2016.
// TODO: (bdietz) Also I think that the model capitalization is wonky af we should lower_snake_case at some point plz.
// Keeping the casing for now just for the sake of uniformity.

const mapItemToTrack = (item) => {
    const artist = mapItemToArtist(item);

    return new Track({
        artist: artist,
        //TODO: This doesn't feel right
        id: item.code ,
        // Title: item.Title,
        // SCTitle: item.SCTitle,
        artwork_url: item.image_url,
        stream_url: item.song_url,
    });
};

const mapItemToArtist = (item) => {
    return new Artist({
        id: item.code,
        name: item.name,
        // SCTrackId: item.SCTrackId,
        // LiveDate: item.LiveDate,
        // DisplayOrder: item.sort_order_within_tier,
        wave: item.wave,
        tier: item.tier,
    });
};

const mapPerformersToPlaylists = (response) => {
    const tracks = _.map(response.Items, (item) => mapItemToTrack(item));
    const tracksGroupedByWave = _.groupBy(tracks, (track) => track.artist.wave);
    const playlists = _.map(_.keys(tracksGroupedByWave), (key) => {
        return new Playlist({
            name: `Wave ${key}`,
            tracks: tracksGroupedByWave[key],
            id: key,
        });
    });
    const playlistsByKeys = _.keyBy(playlists, 'id');

    return playlistsByKeys;
};

const mapDynamoPlaylistTableToResponse = (dynamoPlaylists) => {
    return _.keyBy(dynamoPlaylists, 'id');
};

class PlaylistController {
    /**
     * @param dynamo A connection to dynamo db.
     */
    constructor(dynamo) {
        this.dynamo = dynamo;
    }

    get() {
        return new Promise((resolve, reject) => {
            this.dynamo.scan({ TableName: 'Performer' }, (error, response) => {
                if (error) {
                    reject(error);
                }

                resolve(mapPerformersToPlaylists(response));
                // resolve(mapDynamoPlaylistTableToResponse(response.Items));
            });
        });
    }
}

module.exports = {
    mapItemToArtist,
    mapItemToTrack,
    mapPerformersToPlaylists,

    PlaylistController,
};
