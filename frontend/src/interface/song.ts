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
  artistName: string;
  genre: Genre;
  createdAt?: string;
  updatedAt?: string;
}
