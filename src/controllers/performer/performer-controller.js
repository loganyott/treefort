'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const dynamoPromiseFactory = require('../../lib/dynamo-promise');

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
      throw new Error('ERROR: no stage was set. Please set db_stage in the appropriate stage');
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

  // create() {
  //   return new Promise((resolve, reject) => {
  //     reject(new Error('ERROR: This method has not been implemented yet.'));
  //   });

  // TODO: (bdietz) update with promise pattern
  // TODO: (bdietz) Replace this with the crypto package once I get to the point where
  // we can upload functions to the cloud.
  // newPerformer.id = '123456789';
  // this.dynamo.put({ TableName: 'Performer', Item: newPerformer }, done);
  // }

  // TODO: (bdietz) is there support for default parameters in node 4.23?
  get(performerId) {
    console.log(`PerformersController#get: ${performerId}`);
    let promise;
    if (performerId) {
      promise = this.performerTable
          .get(performerId)
          .then((performer) => {
            if (performer.wave > this.currentWave) {
              throw new Error('UNAUTHORIZED: You may not access performers that have not been released yet.');
            }

            return performer;
          });
    } else {
      const scanParams = {
        FilterExpression: '#wv <= :currentWave',
        ExpressionAttributeNames: {
          '#wv': 'wave',
        },
        ExpressionAttributeValues: {
          ':currentWave': this.currentWave,
        },
      };

      promise = this.performerTable
          .scan(scanParams);
    }

    return promise;
  }

  update(performerId, performerInfo) {
    const updateParams = {
      TableName: this.PERFORMER_TABLE_NAME,
      Key: {
        id: performerId,
      },
      // TODO: Update properties based upon what is passed in.
      UpdateExpression: `set
            bio        = :b,
            forts      = :f,
            home_town  = :h,
            image_url  = :i,
            #n         = :n,
            social_url = :si,
            song_url   = :sn,
            wave       = :w
            `,
      ExpressionAttributeValues: {
        ':b': performerInfo.bio,
        ':f': performerInfo.forts,
        ':h': performerInfo.home_town,
        ':i': performerInfo.image_url,
        ':n': performerInfo.name,
        ':si': performerInfo.social_url,
        ':sn': performerInfo.song_url,
        ':w': performerInfo.wave,
      },
            // Name is a reserved keyword for dynamo db. See http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html for more details.
      ExpressionAttributeNames: {
        '#n': 'name',
      },
            // The entire item is returned, as it appears after the update.
      ReturnValues: 'NONE',
    };

    return new Promise((resolve, reject) => {
      this.dynamo.update(updateParams, createDynamoCallback(resolve, reject));
    });
  }

  remove(performerId) {
    const deleteParams = {
      TableName: this.PERFORMER_TABLE_NAME,
      Key: {
        id: performerId,
      },
    };

    return new Promise((resolve, reject) => {
      this.dynamo.remove(deleteParams, createDynamoCallback(resolve, reject));
    });
  }
}

// noinspection JSUnresolvedVariable
module.exports = {
  PerformerController,
};
