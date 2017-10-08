import { promise as dynamoPromiseFactory } from '../../lib/dynamo-promise';
import log from '../../utils/logging';

@log
class EventController {
  /**
   * @param dynamo A connection to dynamo db.
   */
  constructor(dynamo, dbStage = 'dev') {
    const dynamoPromise = dynamoPromiseFactory(dynamo);

    if (!dbStage) {
      console.error('stageVariables.db_stage');
      throw new Error(
        'ERROR: no stage was set. Please set db_stage in the appropriate api gateway stage.'
      );
    }

    this.eventTable = dynamoPromise.table(`${dbStage}-event`);
  }

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
