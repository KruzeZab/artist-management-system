import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../constants/pagiantion';

import { HttpStatus } from '../interfaces/server';
import { Song, UpdateSong } from '../interfaces/song';

import SongModel from '../model/song.model';

import { buildMeta } from '../utils/pagination';
import { sendApiResponse } from '../utils/server';

import {
  validateSongRegister,
  validateSongUpdate,
} from '../validators/songValidator';

class SongService {
  /**
   * Create a new song
   *
   */
  static async createSong(song: Song) {
    try {
      const validationResult = validateSongRegister(song);

      if (!validationResult.success) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { error: validationResult.errors },
        });
      }

      const result = await SongModel.createSong(song);

      const data = {
        songId: result.id,
      };

      return sendApiResponse({
        status: HttpStatus.CREATED,
        success: true,
        response: { message: 'Song successfully created', data },
      });
    } catch (error) {
      console.error('Error rcreating song:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { error: 'Unable to create song' },
      });
    }
  }

  /**
   * Get all songs
   *
   */

  static async getAllSongs(
    page = DEFAULT_PAGE_START,
    limit = DEFAULT_PAGE_LIMIT,
  ) {
    try {
      const { data, totalRecords } = await SongModel.getAllSongs(page, limit);
      const totalPages = Math.ceil(totalRecords / limit);

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: {
          message: 'Songs fetched successfully!',
          data,
          meta: buildMeta(page, limit, totalRecords, totalPages),
        },
      });
    } catch (error) {
      console.error('Error fetching songs:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { error: 'Failed to fetch songs' },
      });
    }
  }

  /**
   * Get a single song
   *
   */
  static async getSong(songId: number) {
    try {
      const data = await SongModel.findSongById(songId);

      if (!data) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { error: 'Song not found' },
        });
      }

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: { data },
      });
    } catch (error) {
      console.error('Error fetching songs:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { error: 'Unable to update song' },
      });
    }
  }

  /**
   * Delete an song
   *
   */
  static async deleteSong(songId: number) {
    try {
      const songExists = await SongModel.findSongById(songId);

      if (!songExists) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { error: 'Song not found' },
        });
      }

      const data = await SongModel.deleteSong(songId);

      return sendApiResponse({
        status: HttpStatus.OK,
        success: true,
        response: { data },
      });
    } catch (error) {
      console.error('Error deleting song:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { error: 'Unable to delete song' },
      });
    }
  }

  /**
   * Find the song given by id
   *
   */
  static async findSongById(songId: number) {
    const song = await SongModel.findSongById(songId);

    return song;
  }

  static async updateSong(songId: number, song: UpdateSong) {
    try {
      const validationResult = validateSongUpdate(song);

      if (!validationResult.success) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { error: validationResult.errors },
        });
      }

      // check if song exists
      const songExists = await this.findSongById(songId);

      if (!songExists) {
        return sendApiResponse({
          status: HttpStatus.BAD_REQUEST,
          success: false,
          response: { error: 'Song not found' },
        });
      }

      const data = await SongModel.updateSong(songId, song);

      return sendApiResponse({
        status: HttpStatus.CREATED,
        success: true,
        response: { data },
      });
    } catch (error) {
      console.error('Error fetching song:', error);

      return sendApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        response: { error: 'Unable to update song' },
      });
    }
  }
}

export default SongService;
