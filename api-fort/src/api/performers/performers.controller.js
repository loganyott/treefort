import {
  promise as dynamoPromiseFactory,
  query
} from '../../lib/dynamo-promise';
import log from '../../utils/logging';

/**
 * A class to encapsulate CRUD operations on the $PREFIX-performer tables
 */
@log
class PerformerController {
  /**
   * @param {object} dynamo object connection to dynamodb
   * @param {string} dbStage 'dev' or 'prod' to determine the dynamodb table prefix
   * @param {string} currentYear ex. '2018' 
   */
  constructor(dynamo, dbStage, currentYear) {
    const dynamoPromise = dynamoPromiseFactory(dynamo);
    this.performerTable = dynamoPromise.table(`${dbStage}-performer`);
    this.currentYear = currentYear;
  }

  /**
   * Simple table scan of a filter query against the performer table for the given dbStage
   * @param {string} performerId the ID of the performer someone is interested in getting
   */
  get(performerId) {
    let promise;
    if (performerId) {
      promise = this.performerTable.get(performerId).then(performer => 
        // TODO: fix this check for 2018
        // if (performer.wave > this.currentWave) {
        //   throw new Error(
        //     'UNAUTHORIZED: You may not access performers that have not been released yet.'
        //   );
        // }

         performer
      );
    } else {
      const scanParams = {
        FilterExpression: 'begins_with(id, :currentYear)',
        ExpressionAttributeValues: {
          ':currentYear': this.currentYear
        }
      };

      promise = this.performerTable.scan(scanParams);
    }

    return promise;
  }

  update(id, performerUpdates) {
    const updateQuery = query.createDynamoPatchQuery({ id }, performerUpdates);
    const promise = this.performerTable.patch(updateQuery);

    return promise;
  }

  delete(id) {
    return this.performerTable.delete(id);
  }
}

export default PerformerController;
