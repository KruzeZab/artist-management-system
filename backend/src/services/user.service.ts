import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../constants/pagiantion';

import UserModel from '../model/user.model';

import { HttpStatus } from '../interfaces/server';
import { Role, UpdateUser } from '../interfaces/user';

import { buildMeta } from '../utils/pagination';
import { sendApiResponse } from '../utils/server';

import { validateUserUpdate } from '../validators/userValidator';

class UserService {
  /**
   * Get all users
   *
   */

  static async getAllUsers(
    page = DEFAULT_PAGE_START,
    limit = DEFAULT_PAGE_LIMIT,
  ) {
    try {
      const { data, totalRecords } = await UserModel.getAllUsers(page, limit);
      const totalPages = Math.ceil(totalRecords / limit);

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: {
          message: 'Users fetched successfully!',
          data,
          meta: buildMeta(page, limit, totalRecords, totalPages),
        },
      });
    } catch (error) {
      console.error('Error fetching users:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { message: 'Failed to fetch users' },
      });
    }
  }

  /**
   * Get a single user
   *
   */
  static async getUser(userId: number) {
    try {
      const data = await UserModel.findUserById(userId);

      if (!data) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'User not found' },
        });
      }

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: { success: true, data },
      });
    } catch (error) {
      console.error('Error fetching users:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { success: false, message: 'Unable to fetch user' },
      });
    }
  }

  /**
   * Delete a user
   *
   */
  static async deleteUser(userId: number, currentUserId: number) {
    try {
      if (userId === currentUserId) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'Cannot delete self' },
        });
      }

      const currentUser = await this.findUserById(currentUserId);

      const existingUser = await UserModel.findUserById(userId);

      if (!existingUser) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'User not found' },
        });
      }

      if (currentUser.role === Role.ARTIST) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'You are not authorized' },
        });
      }

      const data = await UserModel.deleteUser(userId);

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: { success: true, data },
      });
    } catch (error) {
      console.error('Error deleting user:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { message: 'Unable to delete user' },
      });
    }
  }

  /**
   * Find the user given by email
   *
   */
  static async findUserByEmail(email: string) {
    const user = await UserModel.findUserByEmail(email);

    return user;
  }

  /**
   * Find the user given by email
   *
   */
  static async findUserById(userId: number) {
    const user = await UserModel.findUserById(userId);

    return user;
  }

  static async updateUser(userId: number, user: UpdateUser) {
    try {
      const validationResult = validateUserUpdate(user);

      if (!validationResult.success) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, error: validationResult.errors },
        });
      }

      // check if user exists
      const userExists = await this.findUserById(userId);

      if (!userExists) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'User not found' },
        });
      }

      const data = await UserModel.updateUser(userId, user);

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: { success: true, data, message: 'User updated!' },
      });
    } catch (error) {
      console.error('Error fetching users:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { success: false, message: 'Unable to update user' },
      });
    }
  }

  /**
   * Finds the user by given token
   *
   */
  static async findUserByToken(token: string) {
    const user = await UserModel.findUserByToken(token);

    return user;
  }

  /**
   * Update the token of user
   *
   */
  static async updateToken(userId: number, token: string, tokenExpiry: Date) {
    try {
      const userExists = await this.findUserById(userId);

      if (!userExists) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { message: 'User not found' },
        });
      }

      const data = await UserModel.updateToken(userId, token, tokenExpiry);

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: {
          success: true,
          message: 'Successful!',
          ...data,
        },
      });
    } catch (error) {
      console.error('Error logging user out:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { success: false, message: 'Unable to logout' },
      });
    }
  }
}

export default UserService;
