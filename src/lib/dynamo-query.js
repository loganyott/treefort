'use strict';
const moment = require('moment-timezone');
const _ = require('lodash');

const restrictedKeys = [
  'id',
];

const convertPropertyToDynamo = propertyString => `:${propertyString}`;
const createSetStatement = propertyString => `${propertyString} = ${convertPropertyToDynamo(propertyString)}`;

const createDynamoPatchQuery = (primaryKeys, _propertiesToUpdate) => {
  // It's kind of weird ahving this in there with the modified timestamp being specific to Boise, but some of the client
  // team wanted it this way... I think that we should change how we do this in the future
  const propertiesToUpdate = Object.assign({}, _propertiesToUpdate, { updated: moment().tz('America/Boise').format('YYYY-MM-DDThh:mm') });

  const keysToUpdate = _.keys(propertiesToUpdate)
    .filter((keyName) => {
      return !_.includes(restrictedKeys, keyName);
    });

  const expressionAttributeValues = _.reduce(keysToUpdate, (result, objectKey) => {
    result[convertPropertyToDynamo(objectKey)] = propertiesToUpdate[objectKey];
    return result;
  }, {});

  const updateExpressionSetStatements = keysToUpdate.map(key => createSetStatement(key));
  const updateExpression = `set ${updateExpressionSetStatements.join(', ')}`;

  const dynamoUpdateQuery = {
    Key: primaryKeys,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  return dynamoUpdateQuery;
};

module.exports.createDynamoPatchQuery = createDynamoPatchQuery;
