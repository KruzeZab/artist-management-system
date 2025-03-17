import { pool } from '../config/dbConfig';
import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../constants/pagiantion';
import { Song, UpdateSong } from '../interfaces/song';

import { camelToSnake } from '../utils/common';

class SongModel {
  /**
   * Create a new song
   *
   */
  static async createSong(song: Song) {
    const query = `
        INSERT INTO "music" (artist_id, title, album_name, genre)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
`;

    const values = [song.artistId, song.title, song.albumName, song.genre];

    try {
      const result = await pool.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Error creating song:', error);

      throw new Error('Song creation failed');
    }
  }

  /**
   * Find the given song by ID
   *
   */
  static async findSongById(songId: number) {
    const query = `
      SELECT id, artist_id, title, album_name, genre
      FROM "music"
      WHERE id = $1;
    `;

    try {
      const result = await pool.query(query, [songId]);

      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (error) {
      console.error('Error finding song by ID:', error);

      throw new Error('Song retrieval failed');
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
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, artist_id, title, album_name, genre
      FROM "music"
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2;
    `;

    const countQuery = `SELECT COUNT(*) FROM "music";`;

    try {
      const [result, countResult] = await Promise.all([
        pool.query(query, [limit, offset]),
        pool.query(countQuery),
      ]);

      return {
        data: result.rows,
        totalRecords: parseInt(countResult.rows[0].count, 10),
      };
    } catch (error) {
      console.error('Error retrieving songs:', error);

      throw new Error('Failed to fetch songs');
    }
  }

  /**
   * Partially update song's details
   *
   */
  static async updateSong(songId: number, updates: UpdateSong) {
    let fields = Object.keys(updates);

    if (fields.length === 0) {
      throw new Error('No fields provided for update');
    }

    // Convert camelCase keys to snake_case for PostgreSQL
    fields = fields.map(camelToSnake);

    // Add updated_at field to be updated
    fields.push('updated_at');

    const values = [...Object.values(updates), new Date(), songId];

    const setClause = fields
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');

    const query = `
      UPDATE "music"
      SET ${setClause}
      WHERE id = $${values.length}
      RETURNING id;
    `;

    try {
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Song not found or update failed');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating song:', error);
      throw new Error('Song update failed');
    }
  }

  /**
   * Delete an song
   *
   */
  static async deleteSong(songID: number) {
    const query = `
      DELETE FROM "music"
      WHERE id = $1
      RETURNING id;
    `;

    try {
      const result = await pool.query(query, [songID]);

      if (result.rows.length === 0) {
        throw new Error('Song not found or deletion failed');
      }

      return result.rows[0].id;
    } catch (error) {
      console.error('Error deleting song:', error);
      throw new Error('Song deletion failed');
    }
  }
}

export default SongModel;
