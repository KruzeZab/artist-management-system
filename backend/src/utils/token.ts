import { randomBytes } from 'crypto';

/**
 * Generate a unique token for user
 *
 */
export function generateToken() {
  return randomBytes(32).toString('hex');
}

/**
 * Calculates token expiry for user
 *
 */
export function calculateTokenExpiry(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
