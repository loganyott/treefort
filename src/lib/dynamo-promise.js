'use strict';

const Promise = require('bluebird');

class DynamoTable {
  constructor(dynamoConnection, tableName) {
    this.dynamo = dynamoConnection;
    this.tableName = tableName;
  }

  put(item) {
    const putParams = {
      TableName: this.tableName,
      Item: item,
    };

    return new Promise((resolve, reject) => {
      this.dynamo
        .put(putParams, (putError, putResponse) => {
          if (putError) {
            reject(putError);
          } else {
            resolve(putResponse.Item);
          }
        });
    });
  }

  scan() {
    const scanParams = {
      TableName: this.tableName,
    };

    return new Promise((resolve, reject) => {
      this.dynamo
        .scan(scanParams, (scanError, scanResponse) => {
          if (scanError) {
            reject(scanError);
          } else {
            resolve(scanResponse.Items);
          }
        });
    });
  }

  // TODO: (bdietz) this could be better supported to match the aws dynamo db more robustly.
  get(id) {
    const getParams = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };

    return new Promise((resolve, reject) => {
      this.dynamo
        .get(getParams, (getError, getResponse) => {
          if (getError) {
            reject(getError);
          } else {
            resolve(getResponse.Item);
          }
        });
    });
  }
}

class DynamoPromise {
  constructor(dynamoConnection) {
    if (!dynamoConnection) {
      throw new Error('ERROR: No dynamo connection was passed in');
    }

    this.dynamoConnection = dynamoConnection;
  }

  table(tableName) {
    if (!tableName) {
      throw new Error('ERROR: no table name was supplied as an argument to DynamoPromise#table');
    }

    return new DynamoTable(this.dynamoConnection, tableName);
  }
}

const dynamoPromise = dynamoDbConnection => new DynamoPromise(dynamoDbConnection);

module.exports = dynamoPromise;
