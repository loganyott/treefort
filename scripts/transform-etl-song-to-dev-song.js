const Song = require('../src/lib/song');
const dynasty = require('dynasty')({
  accessKeyId: process.env.AWS_TMF_ID,
  secretAccessKey: process.env.AWS_TMF_KEY,
  region: 'us-west-2',
});
const _ = require('lodash');

const etlSongTable = dynasty.table('etl-song');
const devSongTable = dynasty.table('dev-song');
const etlPerformerTable = dynasty.table('etl-performer');

const cleanSongTitleAndArtwork = (song) => {
  // Clean up song title
  const title = (song.override_title === null)
    ? song.title
    : song.override_title;

  // Clean up artwork url
  const artworkUrl = (typeof song.album_art === 'undefined')
    ? null
    : song.album_art;

  const songConfig = Object.assign(song, { title }, { artwork_url: artworkUrl });
  return new Song(songConfig);
};

const attachStreamUrlToSong = (artistsById) => {
  return (song) => {
    const currentArtist = artistsById[song.id];
    const noArtistFound = typeof currentArtist === 'undefined';
    if (noArtistFound) {
      console.log(`A song did not have an associated artist: ${JSON.stringify(song)}`);
    }
    return ((noArtistFound)
      ? song
      : new Song(Object.assign({}, song, { stream_url: currentArtist.song_url }))
    );
  };
};

const transform = () => {
  Promise.all([
    etlSongTable.scan(),
    etlPerformerTable.scan(),
  ])
    .then(([
      allETLSongs,
      allETLPerformers,
    ]) => {
      allETLSongs
      .map(cleanSongTitleAndArtwork)
      .map(attachStreamUrlToSong(_.keyBy(allETLPerformers, 'id')))
      .forEach((cleanedSong) => {
        devSongTable.insert(cleanedSong);
      });
    });
};

module.exports = {
  transform,
};
