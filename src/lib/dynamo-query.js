'use strict';
const moment = require('moment');
const _ = require('lodash');

const restrictedKeys = [
  'id',
];

const convertPropertyToDynamo = propertyString => `:${propertyString}`;
const createSetStatement = propertyString => `${propertyString} = ${convertPropertyToDynamo(propertyString)}`;

const createDynamoPatchQuery = (primaryKeys, _propertiesToUpdate) => {
  const propertiesToUpdate = Object.assign({}, _propertiesToUpdate, { updated: moment.utc().format() });

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
