import { RouteHandler } from '../interfaces/server';

import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/user.controller';
import ArtistController from '../controllers/artist.controller';

import { DELETE, GET, PATCH, POST } from '../constants/methods';
import SongController from '../controllers/song.controller';
import { checkUserPermission } from '../utils/permission';
import { Role } from '../interfaces/user';

const routes: Record<string, RouteHandler> = {
  'users/register': (req, res) => {
    if (req.method === POST) {
      AuthController.registerUser(req, res);
    }
  },
  'users/login': (req, res) => {
    if (req.method === POST) {
      AuthController.loginUser(req, res);
    }
  },
  users: (req, res) => {
    if (req.method === GET) {
      checkUserPermission(res, req.user.role, [Role.SUPER_ADMIN], () =>
        UserController.getAllUsers(req, res),
      );
    }
  },
  'users/logout': (req, res) => {
    if (req.method === POST) {
      AuthController.logoutUser(req, res);
    }
  },
  'users/:id': (req, res) => {
    if (req.method === GET) {
      checkUserPermission(res, req.user.role, [Role.SUPER_ADMIN], () =>
        UserController.getUser(req, res),
      );
    } else if (req.method === PATCH) {
      checkUserPermission(res, req.user.role, [Role.SUPER_ADMIN], () =>
        UserController.updateUser(req, res),
      );
    } else if (req.method === DELETE) {
      checkUserPermission(res, req.user.role, [Role.SUPER_ADMIN], () =>
        UserController.deleteUser(req, res),
      );
    }
  },
  'artists/create': (req, res) => {
    if (req.method === POST) {
      checkUserPermission(res, req.user.role, [Role.ARTIST_MANAGER], () =>
        ArtistController.registerArtist(req, res),
      );
    }
  },
  artists: (req, res) => {
    if (req.method === GET) {
      checkUserPermission(
        res,
        req.user.role,
        [Role.SUPER_ADMIN, Role.ARTIST_MANAGER],
        () => ArtistController.getAllArtists(req, res),
      );
    }
  },
  'artists/:id': (req, res) => {
    if (req.method === GET) {
      checkUserPermission(
        res,
        req.user.role,
        [Role.SUPER_ADMIN, Role.ARTIST_MANAGER],
        () => ArtistController.getArtist(req, res),
      );
    } else if (req.method === PATCH) {
      checkUserPermission(res, req.user.role, [Role.ARTIST_MANAGER], () =>
        ArtistController.updateArtist(req, res),
      );
    }
  },

  'artists/:artistId/songs/create': (req, res) => {
    if (req.method === POST) {
      checkUserPermission(res, req.user.role, [Role.ARTIST], () =>
        SongController.registerSong(req, res),
      );
    }
  },
  'artists/:artistId/songs/:songId': (req, res) => {
    if (req.method === GET) {
      checkUserPermission(
        res,
        req.user.role,
        [Role.SUPER_ADMIN, Role.ARTIST_MANAGER, Role.ARTIST],
        () => SongController.getSong(req, res),
      );
    } else if (req.method === PATCH) {
      checkUserPermission(res, req.user.role, [Role.ARTIST], () =>
        SongController.updateSong(req, res),
      );
    } else if (req.method === DELETE) {
      checkUserPermission(res, req.user.role, [Role.ARTIST], () =>
        SongController.deleteSong(req, res),
      );
    }
  },

  songs: (req, res) => {
    if (req.method === GET) {
      checkUserPermission(
        res,
        req.user.role,
        [Role.SUPER_ADMIN, Role.ARTIST_MANAGER, Role.ARTIST],
        () => SongController.getAllSongs(req, res),
      );
    }
  },

  notFound: (_, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route Not Found' }));
  },
};

export default routes;
