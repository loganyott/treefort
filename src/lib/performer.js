'use strict';

class Performer {
  constructor(config) {
    this.id = config.id || null;
    this.bio = config.bio || null;
    this.code = config.code || null;
    this.facebook_url = config.facebook_url || null;
    this.forts = config.forts || [];
    this.genres = config.genres || [];
    this.home_town = config.home_town || null;
    this.image_app_url = config.image_app_url || null;
    this.image_url = config.image_url || null;
    this.image_url_med = config.image_url_med || null;
    this.music_url = config.music_url || null;
    this.name = config.name || null;
    this.orig_song_name = config.orig_song_name || null;
    this.song = config.song || null;
    this.song_url = config.song_url || null;
    this.sort_order_within_tier = config.sort_order_within_tier || null;
    // currently song_url
    // this.stream_url = config.stream_url || null;
    this.tier = config.tier || null;
    this.twitter_url = config.twitter_url || null;
    this.video_url = config.video_url || null;
    this.wave = config.wave || null;
  }
}

module.exports = Performer;
