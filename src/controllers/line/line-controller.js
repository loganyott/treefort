'use strict';

const uuidV1 = require('uuid/v1');
const moment = require('moment');
const Line = require('../../lib/line');
const createDynamoPatchQuery = require('../../lib/dynamo-query').createDynamoPatchQuery;
const dynamoPromiseFactory = require('../../lib/dynamo-promise');

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

    this.lineTable = dynamoPromise.table(`${dbStage}-line`);
  }

  create(lineObject) {
    const newLine = Object.assign({ }, new Line(lineObject), { id: uuidV1(), updated: moment.utc().format() });
    const promise = this.lineTable.put(newLine);

    return promise;
  }

  get(lineId) {
    let promise;

    if (lineId) {
      promise = this.lineTable
        .get(lineId);
    } else {
      promise = this.lineTable
        .scan();
    }

    return promise;
  }

  update(id, newProperties) {
    const query = createDynamoPatchQuery({ id: id }, newProperties);
    const promise = this.lineTable.patch(query);

    return promise;
  }
}

module.exports = {
  LineController,
};
