'use strict';

const _ = require('lodash');
const Playlist = require('./playlist');

/**
 * Converts a number to a word. This is not a robust method as there are only three playlists.
 * @param number
 * @returns {*}
 */
const numberToWord = (number) => {
  switch (number) {
    case '1':
      return 'One';
    case '2':
      return 'Two';
    case '3':
      return 'Three';
    case '4':
      return 'Four';
    case '5':
      return 'Five';
    case '6':
      return 'Six';
    case '7':
      return 'Seven';
    case '8':
      return 'Eight';
    case '9':
      return 'Nine';
    case '10':
      return 'Ten';
    default:
      throw Error('Unable to convert round word to number');
  }
};

const joinPerformerSongsToPlaylistsWithIds = (playlistWithIdsForSongs, performersWithSongs) => {
  // guarantee performers have songs
  performersWithSongs = performersWithSongs
    .filter(performer => Boolean(performer.song));

  const performersById = _.keyBy(performersWithSongs, 'id');

  const songs = playlistWithIdsForSongs.songs
    .map((song) => {
      return performersById[song.id].song;
    });

  const playlistConfig = {
    songs: songs,
    name: playlistWithIdsForSongs.name,
    id: playlistWithIdsForSongs.id,
  };

  return new Playlist(playlistConfig);
};

const createAllPerformerPlaylist = (performersWithSongs) => {
  const songs = performersWithSongs
     // guarantee performers have songs
    .filter(performer => Boolean(performer.song))
    .map(performer => performer.song);

  const playlistConfig = {
    songs: songs,
    name: 'All Artists',
    id: "4",
    order: 0,
  };

  return new Playlist(playlistConfig);
};

const createPerRoundPlaylists = (performersWithSongs) => {
  // guarantee performers have songs
  performersWithSongs = performersWithSongs
    .filter(performer => Boolean(performer.song));

  const performersGroupedByWave = _.groupBy(performersWithSongs, 'wave');

  const playlists = Object.keys(performersGroupedByWave)
    .map((waveNumber) => {
      const playlistConfig = {
        songs: performersGroupedByWave[waveNumber].map(performer => performer.song),
        name: `Round ${numberToWord(waveNumber)}`,
        id: waveNumber,
        order: waveNumber,
      };

      return new Playlist(playlistConfig);
    });

  return playlists;
};

module.exports = {
  createPerRoundPlaylists,
  createAllPerformerPlaylist,
  joinPerformerSongsToPlaylistsWithIds,
};
