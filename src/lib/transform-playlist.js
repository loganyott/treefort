'use strict';

const Playlist = require('./playlist');
const _ = require('lodash');

const cleanPlaylist = (dirtyPlaylist) => {
  const playlist = Object.assign({}, dirtyPlaylist, { songs: dirtyPlaylist.tracks });

  return new Playlist(playlist);
};

const joinPlaylistWithSongs = performersById => (playlist) => {
  const songs = playlist.songs
    .map((track) => {
      if (!performersById[track.id]) {
        console.error(`ERROR: track did not have an associated artist ${JSON.stringify(track)}`);
        return null;
      }

      return performersById[track.id].song;
    });

  return new Playlist(Object.assign({}, playlist, { songs }));
};

const transform = (dirtyPlaylists, performersWithSongs) => {
  const cleanPlaylists = dirtyPlaylists
    .map(cleanPlaylist)
    .map(joinPlaylistWithSongs(_.keyBy(performersWithSongs, 'id')));

  return cleanPlaylists;
};

module.exports = {
  cleanPlaylist,
  transform,
};
