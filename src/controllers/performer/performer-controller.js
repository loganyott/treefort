'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const mergeSongOverrideTitleWithTitle = require('../playlist/playlist-controller').mergeSongOverrideTitleWithTitle;

const createDynamoCallback = (resolve, reject) => (error, response) => {
  if (error) {
    reject(error);
  } else {
    resolve(response);
  }
};

const joinSongWithPerformer = songs => (performer) => {
  const cleanedUpSong = mergeSongOverrideTitleWithTitle(songs[performer.code]);
  const newPerformer = _.extend({}, performer, { song: cleanedUpSong });

  return newPerformer;
};

class PerformerController {
  constructor(dynamo, currentWave) {
    this.dynamo = dynamo;
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
  // newPerformer.code = '123456789';
  // this.dynamo.put({ TableName: 'Performer', Item: newPerformer }, done);
  // }

  // TODO: (bdietz) is there support for default parameters in node 4.23?
  get(performerId) {
    const dynamoTableName = 'Performer';

    console.log(`PerformersController#get: ${performerId}`);

    return new Promise((resolve, reject) => {
      console.log(`PerformersController#get in promise: ${performerId}`);
      const dynamoCallback = createDynamoCallback(resolve, reject);

      if (performerId) {
        this.dynamo
          .get({ TableName: dynamoTableName, Key: { code: performerId } }, (performerError, performerResponse) => {
            if (!performerError && (performerResponse.Item.wave > this.currentWave)) {
              reject(new Error('UNAUTHORIZED: You may not access performers that have not been released yet.'));
            } else {
              this.dynamo
                .get({ TableName: 'Song', Key: { id: performerId } }, (songError, songResponse) => {
                  const songs = _.keyBy([songResponse.Item], 'id');
                  const finalResponse = joinSongWithPerformer(songs)(performerResponse.Item);
                  dynamoCallback(songError, { Item: finalResponse });
                });
            }
          });
      } else {
        const dynamoParams = {
          TableName: dynamoTableName,
          FilterExpression: '#wv <= :currentWave',
          ExpressionAttributeNames: {
            '#wv': 'wave',
          },
          ExpressionAttributeValues: {
            ':currentWave': this.currentWave,
          },
        };

        const songParams = {
          TableName: 'Song',
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
      TableName: 'Performer',
      Key: {
        code: performerId,
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
      TableName: 'Performer',
      Key: {
        code: performerId,
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
