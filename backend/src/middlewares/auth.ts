import jwt from 'jsonwebtoken';
import { IncomingMessage, ServerResponse } from 'http';

import { sendResponseToClient } from '../utils/server';

import serverConfig from '../config/config';

import { HttpStatus } from '../interfaces/server';

/**
 * Middleware to check for the
 * authentication status of the user
 *
 */
export function authenticate(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  const token = req.headers.authorization?.split(' ')[1] as string;

  if (!token) {
    return sendResponseToClient(res, HttpStatus.UNAUTHORIZED, {
      success: false,
      error: 'No access token!',
    });
  }

  try {
    const user = jwt.verify(token, serverConfig.jwt.accessToken);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).user = user;

    next();
  } catch {
    return sendResponseToClient(res, HttpStatus.UNAUTHORIZED, {
      success: false,
      error: 'Invalid or expired token!',
    });
  }
}
