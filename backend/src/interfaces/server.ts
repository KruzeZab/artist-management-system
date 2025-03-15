import { IncomingHttpHeaders, ServerResponse } from 'http';

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
}

export interface RequestData {
  path: string;
  queryString: Record<string, string | string[]>;
  headers: IncomingHttpHeaders;
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  routeParams?: Record<string, string>;
}

export type RouteHandler = (data: RequestData, res: ServerResponse) => void;
