'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

const mapDynamoPlaylistTableToResponse = dynamoPlaylists => _.keyBy(dynamoPlaylists, 'id');

const mergeSongOverrideTitleWithTitle = (song) => {
  const title = (song.override_title === null)
    ? song.title
    : song.override_title;

  const artworkUrl = (typeof song.album_art === 'undefined')
    ? null
    : song.album_art;

  // Get rid of override title
  return {
    id: song.id,
    artwork_url: artworkUrl,
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
    const newTracks = _.map(playlist.tracks, track => _.extend({ }, track, songsMap[track.id]));

    return _.extend({ }, playlist, { tracks: newTracks });
  });
};

class PlaylistController {
  /**
  * @param dynamo A connection to dynamo db.
  */
  constructor(dynamo) {
    this.dynamo = dynamo;
  }

  get(playlistId) {
    let promise;

    if (playlistId) {
      promise = new Promise((resolve, reject) => {
        const dynamoParams = {
          TableName: 'Playlist',
          Key: { id: playlistId },
        };

        this.dynamo
          .get(dynamoParams, (error, response) => {
            if (error) {
              reject(error);
            } else {
              resolve(response.Item);
            }
          });
      });
    } else {
      /**
       * TODO: (bdietz) If this starts getting more arrow shaped we should look into making
       * a nice promise solution or just getting one that already exists.
       */
      promise = new Promise((resolve, reject) => {
        this.dynamo.scan({ TableName: 'Playlist' }, (playlistError, playlistResponse) => {
          if (playlistError) {
            reject(playlistError);
          } else {
            this.dynamo.scan({ TableName: 'Song' }, (songError, songResponse) => {
              if (songError) {
                reject(songError);
              } else {
                const playlistWithPartialTracks =
                  mapDynamoPlaylistTableToResponse(playlistResponse.Items);
                const playlistWithFullTracks =
                  joinSongsToArtistsInTracks(playlistWithPartialTracks, songResponse.Items);

                resolve(_.keyBy(playlistWithFullTracks, 'id'));
              }
            });
          }
        });
      });
    }

    return promise;
  }
}

module.exports = {
  PlaylistController,
};
