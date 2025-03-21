import { User } from './user';
import { Artist } from './artist';

export interface ServerResponse {
  success: boolean;
  message: string;
  error?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface Meta {
  totalRecords: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  meta: Meta;
}

export interface SingleUserResponse {
  success: boolean;
  data: User;
  message: string;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
  data: number;
}

export interface ArtistListResponse {
  success: boolean;
  data: Artist[];
  meta: Meta;
}

export interface SingleArtistResponse {
  success: boolean;
  message: string;
  data: Artist;
}

export interface DeleteArtistResponse {
  success: boolean;
  message: string;
  data: number;
}
