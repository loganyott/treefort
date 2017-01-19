'use strict';

class Playlist {
  constructor(config) {
    this.id = config.id || null;
    this.name = config.name;
    this.songs = config.songs || [];
  }
}

module.exports = Playlist;
