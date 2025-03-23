import { GET } from '../../constants/methods';
import { AUTH } from '../../constants/application';

import { getItem } from './localStorage';

export async function fetchAPI<T>(
  url: string,
  method: string = GET,
  body: unknown = null,
  authenticate = false,
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  let authToken;

  const localAuth = getItem(AUTH);

  if (localAuth) {
    authToken = localAuth !== 'undefined' ? JSON.parse(localAuth)?.token : null;
  }

  if (authenticate && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options: RequestInit = { method, headers };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  const data: T = await response.json();

  return data;
}
