/**
 * Build the url from given parameters
 *
 */
export function buildUrl(
  baseUrl: string,
  ...args: (string | Record<string, string>)[]
): string {
  let url = baseUrl.replace(/\/$/, '');

  const paths: string[] = [];
  const params: Record<string, string> = {};

  args.forEach((arg) => {
    if (typeof arg === 'string') {
      paths.push(arg.replace(/^\/|\/$/g, ''));
    } else if (typeof arg === 'object' && arg !== null) {
      Object.assign(params, arg);
    }
  });

  if (paths.length > 0) {
    url += '/' + paths.join('/');
  }

  if (Object.keys(params).length > 0) {
    const queryParams = Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');
    url += `?${queryParams}`;
  }

  return url;
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
