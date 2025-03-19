import { GET } from '../../constants/methods';

export async function fetchAPI<T>(
  url: string,
  method: string = GET,
  body: unknown = null,
  authToken: string | null = null,
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
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
