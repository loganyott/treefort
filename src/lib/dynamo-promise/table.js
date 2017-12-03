import Promise from 'bluebird';

class DynamoTable {
  constructor(dynamoConnection, tableName) {
    this.dynamo = dynamoConnection;
    this.tableName = tableName;
  }

  patch(query) {
    const params = {
      TableName: this.tableName,
      ReturnValues: 'ALL_NEW',
      ...query
    };

    return new Promise((resolve, reject) => {
      this.dynamo.update(params, (patchError, patchResponse) => {
        if (patchError) {
          reject(patchError);
        } else {
          resolve(patchResponse.Attributes);
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
      Item: item
    };

    return new Promise((resolve, reject) => {
      this.dynamo.put(putParams, putError => {
        if (putError) {
          reject(putError);
        } else {
          // Since dynamodb doesn't support ReturnValues: 'ALL_NEW' return the newly created properties to the client
          // manually
          resolve(item);
        }
      });
    });
  }

  scan(params) {
    // suitable defaults
    let scanParams = {
      TableName: this.tableName
    };

    // add in callers options
    if (params) {
      scanParams = { ...scanParams, ...params };
    }

    // items to aggregate the items through the possible recursion
    let items = [];
    const queryExecute = (resolve, reject) => {
      this.dynamo.scan(scanParams, (scanError, scanResponse) => {
        // something bad happened, reject this promise and output the error
        if (scanError) {
          reject(scanError);
        } else {
          // we got some usable items back, concat them to our array and either
          // recurse or resolve
          items = items.concat(scanResponse.Items);

          // DynamoDB only gives us 1MB of items back at a time, if we have more than
          // 1MB this value will be set and we recurse, otherwise return our aggregated
          // array of items
          if (scanResponse.LastEvaluatedKey) {
            scanParams.ExclusiveStartKey = scanResponse.LastEvaluatedKey;
            queryExecute(resolve, reject);
          } else {
            resolve(items);
          }
        }
      });
    };
    return new Promise(queryExecute);
  }

  // TODO: (bdietz) this could be better support dynamo db's api.
  get(id) {
    const getParams = {
      TableName: this.tableName,
      Key: {
        id
      }
    };

    return new Promise((resolve, reject) => {
      this.dynamo.get(getParams, (getError, getResponse) => {
        if (getError) {
          reject(getError);
        } else {
          resolve(getResponse.Item);
        }
      });
    });
  }

  delete(id) {
    const deleteParams = {
      TableName: this.tableName,
      Key: {
        id
      }
    };

    return new Promise((resolve, reject) => {
      this.dynamo.delete(deleteParams, (deleteError, deleteResponse) => {
        if (deleteError) {
          reject(deleteError);
        } else {
          resolve(deleteResponse);
        }
      });
    });
  }
}

export default DynamoTable;
