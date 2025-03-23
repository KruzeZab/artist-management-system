export const protectedRoutes = [
  'users',
  'users/:id',
  'artists',
  'artists/create',
  'artists/:id',
  'artists/:artistId/songs/create',
  'artists/:artistId/songs',
  'artists/:artistId/songs/:songId',
  'users/logout',
  'songs',
];

export const publicRoutes = ['users/register', 'users/login'];

export const DYNAMIC_ROUTE_PARAM_REGEX = /:([^/]+)/g;
export const DYNAMIC_ROUTE_REPLACE_REGEX = '([^/]+)';
