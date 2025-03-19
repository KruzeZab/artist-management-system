import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../constants/pagiantion';
import { HttpStatus } from '../interfaces/server';
import { UpdateUser } from '../interfaces/user';
import UserModel from '../model/user.model';
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
          response: { message: 'User not found' },
        });
      }

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: { data },
      });
    } catch (error) {
      console.error('Error fetching users:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { message: 'Unable to update user' },
      });
    }
  }

  /**
   * Delete a user
   *
   */
  static async deleteUser(userId: number) {
    try {
      const userExists = await UserModel.findUserById(userId);

      if (!userExists) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { message: 'User not found' },
        });
      }

      const data = await UserModel.deleteUser(userId);

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: { data },
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
          response: { error: validationResult.errors },
        });
      }

      // check if user exists
      const userExists = await this.findUserById(userId);

      if (!userExists) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { message: 'User not found' },
        });
      }

      // Check if email already exists
      if (user.email) {
        const emailExists = await this.findUserByEmail(user.email);

        if (emailExists) {
          return sendApiResponse({
            status: HttpStatus.BAD_REQUEST,
            success: false,
            response: { message: 'User with this email already exists.' },
          });
        }
      }

      const data = await UserModel.updateUser(userId, user);

      return sendApiResponse({
        status: HttpStatus.CREATED,
        success: true,
        response: { data },
      });
    } catch (error) {
      console.error('Error fetching users:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { message: 'Unable to update user' },
      });
    }
  }
}

export default UserService;
