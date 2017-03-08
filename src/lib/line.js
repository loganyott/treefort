'use strict';

// TODO: (bdietz) - add a better description of what the values are
// INSERT INTO `lineometer` (`id`, `venueId`, `linetag`, `updated`)
// (86, 4, 'No Line!', '2016-03-23 14:49:21'),

class Line {
  constructor(config) {
    this.id = config.id || '';
    this.venueId = config.venueId || '';
    this.lineTag = config.lineTag || '';
    this.updated = config.updated || '';
  }
}

module.exports = Line;
