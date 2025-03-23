import { AUTH } from '../../constants/application';

import { AuthUser, Gender, Role } from '../../interface/user';

/**
 * Get full name of the user
 *
 */
export function getFullName(fName: string, lName: string) {
  return fName + ' ' + lName;
}

/**
 * Map gender to its full name
 *
 */
export function mapGender(gender: Gender) {
  const genderMap = {
    [Gender.MALE]: 'Male',
    [Gender.FEMALE]: 'Female',
    [Gender.OTHERS]: 'others',
  };

  return genderMap[gender];
}

/**
 * Map role to its full name
 *
 */
export function mapRole(role: Role) {
  const roleMap = {
    [Role.SUPER_ADMIN]: 'Super Admin',
    [Role.ARTIST_MANAGER]: 'Artist Manager',
    [Role.ARTIST]: 'Artist',
  };

  return roleMap[role];
}

/**
 * Format the date string to input
 *
 */
export const formatDateForInput = (dateString: string) => {
  const [month, day, year] = dateString.split('/').map(Number);

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/**
 * Get current user information
 *
 */
export const getCurrentUser = () => {
  const authUser = localStorage.getItem(AUTH);

  let currentUser: AuthUser | null = null;

  if (authUser && authUser !== 'undefined') {
    currentUser = JSON.parse(authUser);
  }

  return currentUser;
};
