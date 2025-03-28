import { Gender } from '../interfaces/common';
import { User, Role, UpdateUser } from '../interfaces/user';

import { EMAIL_REGEX, PASSWORD_REGEX } from '../constants/validator';
import { validateProperties } from '../utils/object';

/**
 * Validate the body of user registration
 *
 */
export function validateUserRegister(user: User) {
  const errors: string[] = [];

  const allowedKeys = Object.keys({} as User) as (keyof User)[];

  // Validate extra properties
  errors.push(...validateProperties(user, allowedKeys));

  if (!user.firstName || user.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters long.');
  }

  if (!user.lastName || user.lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters long.');
  }

  if (!user.email || !EMAIL_REGEX.test(user.email)) {
    errors.push('Invalid email format.');
  }

  if (!user.password || !PASSWORD_REGEX.test(user.password)) {
    errors.push(
      'Password must be greater than length 6 and must container one uppercase letter.',
    );
  }

  if (!user.phone || !user.phone.trim()) {
    errors.push('Phone number is required.');
  }

  if (!user.dob) {
    errors.push('Date of birth is required.');
  }

  if (!user.address || !user.address.trim()) {
    errors.push('Address is required.');
  }

  if (!user.gender || !Object.values(Gender).includes(user.gender)) {
    errors.push("Gender must be 'm', 'f', or 'o'.");
  }

  if (!user.role || !Object.values(Role).includes(user.role)) {
    errors.push('Invalid role.');
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
}

/**
 * Validate the body of user login
 *
 */
export function validateUserLogin(user: Pick<User, 'email' | 'password'>) {
  const errors: string[] = [];

  const allowedKeys = Object.keys(
    {} as Pick<User, 'email' | 'password'>,
  ) as (keyof Pick<User, 'email' | 'password'>)[];

  // Validate extra properties
  errors.push(...validateProperties(user, allowedKeys));

  if (!user.email || !EMAIL_REGEX.test(user.email)) {
    errors.push('Invalid email format.');
  }

  if (!user.password) {
    errors.push('Password is required');
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
}

/**
 * Validate user update
 *
 */
export function validateUserUpdate(user: UpdateUser) {
  const errors: string[] = [];

  const allowedKeys = Object.keys({} as UpdateUser) as (keyof UpdateUser)[];

  // Validate extra properties
  errors.push(...validateProperties(user, allowedKeys));

  if (
    user.email ||
    user.role ||
    user.createdAt ||
    user.updatedAt ||
    user.tokenExpiry
  ) {
    errors.push('Invalid payload');
  }

  if (user.firstName && user.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters long.');
  }

  if (user.lastName && user.lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters long.');
  }

  if (user.email && !EMAIL_REGEX.test(user.email)) {
    errors.push('Invalid email format.');
  }

  if (user.password && !PASSWORD_REGEX.test(user.password)) {
    errors.push(
      'Password must be greater than length 6 and must container one uppercase letter.',
    );
  }

  if (user.phone && !user.phone.trim()) {
    errors.push('Phone number is empty.');
  }

  if (user.dob && !user.dob.trim()) {
    errors.push('Date of birth is empty.');
  }

  if (user.address && !user.address.trim()) {
    errors.push('Address is empty.');
  }

  if (user.gender && !Object.values(Gender).includes(user.gender)) {
    errors.push("Gender must be 'm', 'f', or 'o'.");
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
}
