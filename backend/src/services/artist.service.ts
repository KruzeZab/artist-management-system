import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../constants/pagiantion';

import {
  validateUserRegister,
  validateUserUpdate,
} from '../validators/userValidator';
import { validateArtistRegister } from '../validators/artistValidator';

import { HttpStatus } from '../interfaces/server';
import { Artist, UpdateArtist } from '../interfaces/artist';

import UserModel from '../model/user.model';
import ArtistModel from '../model/artist.model';

import { buildMeta } from '../utils/pagination';
import { withTransaction } from '../utils/model';
import { sendApiResponse } from '../utils/server';

import { Role } from '../interfaces/user';

import AuthService from './auth.service';

class ArtistService {
  /**
   * Create a new artist
   *
   */
  static async createArtist(artist: Artist) {
    try {
      const userValidation = validateUserRegister(artist);

      const artistValidation = validateArtistRegister(artist);

      if (!artistValidation.success || !userValidation.success) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: {
            success: false,
            error: artistValidation.errors || userValidation.errors,
          },
        });
      }

      const result = await withTransaction(async (client) => {
        const artistPayload = {
          ...artist,
          role: Role.ARTIST,
        };

        const response = await AuthService.register(artistPayload, client);

        if (!response.success) {
          return sendApiResponse({
            status: response.status,
            success: response.success,
            response: {
              success: response.response.success,
              message: response.response.message,
            },
          });
        }

        const artistDetails = {
          ...artist,
          userId: response.response.data as number,
        };

        const createdArtist = await ArtistModel.createArtist(
          artistDetails,
          client,
        );

        if (createdArtist) {
          return sendApiResponse({
            status: HttpStatus.CREATED,
            success: true,
            response: {
              success: true,
              message: 'Artist successfully created',
              data: {
                artistId: createdArtist.id,
              },
            },
          });
        }

        throw new Error('Something went wrong');
      });

      return sendApiResponse({
        status: result.status,
        success: result.success,
        response: result.response,
      });
    } catch (error) {
      console.error('Error creating artist:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { success: false, message: 'Unable to create artist' },
      });
    }
  }

  /**
   * Get all artists
   *
   */

  static async getAllArtists(
    page = DEFAULT_PAGE_START,
    limit = DEFAULT_PAGE_LIMIT,
  ) {
    try {
      const { data, totalRecords } = await ArtistModel.getAllArtists(
        page,
        limit,
      );
      const totalPages = Math.ceil(totalRecords / limit);

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: {
          success: true,
          message: 'Artists fetched successfully!',
          data,
          meta: buildMeta(page, limit, totalRecords, totalPages),
        },
      });
    } catch (error) {
      console.error('Error fetching artists:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { success: false, message: 'Failed to fetch artists' },
      });
    }
  }

  /**
   * Get a single artist
   *
   */
  static async getArtist(artistId: number) {
    try {
      if (!artistId) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'Artis id not present.' },
        });
      }

      const data = await ArtistModel.findArtistById(artistId);

      if (!data) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'Artist not found' },
        });
      }

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: { success: true, data, message: 'Artist fetched!' },
      });
    } catch (error) {
      console.error('Error fetching artists:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { success: false, message: 'Unable to update artist' },
      });
    }
  }

  /**
   * Find the artist given by id
   *
   */
  static async findArtistById(artistId: number) {
    const artist = await ArtistModel.findArtistById(artistId);

    return artist;
  }

  static async updateArtist(artistId: number, artist: UpdateArtist) {
    try {
      const userValidation = validateUserUpdate(artist);
      const artistValidation = validateArtistRegister(artist);

      if (!artistValidation.success || !userValidation.success) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: {
            success: false,
            message: 'Failed to update',
            error: userValidation.errors || artistValidation.errors,
          },
        });
      }

      // check if artist exists
      const existingArtist = await this.findArtistById(artistId);

      if (!existingArtist) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'Artist not found' },
        });
      }

      const data = await withTransaction(async (client) => {
        const { firstReleaseYear, noOfAlbumsReleased, ...user } = artist;

        const artistPayload = {
          firstReleaseYear,
          noOfAlbumsReleased,
        };

        await ArtistModel.updateArtist(artistId, artistPayload, client);

        const updatedUser = await UserModel.updateUser(
          existingArtist.user_id,
          user,
        );

        return updatedUser;
      });

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: { success: true, data },
      });
    } catch (error) {
      console.error('Error fetching artist:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { success: false, message: 'Unable to update artist' },
      });
    }
  }

  /**
   * Find artist by user id
   *
   */
  static async findArtistByUserId(userId: number) {
    const artist = await ArtistModel.findArtistByUserId(userId);

    return artist;
  }
}

export default ArtistService;
