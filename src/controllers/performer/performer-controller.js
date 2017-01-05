'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

const createDynamoCallback = (resolve, reject) => (error, response) => {
  if (error) {
    reject(error);
  } else {
    resolve(response);
  }
};

const joinSongWithPerformer = songs => (performer) => {
  const noAssociatedSongForPerformer = (typeof songs[performer.id] === 'undefined');
  const song = noAssociatedSongForPerformer
    ? null
    : songs[performer.id];

  if (noAssociatedSongForPerformer) {
    console.log(`No associated song for performer: ${performer.id}`);
  }

  return _.extend({}, performer, { song });
};

class PerformerController {
  constructor(dynamo, dbStage, currentWave) {
    this.dynamo = dynamo;
        // The API Gateway stage variable forces it to be a string cast to Number.
    this.currentWave = Number(currentWave);
    this.dbStage = dbStage;

    console.log(`dbStage: ${dbStage}, currentWave: ${currentWave}`);

    if (!dbStage) {
      console.error('stageVariables.db_stage');
      throw new Error('ERROR: no stage was set. Please set db_stage in the appropriate stage');
    }

    this.PERFORMER_TABLE_NAME = `${dbStage}-performer`;
    this.SONG_TABLE_NAME = `${dbStage}-song`;
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

    return new Promise((resolve, reject) => {
      console.log(`PerformersController#get in promise: ${performerId}`);
      const dynamoCallback = createDynamoCallback(resolve, reject);

      if (performerId) {
        this.dynamo
          .get({ TableName: this.PERFORMER_TABLE_NAME, Key: { id: performerId } },
            (performerError, performerResponse) => {
              if (!performerError && (performerResponse.Item.wave > this.currentWave)) {
                reject(new Error('UNAUTHORIZED: You may not access performers that have not been released yet.'));
              } else {
                this.dynamo
                .get({ TableName: this.SONG_TABLE_NAME, Key: { id: performerId } }, (songError, songResponse) => {
                  const songs = _.keyBy([songResponse.Item], 'id');
                  const finalResponse = joinSongWithPerformer(songs)(performerResponse.Item);
                  dynamoCallback(songError, { Item: finalResponse });
                });
              }
            });
      } else {
        const dynamoParams = {
          TableName: this.PERFORMER_TABLE_NAME,
          FilterExpression: '#wv <= :currentWave',
          ExpressionAttributeNames: {
            '#wv': 'wave',
          },
          ExpressionAttributeValues: {
            ':currentWave': this.currentWave,
          },
        };

        const songParams = {
          TableName: this.SONG_TABLE_NAME,
        };

        this.dynamo.scan(dynamoParams, (performerError, performerResponse) => {
          if (performerError) {
            dynamoCallback(performerError);
          } else {
            this.dynamo.scan(songParams, (songError, songResponse) => {
              const songsByKey = _.keyBy(songResponse.Items, 'id');
              const performersWithSongs = _.map(performerResponse.Items, joinSongWithPerformer(songsByKey));

              dynamoCallback(songError, { Items: performersWithSongs });
            });
          }
        });
      }
    });
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
