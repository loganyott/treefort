'use strict';

// TODO: (bdietz) - add a better description of what the values are
// INSERT INTO `lineometer` (`id`, `venueId`, `linetag`, `updated`)
// (86, 4, 'No Line!', '2016-03-23 14:49:21'),

class Schedule {
  constructor(config) {
    this.id = config.id || '';
    this.updated = config.updated || '';
    this.events = config.events || [];
    this.in_sync = config.in_sync || true;
  }
}

module.exports = Schedule;
