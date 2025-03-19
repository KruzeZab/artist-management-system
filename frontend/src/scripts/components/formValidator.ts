import {
  EMAIL_REGEX,
  MINIMUM_FIRST_NAME_LENGTH,
  PASSWORD_REGEX,
} from '../../constants/validator';

export function validateEmail(email: string) {
  return EMAIL_REGEX.test(email.toLowerCase());
}

export function validatePassword(password: string) {
  return PASSWORD_REGEX.test(password);
}

export function validateName(name: string) {
  return name.trim().length >= MINIMUM_FIRST_NAME_LENGTH;
}

export function validatePhone(phone: string) {
  return phone.trim();
}

export function validateDob(dob: string) {
  return dob;
}

export function validateGender(gender: string) {
  return gender;
}

export function validateAddress(address: string) {
  return address.trim().length;
}

export function validateRole(role: string) {
  return role.trim().length;
}
