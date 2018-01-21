import _ from 'lodash';
import moment from 'moment-timezone';
import uuidV1 from 'uuid/v1';
import {
  promise as dynamoPromiseFactory,
  query
} from '../../lib/dynamo-promise';
import Playlist from './playlist.model';
import log from '../../utils/logging';

/**
 * A class to encapsulate CRUD operations on the $PREFIX-playlist tables
 */
@log
class PlaylistController {
  /**
   * @param {object} dynamo object connection to dynamodb
   * @param {string} dbStage 'dev' or 'prod' to determine the dynamodb table prefix
   * @param {string} currentYear ex. '2018' 
   */
  constructor(dynamo, dbStage, currentYear) {
    const dynamoPromise = dynamoPromiseFactory(dynamo);
    this.playlistTable = dynamoPromise.table(`${dbStage}-playlist`);
    this.currentYear = currentYear;
  }

  create(playlistObject) {
    const newPlaylist = {
      ...new Playlist(playlistObject),
      id: uuidV1(),
      updated: moment.utc().format('YYYY-MM-DDTHH:mm')
    };
    const promise = this.playlistTable.put(newPlaylist);

    return promise;
  }

  get(playlistId) {
    let promise;

    if (playlistId) {
      promise = this.playlistTable.get(playlistId);
    } else {
      promise = this.playlistTable
        .scan()
        // Only sort the list of playlists
        .then(getResponse => _.sortBy(getResponse, 'order'));
    }

    return promise;
  }

  update(id, newProperties) {
    const updateQuery = query.createDynamoPatchQuery({ id }, newProperties);
    const promise = this.playlistTable.patch(updateQuery);

    return promise;
  }
}

export default PlaylistController;
