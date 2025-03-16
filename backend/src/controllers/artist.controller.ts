import { ServerResponse } from 'http';
import { HttpStatus, RequestData } from '../interfaces/server';

import { sendResponseToClient } from '../utils/server';
import ArtistService from '../services/artist.service';
import { Artist } from '../interfaces/artist';

class ArtistController {
  /**
   * Register new artist
   *
   */
  static async registerArtist(req: RequestData, res: ServerResponse) {
    try {
      const artist: Artist = req.body;

      const data = await ArtistService.createArtist(artist);

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
   * Fetch all artists
   *
   */
  static async getAllArtists(req: RequestData, res: ServerResponse) {
    try {
      const page = parseInt(req.queryString.page as string, 10) || 1;
      const limit = parseInt(req.queryString.limit as string, 10) || 10;

      const { response } = await ArtistService.getAllArtists(page, limit);

      return sendResponseToClient(res, HttpStatus.OK, {
        success: true,
        response: {
          message: 'Artists fetched!',
          data: response.data,
          meta: response.meta,
        },
      });
    } catch (error) {
      console.error('Error fetching artists:', error);

      return sendResponseToClient(res, HttpStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        response: { error: 'Failed to fetch artists' },
      });
    }
  }

  /**
   * Get single artist
   *
   */
  static async getArtist(req: RequestData, res: ServerResponse) {
    try {
      const artistId = Number(req.routeParams?.id);

      const data = await ArtistService.getArtist(artistId);

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
   * Delete artist
   *
   */
  static async deleteArtist(req: RequestData, res: ServerResponse) {
    try {
      const artistId = Number(req.routeParams?.id);

      const data = await ArtistService.deleteArtist(artistId);

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
   * Update the given artist by id
   *
   */
  static async updateArtist(req: RequestData, res: ServerResponse) {
    try {
      const artistId = Number(req.routeParams?.id);

      const artistBody = req.body;

      const data = await ArtistService.updateArtist(artistId, artistBody);

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

export default ArtistController;
