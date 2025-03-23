import { ServerResponse } from 'http';

import { Song } from '../interfaces/song';
import { Role } from '../interfaces/user';
import { HttpStatus, RequestData } from '../interfaces/server';

import { sendResponseToClient } from '../utils/server';

import SongService from '../services/song.service';
import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../constants/pagiantion';

class SongController {
  /**
   * Register new song
   *
   */
  static async registerSong(req: RequestData, res: ServerResponse) {
    try {
      const song: Song = req.body;

      const data = await SongService.createSong(song);

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
   * Fetch all songs
   *
   */
  static async getAllSongs(req: RequestData, res: ServerResponse) {
    try {
      const role = req.user.role;

      const page =
        parseInt(req.queryString.page as string, 10) || DEFAULT_PAGE_START;
      const limit =
        parseInt(req.queryString.limit as string, 10) || DEFAULT_PAGE_LIMIT;

      let artistId: number | undefined;

      if (role !== Role.SUPER_ADMIN) {
        artistId = req.user.artistId;
      } else {
        const artistIdParam = req.queryString.artistId as string;
        artistId = artistIdParam ? parseInt(artistIdParam, 10) : undefined;
      }

      const { response } =
        artistId !== undefined
          ? await SongService.getAllSongs(page, limit, artistId)
          : await SongService.getAllSongs(page, limit);

      return sendResponseToClient(res, HttpStatus.OK, response);
    } catch (error) {
      console.error('Error fetching songs:', error);

      return sendResponseToClient(res, HttpStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        response: { message: 'Failed to fetch songs' },
      });
    }
  }

  /**
   * Get single song
   *
   */
  static async getSong(req: RequestData, res: ServerResponse) {
    try {
      const songId = Number(req.routeParams?.songId);

      const data = await SongService.getSong(songId);

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
   * Delete song
   *
   */
  static async deleteSong(req: RequestData, res: ServerResponse) {
    try {
      const songId = Number(req.routeParams?.id);

      const data = await SongService.deleteSong(songId);

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
   * Update the given song by id
   *
   */
  static async updateSong(req: RequestData, res: ServerResponse) {
    try {
      const songId = Number(req.routeParams?.songId);

      const songBody = req.body;

      const data = await SongService.updateSong(songId, songBody);

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

export default SongController;
