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
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateUser = Omit<User, 'createdAt' | 'updatedAt'>;
