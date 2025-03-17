import { ServerResponse } from 'http';

import { HttpStatus } from '../interfaces/server';
import { Role } from '../interfaces/user';

import { sendResponseToClient } from './server';

/**
 * Check for users permission based on role
 *
 */
export const checkUserPermission = (
  res: ServerResponse,
  role: Role,
  requiredRoles: Role[],
  next: () => void,
) => {
  const hasPermission = requiredRoles.includes(role);

  if (!hasPermission) {
    return sendResponseToClient(res, HttpStatus.UNAUTHORIZED, {
      success: false,
      response: {
        message: 'You are not authorized',
      },
    });
  }
  next();
};
