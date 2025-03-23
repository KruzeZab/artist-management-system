/**
 * Convert camel case to snake case
 *
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Convert snake case to camel case
 *
 */
export function snakeToCamel<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel) as T;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const camelObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/(_\w)/g, (match) => match[1].toUpperCase());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      camelObj[camelKey] = snakeToCamel((obj as { [key: string]: any })[key]);
    }
  }
  return camelObj as T; // Type assertion for return value
}
