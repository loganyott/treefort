'use strict';

const cleanSong = require('./transform-song.mock').cleanSong;

const dirtyPerformer = {
  bio: 'Philadelphia natives Creepoid have released three highly acclaimed albums--CEMETERY HIGHRISE SLUM (2015), CREEPOID (2014) and HORSE HEAVEN (2010)--and three EPs: YELLOW LIVE GIVER (2010), WET (2014) and just-released EP "Burner" out on WavePOP Records.\r\n\r\nKnown for their mesmerizing, mindbending live shows, Creepoid has shared the stage with Drive Like Jehu, Dinosaur Jr., Against Me!, Kurt Vile, Refused, Failure, Quicksand, Dead Meadow, Protomartyr, Best Coast, Swervedriver, ...Trail of Dead, A Place To Bury Strangers, Twin Shadow, Warpaint, Converge, Jesus and Mary Chain, Black Moth Super Rainbow, Night Beats and Psychic Ills, among many others.',
  code: '2017-6944477',
  facebook_url: 'https://www.facebook.com/creepoid/?fref=ts',
  forts: [
    'Treefort',
  ],
  genres: [
    'Haunting',
    'Heavy',
    'Rock',
  ],
  home_town: 'Philadelphia, PA',
  id: '2017-6944477',
  image_app_url: 'https://s3-us-west-2.amazonaws.com/treefort-images/2017-6944477-app.jpg',
  image_url: 'https://s3-us-west-2.amazonaws.com/treefort-images/2017-6944477.jpg',
  image_url_med: 'https://s3-us-west-2.amazonaws.com/treefort-images/2017-6944477-med.jpg',
  instagram_url: 'https://www.instagram.com/creepoidphilly/',
  music_url: 'https://soundcloud.com/collectrecords/sets/creepoid-cemetery-highrise',
  name: 'Creepoid',
  orig_song_name: '04_Baptism.mp3',
  song_url: 'https://s3-us-west-2.amazonaws.com/treefort-songs/2017-6944477.mp3',
  sort_order_within_tier: 1175,
  tier: 1,
  twitter_url: 'https://twitter.com/creepoidphilly',
  video_url: null,
  wave: 2,
  website_url: 'http://www.creepoid.com/',
};

const cleanPerformer = {
  id: '2017-6944477',
  bio: 'Philadelphia natives Creepoid have released three highly acclaimed albums--CEMETERY HIGHRISE SLUM (2015), CREEPOID (2014) and HORSE HEAVEN (2010)--and three EPs: YELLOW LIVE GIVER (2010), WET (2014) and just-released EP "Burner" out on WavePOP Records.\r\n\r\nKnown for their mesmerizing, mindbending live shows, Creepoid has shared the stage with Drive Like Jehu, Dinosaur Jr., Against Me!, Kurt Vile, Refused, Failure, Quicksand, Dead Meadow, Protomartyr, Best Coast, Swervedriver, ...Trail of Dead, A Place To Bury Strangers, Twin Shadow, Warpaint, Converge, Jesus and Mary Chain, Black Moth Super Rainbow, Night Beats and Psychic Ills, among many others.',
  facebook_url: 'https://www.facebook.com/creepoid/?fref=ts',
  forts: [
    'Treefort',
  ],
  genres: [
    'Haunting',
    'Heavy',
    'Rock',
  ],
  home_town: 'Philadelphia, PA',
  image_app_url: 'https://s3-us-west-2.amazonaws.com/treefort-images/2017-6944477-app.jpg',
  image_url: 'https://s3-us-west-2.amazonaws.com/treefort-images/2017-6944477.jpg',
  image_url_med: 'https://s3-us-west-2.amazonaws.com/treefort-images/2017-6944477-med.jpg',
  instagram_url: 'https://www.instagram.com/creepoidphilly/',
  music_url: 'https://soundcloud.com/collectrecords/sets/creepoid-cemetery-highrise',
  name: 'Creepoid',
  sort_order_within_tier: 1175,
  tier: 1,
  twitter_url: 'https://twitter.com/creepoidphilly',
  video_url: null,
  wave: 2,
  website_url: 'http://www.creepoid.com/',
};

const cleanPerformerWithSong = Object.assign({}, cleanPerformer, { song: cleanSong })

module.exports = {
  dirtyPerformer,
  cleanPerformer,
  cleanPerformerWithSong,
};
