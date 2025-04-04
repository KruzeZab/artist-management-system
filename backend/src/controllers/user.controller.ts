import { ServerResponse } from 'http';

import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../constants/pagiantion';

import { HttpStatus, RequestData } from '../interfaces/server';

import UserService from '../services/user.service';

import { sendResponseToClient } from '../utils/server';

class UserController {
  /**
   * Fetch all users
   *
   */
  static async getAllUsers(req: RequestData, res: ServerResponse) {
    try {
      const page =
        parseInt(req.queryString.page as string, 10) || DEFAULT_PAGE_START;
      const limit =
        parseInt(req.queryString.limit as string, 10) || DEFAULT_PAGE_LIMIT;

      const { response } = await UserService.getAllUsers(page, limit);

      return sendResponseToClient(res, HttpStatus.OK, {
        success: true,
        message: 'Users fetched!',
        data: response.data,
        meta: response.meta,
      });
    } catch (error) {
      console.error('Error fetching users:', error);

      return sendResponseToClient(res, HttpStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        message: 'Failed to fetch users',
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
      const currentUserId = req.user.id;

      const data = await UserService.deleteUser(userId, currentUserId);

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
