import bcrypt from 'bcrypt';
import { PoolClient } from 'pg';

import config from '../config/config';

import {
  validateUserLogin,
  validateUserRegister,
} from '../validators/userValidator';

import { Role, User } from '../interfaces/user';
import { HttpStatus } from '../interfaces/server';

import UserModel from '../model/user.model';

import { sendApiResponse } from '../utils/server';
import { calculateTokenExpiry, generateToken } from '../utils/token';

import { TOKEN_EXPIRY_HOUR } from '../constants/application';

import UserService from './user.service';
import ArtistService from './artist.service';

class AuthService {
  /**
   * Register a new user
   *
   */
  static async register(user: User, client?: PoolClient) {
    try {
      const validationResult = validateUserRegister(user);

      if (!validationResult.success) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, error: validationResult.errors },
        });
      }

      // Check if user already exists
      const existingUser = await UserService.findUserByEmail(user.email);

      if (existingUser) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: {
            success: false,
            message: 'User already exists with this email',
          },
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(
        user.password,
        config.saltRounds,
      );

      // Create user with hashed password
      const result = await UserModel.createUser(
        {
          ...user,
          password: hashedPassword,
        },
        client,
      );

      return sendApiResponse({
        status: HttpStatus.CREATED,
        success: true,
        response: {
          success: true,
          message: 'User successfully registered',
          data: result.id,
        },
      });
    } catch (error) {
      console.error('Error registering user:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { success: false, message: 'User registration failed' },
      });
    }
  }

  /**
   * Login the given user
   *
   */
  static async login(email: string, password: string) {
    try {
      const validationResult = validateUserLogin({ email, password });

      if (!validationResult.success) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, error: validationResult.errors },
        });
      }

      const user = await UserService.findUserByEmail(email);

      if (!user) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'Invalid email or password' },
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'Invalid email or password' },
        });
      }

      const token = generateToken();

      const tokenExpiry = calculateTokenExpiry(TOKEN_EXPIRY_HOUR);

      const data = await UserService.updateToken(user.id, token, tokenExpiry);

      let apiResponse = {
        role: data.response.role,
        firstName: data.response.first_name,
        lastName: data.response.last_name,
        id: data.response.id,
        email: data.response.email,
        token: data.response.token,
        tokeExpiry: data.response.tokenExpiry,
      };

      if (data.response.role === Role.ARTIST) {
        const artist = await ArtistService.findArtistByUserId(user.id);

        apiResponse = { ...apiResponse, ...artist };
      }

      return sendApiResponse({
        status: data.status,
        success: data.success,
        response: { success: true, data: apiResponse, message: 'Logged in!' },
      });
    } catch (error) {
      console.error('Error logging in user:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { message: 'Login failed', success: false },
      });
    }
  }

  /**
   * Logout user
   *
   */
  static async logout(userId: number) {
    try {
      const logoutPayload = { token: null, tokenExpiry: null };

      await UserModel.updateUser(userId, logoutPayload);

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: {
          success: true,
          message: 'Logout successful',
        },
      });
    } catch (error) {
      console.error('Error logging in user:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { success: false, message: 'Logout failed' },
      });
    }
  }
}

export default AuthService;
