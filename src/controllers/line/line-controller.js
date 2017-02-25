'use strict';

const dynamoPromiseFactory = require('../../lib/dynamo-promise');
const _ = require('lodash');

const restrictedKeys = [
  'id',
  'updated',
];

const convertPropertyToDynamo = propertyString => `:${propertyString}`;
const createSetStatement = propertyString => `${propertyString} = ${convertPropertyToDynamo(propertyString)}`;

const createDynamoPatchQuery = (primaryKeys, propertiesToUpdate) => {
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

// console.log(createDynamoPatchQuery({id: 420}, { lineTag: 'foo'}));

class LineController {
  /**
   * @param dynamo A connection to dynamo db.
   */
  constructor(dynamo, dbStage, currentWave) {
    const dynamoPromise = dynamoPromiseFactory(dynamo);
    console.log(`dbStage: ${dbStage}, currentWave: ${currentWave}`);

    if (!dbStage) {
      console.error('stageVariables.db_stage');
      throw new Error('ERROR: no stage was set. Please set db_stage in the appropriate stage');
    }

    this.LineTable = dynamoPromise.table(`${dbStage}-line`);
  }

  update(id, newProperties) {
    const query = createDynamoPatchQuery({ 'id': id }, newProperties);
    const promise = this.LineTable.patch(query);

    return promise;
  }

  get(lineId) {
    let promise;

    if (lineId) {
      promise = this.LineTable
        .get(lineId);
    } else {
      promise = this.LineTable
        .scan();
    }

    return promise;
  }
}

module.exports = {
  LineController,
};
