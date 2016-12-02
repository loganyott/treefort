'use strict';

class Track {
    constructor(config) {
        this.Artist = config.Artist;
        this.Id = config.Id || null;
        this.Title = config.Title || null;
        this.ArtworkUrl = config.ArtworkUrl || null;
        this.StreamUrl = config.StreamUrl || null;
    }
}

module.exports = Track;