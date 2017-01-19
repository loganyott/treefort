'use strict';

const _ = require('lodash');
const Playlist = require('./playlist');

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

const extract = (performersWithSongs) => {
  const performersGroupedByWave = _.groupBy(performersWithSongs, 'wave');

  const playlists = Object.keys(performersGroupedByWave)
    .map((waveNumber) => {
      const playlistConfig = {
        songs: performersGroupedByWave[waveNumber],
        name: `Round ${numberToWord(waveNumber)}`,
        id: waveNumber,
      };

      return new Playlist(playlistConfig);
    });

  return playlists;
};

module.exports = {
  extract,
};
