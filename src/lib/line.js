'use strict';

// INSERT INTO `lineometer` (`id`, `venueId`, `linetag`, `updated`)
// (86, 4, 'No Line!', '2016-03-23 14:49:21'),

class Line {
  constructor(config) {
    this.id = config.id;
    this.venuId = config.venueId;
    this.lineTag = config.lineTag;
    this.updated = config.updated;
  }
}

module.exports = Line;
