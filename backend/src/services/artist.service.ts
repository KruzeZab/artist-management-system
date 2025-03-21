import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../constants/pagiantion';

import { HttpStatus } from '../interfaces/server';
import { Artist, UpdateArtist } from '../interfaces/artist';

import ArtistModel from '../model/artist.model';

import { buildMeta } from '../utils/pagination';
import { sendApiResponse } from '../utils/server';

import { validateArtistRegister } from '../validators/artistValidator';

class ArtistService {
  /**
   * Create a new artist
   *
   */
  static async createArtist(artist: Artist) {
    try {
      const validationResult = validateArtistRegister(artist);

      if (!validationResult.success) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, error: validationResult.errors },
        });
      }

      const result = await ArtistModel.createArtist(artist);

      const data = {
        artistId: result.id,
      };

      return sendApiResponse({
        status: HttpStatus.CREATED,
        success: true,
        response: {
          success: true,
          message: 'Artist successfully created',
          data,
        },
      });
    } catch (error) {
      console.error('Error rcreating artist:', error);

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
        response: { success: true, data },
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
   * Delete an artist
   *
   */
  static async deleteArtist(artistId: number) {
    try {
      const artistExists = await ArtistModel.findArtistById(artistId);

      if (!artistExists) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'Artist not found' },
        });
      }

      const data = await ArtistModel.deleteArtist(artistId);

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: { success: true, data },
      });
    } catch (error) {
      console.error('Error deleting artist:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { success: false, message: 'Unable to delete artist' },
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
      const validationResult = validateArtistRegister(artist);

      if (!validationResult.success) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, error: validationResult.errors },
        });
      }

      // check if artist exists
      const artistExists = await this.findArtistById(artistId);

      if (!artistExists) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { success: false, message: 'Artist not found' },
        });
      }

      const data = await ArtistModel.updateArtist(artistId, artist);

      return sendApiResponse({
        status: HttpStatus.CREATED,
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
}

export default ArtistService;
