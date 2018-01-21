import moment from 'moment-timezone';
import uuidV1 from 'uuid/v1';
import {
  promise as dynamoPromiseFactory,
  query
} from '../../lib/dynamo-promise';
import Schedule from './schedule.model';
import log from '../../utils/logging';

const formatString = 'YYYY-MM-DDTHH:mm';

/**
 * A class to encapsulate CRUD operations on the $PREFIX-schedule tables
 */
@log
class ScheduleController {
  /**
   * @param {object} dynamo object connection to dynamodb
   * @param {string} dbStage 'dev' or 'prod' to determine the dynamodb table prefix
   * @param {string} currentYear ex. '2018' 
   */
  constructor(dynamo, dbStage, currentYear) {
    const dynamoPromise = dynamoPromiseFactory(dynamo);
    this.ScheduleTable = dynamoPromise.table(`${dbStage}-schedule`);
    this.currentYear = currentYear;
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
