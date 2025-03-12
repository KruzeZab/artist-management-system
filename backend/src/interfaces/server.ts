import { IncomingHttpHeaders, ServerResponse } from 'http';

export interface RequestData {
  path: string;
  queryString: Record<string, string | string[]>;
  headers: IncomingHttpHeaders;
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

export type RouteHandler = (data: RequestData, res: ServerResponse) => void;
