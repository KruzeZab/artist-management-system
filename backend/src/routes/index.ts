import { RouteHandler } from '../interfaces/server';

import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/user.controller';
import ArtistController from '../controllers/artist.controller';

import { DELETE, GET, PATCH, POST } from '../constants/methods';
import SongController from '../controllers/song.controller';

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
      UserController.getAllUsers(req, res);
    }
  },
  'users/:id': (req, res) => {
    if (req.method === GET) {
      UserController.getUser(req, res);
    } else if (req.method === PATCH) {
      UserController.updateUser(req, res);
    } else if (req.method === DELETE) {
      UserController.deleteUser(req, res);
    }
  },
  'artists/create': (req, res) => {
    if (req.method === POST) {
      ArtistController.registerArtist(req, res);
    }
  },
  artists: (req, res) => {
    if (req.method === GET) {
      ArtistController.getAllArtists(req, res);
    }
  },
  'artists/:id': (req, res) => {
    if (req.method === GET) {
      ArtistController.getArtist(req, res);
    } else if (req.method === PATCH) {
      ArtistController.updateArtist(req, res);
    } else if (req.method === DELETE) {
      ArtistController.deleteArtist(req, res);
    }
  },

  'artists/:artistId/songs/create': (req, res) => {
    if (req.method === POST) {
      SongController.registerSong(req, res);
    }
  },
  'artists/:artistId/songs': (req, res) => {
    if (req.method === GET) {
      SongController.getAllSongs(req, res);
    }
  },
  'artists/:artistId/songs/:songId': (req, res) => {
    if (req.method === GET) {
      SongController.getSong(req, res);
    } else if (req.method === PATCH) {
      SongController.updateSong(req, res);
    } else if (req.method === DELETE) {
      SongController.deleteSong(req, res);
    }
  },

  notFound: (_, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route Not Found' }));
  },
};

export default routes;
