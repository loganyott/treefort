'use strict';

const Promise = require('bluebird');

class DynamoTable {

  constructor(dynamoConnection, tableName) {
    this.dynamo = dynamoConnection;
    this.tableName = tableName;
  }

  patch(query) {
    const params = Object.assign({ }, { TableName: this.tableName, ReturnValues: "UPDATED_NEW" }, query);

    return new Promise((resolve, reject) => {
      this.dynamo
        .update(params,(patchError, patchResponse) => {
          if (patchError) {
            reject(patchError);
          } else {
            resolve(patchResponse.Item);
          }
        });
    });
  }

  batchPut(items) {
    const batchPutPromises = items.map(item => this.put(item));

    return Promise.all(batchPutPromises);
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

  scan(params) {
    let scanParams = {
      TableName: this.tableName,
    };

    if (params) {
      scanParams = Object.assign({}, scanParams, params);
    }

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

  // TODO: (bdietz) this could be better support dynamo db's api.
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

module.exports = DynamoTable;
