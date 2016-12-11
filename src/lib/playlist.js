'use strict';

class Playlist {
  constructor(config) {
    this.name = config.name;
    this.tracks = config.tracks || [];
    this.id = config.id || 'no-id-set';
  }
}

module.exports = Playlist;
