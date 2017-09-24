import _ from 'lodash';
import moment from 'moment-timezone';
import ReservedWords from './reserved-words';

const currentTime = () =>
  moment()
    .tz('America/Boise')
    .format('YYYY-MM-DDTHH:mm');

const restrictedKeys = new Set();
restrictedKeys.add('id');

const convertPropertyToDynamo = propertyString => `:${propertyString}`;
const createSetStatement = propertyString => {
  const dynamoPropertyValue = convertPropertyToDynamo(propertyString);
  if (ReservedWords.has(propertyString.toUpperCase())) {
    const nameSubstitue = ReservedWords.get(propertyString.toUpperCase());
    return `#${nameSubstitue} = ${dynamoPropertyValue}`;
  }

  return `${propertyString} = ${dynamoPropertyValue}`;
};

const createDynamoPatchQuery = (primaryKeys, _propertiesToUpdate) => {
  // TODO: (bdietz) - Fix this
  // It's kind of weird ahving this in there with the modified timestamp being specific to Boise, but some of the client
  // team wanted it this way... I think that we should change how we do this in the future
  const propertiesToUpdate = Object.assign({}, _propertiesToUpdate, {
    updated: currentTime()
  });

  const keysToUpdate = _.keys(propertiesToUpdate).filter(
    keyName => !restrictedKeys.has(keyName)
  );

  const expressionAttributeValues = _.reduce(
    keysToUpdate,
    (result, objectKey) => ({
      ...result,
      [convertPropertyToDynamo(objectKey)]: propertiesToUpdate[objectKey]
    }),
    {}
  );

  const updateExpressionSetStatements = keysToUpdate.map(key =>
    createSetStatement(key)
  );
  const updateExpression = `set ${updateExpressionSetStatements.join(', ')}`;

  const reservedKeysToUpdate = keysToUpdate.filter(keyToUpdate =>
    ReservedWords.has(keyToUpdate.toUpperCase())
  );
  const expressionAttributeNames = reservedKeysToUpdate.reduce(
    (accumulator, currentKey) => ({
      ...accumulator,
      [`#${ReservedWords.get(currentKey.toUpperCase())}`]: currentKey
    }),
    {}
  );

  const dynamoUpdateQuery = {
    Key: primaryKeys,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames
  };

  return dynamoUpdateQuery;
};

export { currentTime };

export default createDynamoPatchQuery;
