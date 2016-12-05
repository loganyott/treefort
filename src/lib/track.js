'use strict';

class Track {
    constructor(config) {
        this.artist = config.artist;
        this.id = config.Id || null;
        this.title = config.Title || null;
        this.artwork_url = config.artwork_url || null;
        this.stream_url = config.stream_url || null;
    }
}

module.exports = Track;