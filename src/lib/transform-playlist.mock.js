'use strict';

const performerMock = require('./transform-performer.mock');

const dirtyPlaylist = {
  id: '420',
  name: 'Creepoid Playlist',
  tracks: [
    {
      artist: {
        id: '2017-6944477',
        name: 'Creepoid',
        tier: 5,
        wave: 2,
      },
      artwork_url: null,
      id: '2017-6944477',
      stream_url: 'https://s3-us-west-2.amazonaws.com/treefort-songs/2017-6944477.mp3',
      title: null,
    },
  ],
};

const cleanPlaylist = {
  id: '420',
  name: 'Creepoid Playlist',
  songs: [
    performerMock.cleanPerformerWithSong,
  ],
};

module.exports = {
  cleanPlaylist,
  dirtyPlaylist,
};
