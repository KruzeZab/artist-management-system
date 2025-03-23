import { Gender, User } from './user';

export interface Artist extends User {
  id: number;
  firstReleaseYear: string;
  noOfAlbumsReleased: number;
}

export interface UpdateArtist {
  name: string;
  dob: string;
  gender: Gender;
  address: string;
  firstReleaseYear: number;
  noOfAlbumsReleased: number;
}
