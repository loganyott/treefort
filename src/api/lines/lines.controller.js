import uuidV1 from 'uuid/v1';
import moment from 'moment-timezone';
import Line from './line.model';
import {
  promise as dynamoPromiseFactory,
  query
} from '../../lib/dynamo-promise';
import log from '../../utils/logging';

/**
 * A class to encapsulate CRUD operations on the $PREFIX-line tables
 */
@log
class LineController {
  /**
   * @param {object} dynamo object connection to dynamodb
   * @param {string} dbStage 'dev' or 'prod' to determine the dynamodb table prefix
   * @param {string} currentYear ex. '2018' 
   */
  constructor(dynamo, dbStage, currentYear) {
    const dynamoPromise = dynamoPromiseFactory(dynamo);
    this.lineTable = dynamoPromise.table(`${dbStage}-line`);
    this.currentYear = currentYear;
  }

  create(lineObject) {
    const newLine = {
      ...new Line(lineObject),
      id: uuidV1(),
      updated: moment()
        .tz('America/Boise')
        .format('YYYY-MM-DDTHH:mm')
    };
    const promise = this.lineTable.put(newLine);

    return promise;
  }

  get(lineId) {
    let promise;

    if (lineId) {
      promise = this.lineTable.get(lineId);
    } else {
      promise = this.lineTable.scan();
    }

    return promise;
  }

  update(id, newProperties) {
    const updateQuery = query.createDynamoPatchQuery({ id }, newProperties);
    return this.lineTable.patch(updateQuery);
  }
}

export default LineController;
