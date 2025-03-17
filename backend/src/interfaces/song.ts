export enum Genre {
  RNB = 'rnb',
  COUNTRY = 'country',
  CLASSIC = 'classic',
  ROCK = 'rock',
  JAZZ = 'jazz',
}

export interface Song {
  artistId: number;
  title: string;
  albumName: string;
  genre: Genre;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateSong = Omit<Song, 'createdAt' | 'updatedAt'>;
