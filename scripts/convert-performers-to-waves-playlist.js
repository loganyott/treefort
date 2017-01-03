const rp = require('request-promise');
const _ = require('lodash');
const fs = require('fs');

const Artist = require('../src/lib/performer');
const Track = require('../src/lib/song');
const Playlist = require('../src/lib/playlist');

const mapPerformerToTrack = (performer) => {
    const artist = mapPerformerToArtist(performer);

    return new Track({
        artist: artist,
        id: artist.id,
        stream_url: performer.song_url,
    });
};

const mapPerformerToArtist = (performer) => {
    return new Artist({
        id: performer.code,
        name: performer.name,
        wave: performer.wave,
        tier: performer.tier,
    });
};

const mapPerformersToPlaylists = (response) => {
    const tracks = _.map(response.Items, item => mapPerformerToTrack(item));
    const tracksGroupedByWave = _.groupBy(tracks, (track) => track.artist.wave);
    const playlists = _.map(_.keys(tracksGroupedByWave), (key) => {
        return new Playlist({
            name: `Wave ${key}`,
            tracks: tracksGroupedByWave[key],
            id: key,
        });
    });
    const playlistsByKeys = _.keyBy(playlists, 'id');

    return playlistsByKeys;
};

const options = {
    uri: 'https://7n74ikdn58.execute-api.us-west-2.amazonaws.com/dev/v1/performers',
    headers: {
        'content-type': 'application/json',
    }
};

// Make the request and remap the data from the performer API to a playlist structure.
rp(options)
    .then((response) => {
        return mapPerformersToPlaylists(JSON.parse(response));
    })
    .then((playlist) => {
        fs.writeFile('./test.json', JSON.stringify(playlist, null, 2), (err) => {
            if (err) {
                console.log(err);
            }
        });
    })
    .catch((err) => {
        console.error(err);
    });
