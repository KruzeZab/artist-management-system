import { Gender } from './user';

export interface Artist {
  id: number;
  name: string;
  dob: string;
  gender: Gender;
  address: string;
  firstReleaseYear: string;
  noOfAlbumsReleased: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateArtist {
  name: string;
  dob: string;
  gender: Gender;
  address: string;
  firstReleaseYear: string;
  noOfAlbumsReleased: number;
}
