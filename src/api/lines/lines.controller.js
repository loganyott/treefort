import uuidV1 from 'uuid/v1';
import moment from 'moment-timezone';
import Line from './line.model';
import {
  promise as dynamoPromiseFactory,
  query
} from '../../lib/dynamo-promise';
import log from '../../utils/logging';

@log
class LineController {
  constructor(dynamo, dbStage) {
    const dynamoPromise = dynamoPromiseFactory(dynamo);

    if (!dbStage) {
      console.error('stageVariables.db_stage');
      throw new Error(
        'ERROR: no stage was set. Please set db_stage in the appropriate stage'
      );
    }

    this.lineTable = dynamoPromise.table(`${dbStage}-line`);
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
