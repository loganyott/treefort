import { promise as dynamoPromiseFactory } from '../../lib/dynamo-promise';
import log from '../../utils/logging';

/**
 * A class to encapsulate CRUD operations on the $PREFIX-events tables
 */
@log
class EventController {
  /**
   * @param {object} dynamo object connection to dynamodb
   * @param {string} dbStage 'dev' or 'prod' to determine the dynamodb table prefix
   * @param {string} currentYear ex. '2018' 
   */
  constructor(dynamo, dbStage, currentYear) {
    const dynamoPromise = dynamoPromiseFactory(dynamo);
    this.eventTable = dynamoPromise.table(`${dbStage}-event`);
    this.currentYear = currentYear;
  }

  /**
   * TODO: filter by this.currentYear
   * @param {string} eventId the Dynamo id column of an event a user is trying to retrieve
   */
  get(eventId) {
    let promise;

    if (eventId) {
      promise = this.eventTable.get(eventId);
    } else {
      promise = this.eventTable.scan();
    }

    return promise;
  }
}

export default EventController;
