// TODO: (bdietz) - Need to remember why Promise is even being used in these scenarios, may want to tease these details back into that dynamo promise util instead.
import Promise from 'bluebird';
import {
  promise as dynamoPromiseFactory,
  query
} from '../../lib/dynamo-promise';

const createDynamoCallback = (resolve, reject) => (error, response) => {
  if (error) {
    reject(error);
  } else {
    resolve(response);
  }
};

class PerformerController {
  constructor(dynamo, dbStage, currentWave) {
    console.log(`dbStage: ${dbStage}, currentWave: ${currentWave}`);

    if (!dbStage) {
      console.error('stageVariables.db_stage');
      throw new Error(
        'ERROR: no stage was set. Please set db_stage in the appropriate stage'
      );
    }

    // TODO: (bdietz) deprecate this now that dynamo promise is a viable option.
    this.PERFORMER_TABLE_NAME = `${dbStage}-performer`;
    this.dbStage = dbStage;
    this.dynamo = dynamo;
    this.dynamoPromise = dynamoPromiseFactory(dynamo);
    this.performerTable = this.dynamoPromise.table(`${dbStage}-performer`);
    // The API Gateway stage variable forces it to be a string cast to Number.
    this.currentWave = Number(currentWave);
  }

  get(performerId) {
    console.log(`PerformersController#get: ${performerId}`);
    let promise;
    if (performerId) {
      promise = this.performerTable.get(performerId).then(performer => {
        if (performer.wave > this.currentWave) {
          throw new Error(
            'UNAUTHORIZED: You may not access performers that have not been released yet.'
          );
        }

        return performer;
      });
    } else {
      const scanParams = {
        FilterExpression: '#wv <= :currentWave',
        ExpressionAttributeNames: {
          '#wv': 'wave'
        },
        ExpressionAttributeValues: {
          ':currentWave': this.currentWave
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

  remove(performerId) {
    const deleteParams = {
      TableName: this.PERFORMER_TABLE_NAME,
      Key: {
        id: performerId
      }
    };

    return new Promise((resolve, reject) => {
      this.dynamo.remove(deleteParams, createDynamoCallback(resolve, reject));
    });
  }
}

export default PerformerController;
