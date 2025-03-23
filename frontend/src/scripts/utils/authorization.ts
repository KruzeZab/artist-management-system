import { getCurrentUser } from './user';

import { Role } from '../../interface/user';

import { AUTHORIZED_ROUTES, PUBLIC_ROUTES } from '../../constants/routes';

/**
 * Authorize user based on the route
 *
 */
export function isAuthorized(route: string): boolean {
  const currentUser = getCurrentUser();

  if (PUBLIC_ROUTES.includes(route)) {
    return true;
  }

  if (!currentUser) {
    return false;
  }

  const userRole = currentUser.role;

  if (AUTHORIZED_ROUTES[userRole].includes('*')) {
    return true;
  }

  if (AUTHORIZED_ROUTES[userRole].includes(route)) {
    return true;
  }

  return false;
}

/**
 * Hide components based on the users role
 *
 */
export function hideForRoles(element: HTMLElement, roles: Role[]) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return;
  }

  const userRole = currentUser.role;

  if (roles.includes(userRole)) {
    element.classList.add('d-none');
  } else {
    element.classList.remove('d-none');
  }
}
