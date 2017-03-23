'use strict';

const uuidV1 = require('uuid/v1');
const dynamoPromiseFactory = require('../../lib/dynamo-promise');
const createDynamoPatchQuery = require('../../lib/dynamo-query').createDynamoPatchQuery;
const Schedule = require('../../lib/schedule');
const moment = require('moment-timezone');

const formatString = 'YYYY-MM-DDThh:mm';

class ScheduleController {
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

    this.ScheduleTable = dynamoPromise.table(`${dbStage}-schedule`);
  }

  create(scheduleObject) {
    const newSchedule = Object.assign({ }, new Schedule(scheduleObject), { id: uuidV1(), updated: moment().tz('America/Boise').format('YYYY-MM-DDThh:mm') });
    const promise = this.ScheduleTable.put(newSchedule);

    return promise;
  }

  update(id, newProperties) {
    const query = createDynamoPatchQuery({ id: id }, newProperties);
    const promise = this.ScheduleTable.patch(query);

    return promise;
  }

  get(scheduleId) {
    let promise;

    if (scheduleId) {
      promise = this.ScheduleTable
        .get(scheduleId);
    } else {
      promise = this.ScheduleTable
        .scan();
    }

    return promise;
  }
}

module.exports = {
  ScheduleController,
};
