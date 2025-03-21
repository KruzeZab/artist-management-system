import { buildUrl } from './url';

/**
 * Updates the URL to reflect the current page and limit.
 *
 */
export function updatePageUrl(params: Record<string, string>) {
  const newUrl = buildUrl(
    window.location.origin + window.location.pathname,
    params,
  );

  window.history.pushState(params, '', newUrl);
}
