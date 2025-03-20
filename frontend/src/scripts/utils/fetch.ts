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

  const localAuth = getItem(AUTH);

  const authToken = localAuth ? JSON.parse(localAuth)?.token : null;

  if (authenticate && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options: RequestInit = { method, headers };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    const data: T = await response.json();

    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}
