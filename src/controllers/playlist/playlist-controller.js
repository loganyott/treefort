'use strict';
const _ = require('lodash');
const Artist = require('../../lib/artist');
const Track = require('../../lib/track');
const Playlist = require('../../lib/playlist');
const Promise = require('bluebird');

const mapDynamoPlaylistTableToResponse = (dynamoPlaylists) => {
    return _.keyBy(dynamoPlaylists, 'id');
};

const mergeSongOverrideTitleWithTitle = (song) => {
    const title = song.override_title === null ? song.title : song.override_title;
    const artwork_url = typeof song.album_art === "undefined" ? null : song.album_art;

    // Get rid of override title
    return {
        id: song.id,
        artwork_url,
        title,
    };
};

const joinSongsToArtistsInTracks = (partialPlaylist, songs) => {
    const songsMap = _
        .chain(songs)
        .map(mergeSongOverrideTitleWithTitle)
        .keyBy('id')
        .value();

    return _.map(partialPlaylist, (playlist) => {
        const newTracks = _.map(playlist.tracks, (track) => {
            return _.extend({ }, track, songsMap[track.id]);
        });

        const newFullPlaylist = _.extend({ }, playlist, { tracks: newTracks });

        return newFullPlaylist;
    });
};

class PlaylistController {
    /**
     * @param dynamo A connection to dynamo db.
     */
    constructor(dynamo) {
        this.dynamo = dynamo;
    }

    get() {
        // TODO: (bdietz) If this starts getting more arrow shaped we should look into making a nice promise solution or just getting one that already exists.
        return new Promise((resolve, reject) => {
            this.dynamo.scan({ TableName: 'Playlist' }, (error, playlistResponse) => {
                if (error) {
                    reject(error);
                }
                else {
                    this.dynamo.scan({ TableName: 'Song' }, (error, songResponse) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            const playlistWithPartialTracks = mapDynamoPlaylistTableToResponse(playlistResponse.Items);
                            const playlistWithFullTracks = joinSongsToArtistsInTracks(playlistWithPartialTracks, songResponse.Items);

                            resolve(_.keyBy(playlistWithFullTracks, 'id'));
                        }
                    });
                }
            });
        });
    }
}

module.exports = {
    PlaylistController,
};
