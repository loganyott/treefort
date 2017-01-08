'use strict';

const Performer = require('./performer');
const Song = require('./song');
const _ = require('lodash');

const joinSongWithPerformer = songsById => (performer) => {
  const song = songsById[performer.id]
    ? null
    : new Song(songsById[performer.id]);

  return Object.assign({}, performer, { song });
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
