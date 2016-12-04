'use strict';
const _ = require('lodash');
const Artist = require('../lib/artist');
const Track = require('../lib/track');
const Playlist = require('../lib/playlist');
const Promise = require('bluebird');

// TODO: (bdietz) Note that the commented out properties below are artifacts from treefort 2016.
// TODO: (bdietz) Also I think that the model capitalization is wonky af we should lower-snake-case at some point plz.
// Keeping the casing for now just for the sake of uniformity.

const mapItemToTrack = (item) => {
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
};

const mapItemToArtist = (item) => {
    return new Artist({
        Id: item.code,
        Name: item.name,
        // SCTrackId: item.SCTrackId,
        // LiveDate: item.LiveDate,
        // DisplayOrder: item.sort_order_within_tier,
        Wave: item.wave,
        Tier: item.tier,
    });
};

const mapPerformersToPlaylists = function(response) {

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

    return playlistsByKeys;
};

class PlaylistController {
    /**
     * @param dynamo A connection to dynamo db.
     */
    constructor(dynamo) {
        this.dynamo = dynamo;
    }

    get() {
        // var params = {
        //     TableName: 'Performer',
        //     Key:{
        //         "year": year
        //     }
        // };

        const promise = new Promise((resolve, reject) => {
            this.dynamo.scan({ TableName: 'Performer' }, (error, response) => {
                if (error) {
                    reject(error);
                }

                resolve(mapPerformersToPlaylists(response));
            });
        });

        return promise;
    }
}

module.exports = {
    mapItemToArtist,
    mapItemToTrack,
    PlaylistController,
};
