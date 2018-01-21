// (86, 4, 'No Line!', '2016-03-23 14:49:21'),

class Schedule {
  constructor(config) {
    this.id = config.id || '';
    this.updated = config.updated || '';
    this.events = config.events || [];
    this.in_sync =
      typeof config.in_sync === 'undefined' ? false : config.in_sync;
  }
}

export default Schedule;
