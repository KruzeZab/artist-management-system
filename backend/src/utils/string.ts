import { ParsedUrlQuery } from 'querystring';

/**
 * Parses query parameters from an object,
 * ensuring no undefined values.
 *
 */
export function parseQueryParams(query: ParsedUrlQuery) {
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [key, value ?? '']),
  );
}
