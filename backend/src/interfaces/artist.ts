import { User } from './user';

export interface Artist extends User {
  userId: number;
  firstReleaseYear: string;
  noOfAlbumsReleased: number;
}

export type UpdateArtist = Omit<Artist, 'createdAt' | 'updatedAt'>;
