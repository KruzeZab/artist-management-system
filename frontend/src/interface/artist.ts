import { Gender, User } from './user';

export interface Artist extends User {
  id: number;
  userId: number;
  firstReleaseYear: string;
  noOfAlbumsReleased: number;
}

export interface UpdateArtist {
  firstName: string;
  lastName: string;
  dob: string;
  gender: Gender;
  address: string;
  firstReleaseYear: number;
  noOfAlbumsReleased: number;
}
