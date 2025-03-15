import { RouteHandler } from '../interfaces/server';

import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/user.controller';

import { DELETE, GET, PATCH, POST } from '../constants/methods';

const routes: Record<string, RouteHandler> = {
  register: (req, res) => {
    if (req.method === POST) {
      AuthController.registerUser(req, res);
    }
  },
  login: (req, res) => {
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
    }
    if (req.method === PATCH) {
      UserController.updateUser(req, res);
    }
    if (req.method === DELETE) {
      UserController.deleteUser(req, res);
    }
  },

  notFound: (req, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route Not Found' }));
  },
};

export default routes;
