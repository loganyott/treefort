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
      deleteEvent(event.pathParameters.eventId);
      break;
    case 'GET':
      getEvent((event.pathParameters ? event.pathParameters : null));
      break;
    case 'POST':
      createEvent(JSON.parse(event.body).event);
      break;
    case 'PUT':
      updateEvent(event.pathParameters.eventId, JSON.parse(event.body).event);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }

  function getEvent(pathParameters) {
    const dynamoTableName = 'Event';
    console.log(`getEvent: ${pathParameters}`);
    if (pathParameters && pathParameters.eventId) {
      dynamo.get({ TableName: dynamoTableName, Key: { code: pathParameters.eventId } }, done);
    }
    else {
      dynamo.scan({ TableName: dynamoTableName }, done);
    }
  }

  function deleteEvent(eventId) {
    const deleteParams = {
      TableName: 'Event',
      Key: {
        'code': eventId
      }
    };
    dynamo.delete(deleteParams, done);
  }

  function updateEvent(eventId, eventInfo) {
    const updateParams = {
      TableName: 'Event',
      Key: {
        'code': eventId,
      },
      // TODO: Update properties based upon what is passed in.
      UpdateExpression: `set
                description = :d,
                end_time    = :e,
                forts       = :f,
                #n          = :n,
                performers  = :p,
                start_time  = :s,
                tracks      = :t,
                venue       = :v`,
      ExpressionAttributeValues: {
        ':d': eventInfo.description,
        ':e': eventInfo.end_time,
        ':f': eventInfo.forts,
        ':n': eventInfo.name,
        ':p': eventInfo.performers,
        ':s': eventInfo.start_time,
        ':t': eventInfo.tracks,
        ':v': eventInfo.venue,
      },
      // Name is a reserved keyword for dynamo db. See http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html for more details.
      ExpressionAttributeNames: {
        '#n': 'name'
      },

      ReturnValues: "NONE"
    };

    dynamo.update(updateParams, done);
  }

  function createEvent(newEvent) {
    // TODO: Replace this with the crypto package once I get to the point where
    // we can upload functions to the cloud.
    newEvent.code = '123456789';

    dynamo.put({ TableName: 'Event', Item: newEvent }, done);
  }
};