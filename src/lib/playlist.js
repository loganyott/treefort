'use strict';

class Playlist {
    constructor(config) {
        this.Name = config.Name;
        this.Tracks = config.Tracks || [];
        this.Id = config.Id || 'no-id-set';
    }
}

module.exports = Playlist;