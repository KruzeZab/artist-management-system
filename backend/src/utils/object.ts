/**
 * Check for extra properties in an object
 *
 */
export function validateProperties<T extends object>(
  obj: T,
  validKeys: (keyof T)[],
) {
  const errors: string[] = [];

  // Check for unexpected properties
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (validKeys.includes(key)) {
      errors.push(`Unexpected property: ${String(key)}`);
    }
  }

  return errors;
}
