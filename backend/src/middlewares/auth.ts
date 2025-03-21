import { IncomingMessage, ServerResponse } from 'http';

import { sendResponseToClient } from '../utils/server';

import { HttpStatus } from '../interfaces/server';

import UserService from '../services/user.service';

/**
 * Middleware to check for the
 * authentication status of the user
 *
 */
export async function authenticate(
  req: IncomingMessage,
  res: ServerResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (_: any) => void,
) {
  const token = req.headers.authorization?.split(' ')[1] as string;

  if (!token) {
    return next(null);
  }

  try {
    const user = await UserService.findUserByToken(token);

    const isTokenExpired =
      user.token_expiry && new Date(user.token_expiry) < new Date();

    if (isTokenExpired) {
      next(null);
    }

    next(user);
  } catch {
    return sendResponseToClient(res, HttpStatus.UNAUTHORIZED, {
      success: false,
      error: 'Invalid or expired token!',
    });
  }
}
