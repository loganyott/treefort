'use strict';

class Artist {
  constructor(config) {
    this.id = config.id || null;
    this.name = config.name || null;
    this.wave = config.wave || null;
    this.tier = config.tier || null;
  }
}

module.exports = Artist;
