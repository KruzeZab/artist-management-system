import { buildUrl } from './url';

/**
 * Updates the URL to reflect the current page and limit.
 *
 */
export function updatePageUrl(page: number, limit: number) {
  const newUrl = buildUrl(window.location.origin + window.location.pathname, {
    page: page.toString(),
    limit: limit.toString(),
  });

  window.history.pushState({ page, limit }, '', newUrl);
}
