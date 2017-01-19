'use strict';

const Performer = require('./performer');
const Song = require('./song');
const _ = require('lodash');

const joinSongWithPerformer = songsById => (performer) => {
  let song = songsById[performer.id]
    ? Object.assign({}, new Song(songsById[performer.id]))
    : null;

  if (song) {
    delete song.artist;
  }

  let newPerformer = Object.assign({}, performer, { song: song });
  delete newPerformer.orig_song_name;
  delete newPerformer.stream_url;

  return newPerformer;
};

const cleanPerformer = performer => new Performer(performer);

const transform = (performers, songs) => {
  const songsById = _.keyBy(songs, 'id');

  const transformedPerformers = performers
    .map(cleanPerformer)
    .map(joinSongWithPerformer(songsById));

  return transformedPerformers;
};

module.exports = {
  cleanPerformer,
  joinSongWithPerformer,
  transform,
};
