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
  if (role === Role.SUPER_ADMIN || requiredRoles.includes(role)) {
    return next();
  }

  return sendResponseToClient(res, HttpStatus.UNAUTHORIZED, {
    success: false,
    message: 'You are not authorized',
  });
};
