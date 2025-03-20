import { User } from './user';

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
  meta?: Meta;
}

export interface SingleUserResponse {
  success: boolean;
  data: User;
}
