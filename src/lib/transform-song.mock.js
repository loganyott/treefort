'use strict';

const cleanPerformer = require('./performer');

const dirtySong = {
  id: '2017-6944477',
  album_art: 'https://s3-us-west-2.amazonaws.com/treefort-images/2017-6944477-albumart.jpg',
  override_title: null,
  title: 'Baptism',
};

const cleanSong = {
  id: '2017-6944477',
  artwork_url: 'https://s3-us-west-2.amazonaws.com/treefort-images/2017-6944477-albumart.jpg',
  stream_url: 'https://s3-us-west-2.amazonaws.com/treefort-songs/2017-6944477.mp3',
  title: 'Baptism',
};

const cleanSongWithPerformer = Object.assign({}, cleanSong, { artist: cleanPerformer });

module.exports = {
  dirtySong,
  cleanSong,
  cleanSongWithPerformer,
};
