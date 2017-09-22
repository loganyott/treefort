import _ from 'lodash';
import moment from 'moment-timezone';
import uuidV1 from 'uuid/v1';
import {
  promise as dynamoPromiseFactory,
  query
} from '../../lib/dynamo-promise';
import Playlist from './playlist.model';

class PlaylistController {
  constructor(dynamo, dbStage, currentWave) {
    const dynamoPromise = dynamoPromiseFactory(dynamo);
    console.log(`dbStage: ${dbStage}, currentWave: ${currentWave}`);

    if (!dbStage) {
      console.error('stageVariables.db_stage');
      throw new Error('ERROR: no stage was set. Please set db_stage in the appropriate stage');
    }

    this.playlistTable = dynamoPromise.table(`${dbStage}-playlist`);
  }

  create(playlistObject) {
    const newPlaylist = Object.assign({ }, new Playlist(playlistObject), { id: uuidV1(), updated: moment.utc().format('YYYY-MM-DDTHH:mm') });
    const promise = this.playlistTable.put(newPlaylist);

    return promise;
  }

  get(playlistId) {
    let promise;

    if (playlistId) {
      promise = this.playlistTable
        .get(playlistId);
    } else {
      promise = this.playlistTable
        .scan();
    }

    return promise
      .then(getResponse => _.sortBy(getResponse, 'order'));
  }

  update(id, newProperties) {
    const query = query.createDynamoPatchQuery({ id: id }, newProperties);
    const promise = this.playlistTable.patch(query);

    return promise;
  }
}

export default PlaylistController;
