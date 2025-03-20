export enum Gender {
  MALE = 'm',
  FEMALE = 'f',
  OTHERS = 'o',
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ARTIST_MANAGER = 'artist_manager',
  ARTIST = 'artist',
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  gender: Gender;
  address: string;
  role: Role;
  token?: string;
  expiryTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: Gender;
  address: string;
}
