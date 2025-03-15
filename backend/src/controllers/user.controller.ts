import { ServerResponse } from 'http';
import { HttpStatus, RequestData } from '../interfaces/server';

import UserService from '../services/user.service';
import { sendResponseToClient } from '../utils/server';

class UserController {
  /**
   * Fetch all users
   *
   */
  static async getAllUsers(_: RequestData, res: ServerResponse) {
    try {
      const data = await UserService.getAllUsers();

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
   * Get single user
   *
   */
  static async getUser(req: RequestData, res: ServerResponse) {
    try {
      const userId = Number(req.routeParams?.id);

      const data = await UserService.getUser(userId);

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
   * Delete user
   *
   */
  static async deleteUser(req: RequestData, res: ServerResponse) {
    try {
      const userId = Number(req.routeParams?.id);

      const data = await UserService.deleteUser(userId);

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
   * Update the given user by id
   *
   */
  static async updateUser(req: RequestData, res: ServerResponse) {
    try {
      const userId = Number(req.routeParams?.id);

      const userBody = req.body;

      const data = await UserService.updateUser(userId, userBody);

      sendResponseToClient(res, data.status, data.response);
    } catch (error) {
      console.error('Error handling request:', error);

      sendResponseToClient(res, HttpStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        error: 'Internal Server Error',
      });
    }
  }
}

export default UserController;
