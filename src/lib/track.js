'use strict';

class Track {
    constructor(config) {
        this.artist = config.artist;
        this.id = config.id || null;
        this.title = config.title || null;
        this.artwork_url = config.artwork_url || config.album_art || null;
        this.stream_url = config.stream_url || null;
    }
}

module.exports = Track;