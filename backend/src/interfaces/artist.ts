import { Gender } from './common';

export interface Artist {
  name: string;
  dob: string;
  gender: Gender;
  address: string;
  firstReleaseYear: string;
  noOfAlbumsReleased: number;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateArtist = Omit<Artist, 'createdAt' | 'updatedAt'>;
