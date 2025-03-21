import { Gender } from './common';

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ARTIST_MANAGER = 'artist_manager',
  ARTIST = 'artist',
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  gender: Gender;
  address: string;
  role: Role;
  token?: string | null;
  tokenExpiry?: Date | null;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateUser = Partial<User>;
