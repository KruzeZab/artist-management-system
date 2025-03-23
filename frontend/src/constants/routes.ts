import { Role } from '../interface/user';

export const AUTHORIZED_ROUTES = {
  [Role.SUPER_ADMIN]: ['*'],

  [Role.ARTIST_MANAGER]: [
    '/src/pages/artist-list.html',
    '/src/pages/artist-detail.html',
    '/src/pages/artist-edit.html',
    '/src/pages/artist-create.html',
  ],

  [Role.ARTIST]: [
    '/src/pages/song-list.html',
    '/src/pages/song-create.html',
    '/src/pages/song-edit.html',
    '/src/pages/song-detail.html',
  ],
};

export const PUBLIC_ROUTES = [
  '/src/pages/register.html',
  '/src/pages/login.html',
  '/',
];
