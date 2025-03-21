import { ServerResponse } from 'http';

import { User } from '../interfaces/user';
import { HttpStatus, RequestData } from '../interfaces/server';

import { sendResponseToClient } from '../utils/server';

import AuthService from '../services/auth.service';

class AuthController {
  /**
   * Register new user
   *
   */
  static async registerUser(req: RequestData, res: ServerResponse) {
    try {
      const user: User = req.body;

      const data = await AuthService.register(user);

      sendResponseToClient(res, data.status, data.response);
    } catch (error) {
      console.error('Error handling request:', error);

      sendResponseToClient(res, HttpStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        error: 'Internal Server Error',
      });
    }
  }

  /**
   * Login a user
   *
   */
  static async loginUser(req: RequestData, res: ServerResponse) {
    try {
      const { email, password } = req.body;

      const data = await AuthService.login(email, password);

      return sendResponseToClient(res, data.status, data.response);
    } catch (error) {
      console.error('Error handling login request:', error);

      return sendResponseToClient(res, HttpStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Logout a user
   *
   */
  static async logoutUser(req: RequestData, res: ServerResponse) {
    try {
      const userId = req.user.id;

      const data = await AuthService.logout(userId);

      return sendResponseToClient(res, data.status, data.response);
    } catch (error) {
      console.error('Error handling logout request:', error);

      return sendResponseToClient(res, HttpStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

export default AuthController;
