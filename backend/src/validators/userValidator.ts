import { Gender } from '../interfaces/common';
import { User, Role } from '../interfaces/user';

import { EMAIL_REGEX, PASSWORD_REGEX } from '../constants/validator';

/**
 * Validate the body of user registration
 *
 */
export function validateUserRegister(user: User) {
  const errors: string[] = [];

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

  if (!user.phone.trim()) {
    errors.push('Phone number is required.');
  }

  if (!user.dob.trim()) {
    errors.push('Date of birth is required.');
  }

  if (!user.address.trim()) {
    errors.push('Address is required.');
  }

  if (!user.gender || !Object.values(Gender).includes(user.gender)) {
    errors.push("Gender must be 'm', 'f', or 'o'.");
  }

  if (!Object.values(Role).includes(user.role)) {
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

  if (!user.email || !EMAIL_REGEX.test(user.email)) {
    errors.push('Invalid email format.');
  }

  if (!user.password) {
    errors.push('Password is required');
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
}
