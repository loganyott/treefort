class Playlist {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.songs = config.songs || [];
    this.order = config.order || 0;
  }
}

export default Playlist;
