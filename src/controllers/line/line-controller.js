'use strict';

const dynamoPromiseFactory = require('../../lib/dynamo-promise');
const _ = require('lodash');

class LineController {
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

    this.LineTable = dynamoPromise.table(`${dbStage}-line`);
  }

  get(LineId) {
    let promise;

    if (LineId) {
      promise = this.LineTable
        .get(LineId);
    } else {
      promise = this.LineTable
        .scan();
    }

    return promise.then(getResponse => _.sortBy(getResponse, 'order'));
  }
}

module.exports = {
  LineController,
};
