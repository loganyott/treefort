'use strict';

console.log('Loading function');

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  switch (event.httpMethod) {
    case 'DELETE':
      deletePerformer(event.pathParameters.performerId);
      break;
    case 'GET':
      getPerformer((event.pathParameters ? event.pathParameters : null));
      break;
    case 'POST':
      createPerformer(JSON.parse(event.body).performer);
      break;
    case 'PUT':
      updatePerformer(event.pathParameters.performerId, JSON.parse(event.body).performer);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }

  function getPerformer(pathParameters) {
    const dynamoTableName = 'Performer';
    console.log(`getPerformer: ${pathParameters}`);
    if (pathParameters && pathParameters.performerId) {
      dynamo.get({ TableName: dynamoTableName, Key: { code: pathParameters.performerId } }, done);
    }
    else {
      dynamo.scan({ TableName: dynamoTableName }, done);
    }
  }

  function deletePerformer(performerId) {
    const deleteParams = {
      TableName: 'Performer',
      Key: {
        'code': performerId
      }
    };
    dynamo.delete(deleteParams, done);
  }

  function updatePerformer(performerId, performerInfo) {
    const updateParams = {
      TableName: 'Performer',
      Key: {
        'code': performerId,
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
        ':w': performerInfo.wave
      },
      // Name is a reserved keyword for dynamo db. See http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html for more details.
      ExpressionAttributeNames: {
        '#n': 'name'
      },
      // The entire item is returned, as it appears after the update.
      ReturnValues: 'NONE'
    };

    dynamo.update(updateParams, done);
  }

  function createPerformer(newPerformer) {
    // TODO: Replace this with the crypto package once I get to the point where
    // we can upload functions to the cloud.
    newPerformer.code = '123456789';

    dynamo.put({ TableName: 'Performer', Item: newPerformer }, done);
  }
};
