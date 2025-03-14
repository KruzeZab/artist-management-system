import { ServerResponse } from 'http';

import { HttpStatus } from '../interfaces/server';

/**
 * Handles sending response to client
 *
 */
export const sendResponseToClient = (
  res: ServerResponse,
  statusCode: HttpStatus,
  data: unknown,
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

/**
 * Create response object to send response to controller
 *
 */
export const sendApiResponse = (options: {
  status: HttpStatus;
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any;
}): {
  status: number;
  success: boolean;
  response: { [key: string]: string | number | string[] | undefined };
} => ({
  status: options.status,
  success: options.success,
  response: options.response,
});
