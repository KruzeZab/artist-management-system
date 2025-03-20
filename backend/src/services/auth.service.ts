import bcrypt from 'bcrypt';

import { User } from '../interfaces/user';
import { HttpStatus } from '../interfaces/server';

import UserModel from '../model/user.model';

import { sendApiResponse } from '../utils/server';

import {
  validateUserLogin,
  validateUserRegister,
} from '../validators/userValidator';

import config from '../config/config';
import UserService from './user.service';
import { calculateTokenExpiry, generateToken } from '../utils/token';

class AuthService {
  /**
   * Register a new user
   *
   */
  static async register(user: User) {
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
          success: true,
          response: {
            success: true,
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
      const result = await UserModel.createUser({
        ...user,
        password: hashedPassword,
      });

      const data = {
        userId: result.id,
      };

      return sendApiResponse({
        status: HttpStatus.CREATED,
        success: true,
        response: {
          success: true,
          message: 'User successfully registered',
          data,
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
          status: HttpStatus.UNAUTHORIZED,
          success: false,
          response: { success: false, message: 'Invalid email or password' },
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return sendApiResponse({
          status: HttpStatus.UNAUTHORIZED,
          success: false,
          response: { success: false, message: 'Invalid email or password' },
        });
      }

      const token = generateToken();

      const tokenExpiry = calculateTokenExpiry(4);

      const userPayload = {
        token,
        tokenExpiry,
      };

      const { response } = await UserService.updateUser(user.id, userPayload);

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: {
          success: true,
          message: 'Login successful',
          data: {
            user: response.data,
          },
        },
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
}

export default AuthService;
