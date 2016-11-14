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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
  });

  switch (event.httpMethod) {
    case 'DELETE':
      deleteVenue(event.pathParameters.venueId);
      break;
    case 'GET':
      getVenue((event.pathParameters ? event.pathParameters : null));
      break;
    case 'POST':
      createVenue(JSON.parse(event.body).venue);
      break;
    case 'PUT':
      updateVenue(event.pathParameters.venueId, JSON.parse(event.body).venue);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }

  function getVenue(pathParameters) {
    const dynamoTableName = 'Venue';
    if (pathParameters && pathParameters.venueId) {
      dynamo.get({ TableName: dynamoTableName, Key: { code: pathParameters.venueId } }, done);
    }
    else {
      dynamo.scan({ TableName: dynamoTableName }, done);
    }
  }

  function deleteVenue(venueId) {
    const deleteParams = {
      TableName: 'Venue',
      Key: {
        'code': venueId
      }
    };
    dynamo.delete(deleteParams, done);
  }

  function updateVenue(venueId, venueInfo) {
    const updateParams = {
      TableName: 'Venue',
      Key: {
        'code': venueId,
      },
      UpdateExpression: `set
            additional_directions = :ai,
            address     = :ar,
            description = :d,
            image_url   = :i,
            #n          = :n,
            social_url  = :s
            `,
      ExpressionAttributeValues: {
        ':ai': venueInfo.additional_directions,
        ':ar': venueInfo.address,
        ':d': venueInfo.description,
        ':i': venueInfo.image_url,
        ':n': venueInfo.name,
        ':s': venueInfo.social_url,
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

  function createVenue(newVenue) {
    // TODO: Replace this with the crypto package once I get to the point where
    // we can upload functions to the cloud.
    newVenue.code = '123456789';

    dynamo.put({ TableName: 'Venue', Item: newVenue }, done);
  }
};
