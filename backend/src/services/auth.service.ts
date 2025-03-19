import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
          response: { error: validationResult.errors },
        });
      }

      // Check if user already exists
      const existingUser = await UserService.findUserByEmail(user.email);

      if (existingUser) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { message: 'User already exists with this email' },
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
        response: { message: 'User successfully registered', data },
      });
    } catch (error) {
      console.error('Error registering user:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { message: 'User registration failed' },
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
          response: { error: validationResult.errors },
        });
      }

      const user = await UserService.findUserByEmail(email);

      if (!user) {
        return sendApiResponse({
          status: HttpStatus.UNAUTHORIZED,
          success: false,
          response: { message: 'Invalid email or password' },
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return sendApiResponse({
          status: HttpStatus.UNAUTHORIZED,
          success: false,
          response: { message: 'Invalid email or password' },
        });
      }

      const userPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = jwt.sign(userPayload, config.jwt.accessToken, {
        expiresIn: '2h',
      });

      const refreshToken = jwt.sign(userPayload, config.jwt.accessToken, {
        expiresIn: '24h',
      });

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: {
          message: 'Login successful',
          data: {
            accessToken,
            refreshToken,
          },
        },
      });
    } catch (error) {
      console.error('Error logging in user:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { message: 'Login failed' },
      });
    }
  }

  /**
   * Regenerate JWT Token
   *
   */
  static async regenerateToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = jwt.verify(token, config.jwt.refreshToken);

      delete payload.iat;
      delete payload.exp;

      const accessToken = jwt.sign(payload, config.jwt.accessToken, {
        expiresIn: '4h',
      });

      const refreshToken = jwt.sign(payload, config.jwt.refreshToken, {
        expiresIn: '24h',
      });

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error('Error generating token:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { message: 'Error generating token!' },
      });
    }
  }
}

export default AuthService;
