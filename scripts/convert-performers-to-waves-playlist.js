const rp = require('request-promise');
const _ = require('lodash');
const fs = require('fs');

const Artist = require('../src/lib/artist');
const Track = require('../src/lib/track');
const Playlist = require('../src/lib/playlist');

const options = {
    uri: 'https://7n74ikdn58.execute-api.us-west-2.amazonaws.com/dev/v1/performers',
    headers: {
        'content-type': 'application/json',
    }
};

// Make the request and remap the data from the performers API to a playlist structure.
rp(options)
    .then((response) => {
        const tracks = _.map(JSON.parse(response).Items, (item) => mapItemToTrack(item));
        const tracksGroupedByWave = _.groupBy(tracks, (track) => track.Artist.Wave);
        const playlists = _.map(_.keys(tracksGroupedByWave), (key) => {
            return new Playlist({
                Name: `Wave ${key}`,
                Tracks: tracksGroupedByWave[key],
                Id: key,
            });
        });
        const playlistsByKeys = _.keyBy(playlists, 'Id');

        return playlistsByKeys;
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

// TODO: (bdietz) Note that the commented out properties below are artifacts from treefort 2016.
// TODO: (bdietz) Also I think that the model capitalization is wonky af we should lower-snake-case at some point plz.
// Keeping the casing for now just for the sake of uniformity.

function mapItemToTrack(item) {
    const artist = mapItemToArtist(item);

    return new Track({
        Artist: artist,
        //TODO: This doesn't feel right
        Id: item.code ,
        // Title: item.Title,
        // SCTitle: item.SCTitle,
        ArtworkUrl: item.image_url,
        StreamUrl: item.song_url,
    });
}

function mapItemToArtist(item) {
    return new Artist({
        Id: item.code,
        Name: item.name,
        // SCTrackId: item.SCTrackId,
        // LiveDate: item.LiveDate,
        // DisplayOrder: item.sort_order_within_tier,
        Wave: item.wave,
        Tier: item.tier,
    });
}
