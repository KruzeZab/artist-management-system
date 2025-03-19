/**
 * Build the url from given parameters
 *
 */
export function buildUrl(baseUrl: string, ...paths: string[]) {
  return [
    baseUrl.replace(/\/$/, ''),
    ...paths.map((p) => p.replace(/^\/|\/$/g, '')),
  ].join('/');
}

/**
 * Interpolate the string
 *
 */
export function interpolate(
  url: string,
  params: Record<string, string | number>,
): string {
  return url.replace(/:(\w+)/g, (_, key) => {
    if (key in params) {
      return encodeURIComponent(params[key]);
    }
    throw new Error(`Missing parameter: ${key}`);
  });
}
