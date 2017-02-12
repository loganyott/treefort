'use strict';

const dynamoPromiseFactory = require('../../lib/dynamo-promise');
const _ = require('lodash');

class PlaylistController {
  /**
  * @param dynamo A connection to dynamo db.
  */
  constructor(dynamo, dbStage, currentWave) {
    const dynamoPromise = dynamoPromiseFactory(dynamo);
    console.log(`dbStage: ${dbStage}, currentWave: ${currentWave}`);

    if (!dbStage) {
      console.error('stageVariables.db_stage');
      throw new Error('ERROR: no stage was set. Please set db_stage in the appropriate stage');
    }

    this.playlistTable = dynamoPromise.table(`${dbStage}-playlist`);
  }

  get(playlistId) {
    let promise;

    if (playlistId) {
      promise = this.playlistTable
        .get(playlistId);
    } else {
      promise = this.playlistTable
      .scan();
    }

    return promise
      .then(getResponse => _.sortBy(getResponse, 'order'));
  }
}

module.exports = {
  PlaylistController,
};
