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
  next: (_: string) => void,
) {
  const token = req.headers.authorization?.split(' ')[1] as string;

  if (!token) {
    return null;
  }

  try {
    const user = await UserService.findUserByToken(token);

    next(user);
  } catch {
    return sendResponseToClient(res, HttpStatus.UNAUTHORIZED, {
      success: false,
      error: 'Invalid or expired token!',
    });
  }
}
