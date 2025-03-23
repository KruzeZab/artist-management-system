export enum Genre {
  RNB = 'rnb',
  COUNTRY = 'country',
  CLASSIC = 'classic',
  ROCK = 'rock',
  JAZZ = 'jazz',
}

export interface Song {
  id: number;
  artistId: number;
  title: string;
  albumName: string;
  artistFirstName: string;
  artistLastName: string;
  genre: Genre;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSong {
  title: string;
  albumName: string;
  genre: Genre;
}
