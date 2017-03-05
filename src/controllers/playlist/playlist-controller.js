'use strict';

const _ = require('lodash');
const uuidV1 = require('uuid/v1');
const moment = require('moment');
const Playlist = require('../../lib/playlist');
const createDynamoPatchQuery = require('../../lib/dynamo-query').createDynamoPatchQuery;
const dynamoPromiseFactory = require('../../lib/dynamo-promise');


class PlaylistController {
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

    this.playlistTable = dynamoPromise.table(`${dbStage}-playlist`);
  }

  create(playlistObject) {
    const newPlaylist = Object.assign({ }, new Playlist(playlistObject), { id: uuidV1(), updated: moment.utc().format() });
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
    const query = createDynamoPatchQuery({ id: id }, newProperties);
    const promise = this.playlistTable.patch(query);

    return promise;
  }
}

module.exports = {
  PlaylistController,
};
