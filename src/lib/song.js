'use strict';

class Song {
  // TODO: (bdietz) webpack this so you can use all of the awesome features of es6 like default parameters
  constructor(config) {
    config = config || {};
    this.artist_name = config.artist_name || null;
    this.artwork_url = config.artwork_url || null;
    this.id = config.id || null;
    this.stream_url = config.stream_url || null;
    this.title = config.title || null;
  }
}

module.exports = Song;
