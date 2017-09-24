import moment from 'moment-timezone';
import uuidV1 from 'uuid/v1';
import {
  promise as dynamoPromiseFactory,
  query
} from '../../lib/dynamo-promise';
import Schedule from './schedule.model';
import log from '../../utils/logging';

const formatString = 'YYYY-MM-DDTHH:mm';

@log
class ScheduleController {
  /**
   * @param dynamo A connection to dynamo db.
   */
  constructor(dynamo, dbStage) {
    const dynamoPromise = dynamoPromiseFactory(dynamo);

    if (!dbStage) {
      throw new Error(
        'ERROR: no stage was set. Please set db_stage in the appropriate stage'
      );
    }

    this.ScheduleTable = dynamoPromise.table(`${dbStage}-schedule`);
  }

  create(scheduleObject) {
    const newSchedule = {
      ...new Schedule(scheduleObject),
      id: uuidV1(),
      updated: moment()
        .tz('America/Boise')
        .format(formatString)
    };
    const promise = this.ScheduleTable.put(newSchedule);

    return promise;
  }

  get(scheduleId) {
    let promise;

    if (scheduleId) {
      promise = this.ScheduleTable.get(scheduleId);
    } else {
      promise = this.ScheduleTable.scan();
    }

    return promise;
  }

  update(id, newProperties) {
    const updateQuery = query.createDynamoPatchQuery({ id }, newProperties);
    const promise = this.ScheduleTable.patch(updateQuery);

    return promise;
  }
}

export default ScheduleController;
