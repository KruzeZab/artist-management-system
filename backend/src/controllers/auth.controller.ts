import { ServerResponse } from 'http';

import { User } from '../interfaces/user';
import { HttpStatus, RequestData } from '../interfaces/server';

import { sendResponseToClient } from '../utils/server';

import AuthService from '../services/auth.service';

import { POST } from '../constants/methods';

/**
 * Register new user
 *
 */
export async function registerUser(req: RequestData, res: ServerResponse) {
  if (req.method !== POST) {
    return sendResponseToClient(res, HttpStatus.METHOD_NOT_ALLOWED, {
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const user: User = req.body;
    const data = await AuthService.register(user);

    sendResponseToClient(res, data.status, data.response);
  } catch (error) {
    console.error('Error handling request:', error);
    sendResponseToClient(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      success: false,
      error: 'Internal Server Error',
    });
  }
}

/**
 * Login a user
 *
 */
export async function loginUser(req: RequestData, res: ServerResponse) {
  if (req.method !== POST) {
    return sendResponseToClient(res, HttpStatus.METHOD_NOT_ALLOWED, {
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { email, password } = req.body;

    const data = await AuthService.login(email, password);

    return sendResponseToClient(res, data.status, data.response);
  } catch (error) {
    console.error('Error handling login request:', error);

    return sendResponseToClient(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Rengerate JWT Token
 *
 */
export async function regenerateToken(req: RequestData, res: ServerResponse) {
  if (req.method !== POST) {
    return sendResponseToClient(res, HttpStatus.METHOD_NOT_ALLOWED, {
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { refreshToken } = req.body;

    const data = await AuthService.regenerateToken(refreshToken);

    return sendResponseToClient(res, data.status, data.response);
  } catch (error) {
    console.error('Error handling login request:', error);

    return sendResponseToClient(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      success: false,
      error: 'Internal server error',
    });
  }
}
