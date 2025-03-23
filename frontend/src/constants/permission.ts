import { Role } from '../interface/user';

export const ELEMENT_ROLE_MAPPING = [
  { elementSelector: '.hide-am', roles: [Role.ARTIST_MANAGER] },
  { elementSelector: '.hide-ar', roles: [Role.ARTIST] },
  { elementSelector: '.hide-sa', roles: [Role.SUPER_ADMIN] },
];
