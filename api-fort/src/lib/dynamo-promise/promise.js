import DynamoTable from './table';

class DynamoPromise {
  constructor(dynamoConnection) {
    if (!dynamoConnection) {
      throw new Error('ERROR: No dynamo connection was passed in');
    }

    this.dynamoConnection = dynamoConnection;
  }

  table(tableName) {
    if (!tableName) {
      throw new Error(
        'ERROR: no table name was supplied as an argument to DynamoPromise#table'
      );
    }

    return new DynamoTable(this.dynamoConnection, tableName);
  }
}

const dynamoPromise = dynamoDbConnection =>
  new DynamoPromise(dynamoDbConnection);

export default dynamoPromise;
