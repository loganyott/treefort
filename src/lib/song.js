'use strict';

class Song {
  constructor(config = {}) {
    this.artist = config.artist || null;
    this.artwork_url = config.artwork_url || null;
    this.id = config.id || null;
    this.stream_url = config.stream_url || null;
    this.title = config.title || null;
  }
}

module.exports = Song;
