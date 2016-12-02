'use strict';

class Artist {
    constructor(config) {
       this.Id = config.Id || null;
       this.Name = config.Name || null;
       this.Wave = config.Wave || null;
       this.Tier = config.Tier || null;
    }
}

module.exports = Artist;