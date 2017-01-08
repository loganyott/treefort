'use strict';

const Song = require('./song');
const _ = require('lodash');

const cleanSongTitleAndArtwork = (song) => {
  // Clean up song title
  const title = (song.override_title === null)
    ? song.title
    : song.override_title;

  // Clean up artwork url
  const artworkUrl = (typeof song.album_art === 'undefined')
    ? null
    : song.album_art;

  const songConfig = Object.assign(song, { title }, { artwork_url: artworkUrl });
  return new Song(songConfig);
};

const attachStreamUrlToSong = (artistsById) => {
  return (song) => {
    const currentArtist = artistsById[song.id];
    const noArtistFound = typeof currentArtist === 'undefined';
    if (noArtistFound) {
      console.log(`A song did not have an associated artist: ${JSON.stringify(song)}`);
    }
    return ((noArtistFound)
      ? song
      : new Song(Object.assign({}, song, { stream_url: currentArtist.song_url }))
    );
  };
};

const transform = (performers, dirtySongs) => dirtySongs
    .map(cleanSongTitleAndArtwork)
    .map(attachStreamUrlToSong(_.keyBy(performers, 'id')));

module.exports = {
  transform,
};
