import { pool } from '../config/dbConfig';
import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../constants/pagiantion';
import { Artist, UpdateArtist } from '../interfaces/artist';

import { camelToSnake } from '../utils/common';

class ArtistModel {
  /**
   * Create a new artist
   *
   */
  static async createArtist(artist: Artist) {
    const query = `
        INSERT INTO "artist" (name, dob, gender, address, first_release_year, no_of_albums_released)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
`;

    const values = [
      artist.name,
      artist.dob,
      artist.gender,
      artist.address,
      artist.firstReleaseYear,
      artist.noOfAlbumsReleased,
    ];

    try {
      const result = await pool.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Error creating artist:', error);

      throw new Error('Artist creation failed');
    }
  }

  /**
   * Find the given artist by ID
   *
   */
  static async findArtistById(artistId: number) {
    const query = `
      SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released
      FROM "artist"
      WHERE id = $1;
    `;

    try {
      const result = await pool.query(query, [artistId]);

      if (result.rows.length > 0) {
        const artist = result.rows[0];

        return {
          ...artist,
          dob: artist.dob ? new Date(artist.dob).toLocaleDateString() : null,
          created_at: artist.created_at
            ? new Date(artist.created_at).toLocaleDateString()
            : null,
          updated_at: artist.updated_at
            ? new Date(artist.updated_at).toLocaleDateString()
            : null,
        };
      }
    } catch (error) {
      console.error('Error finding artist by ID:', error);

      throw new Error('Artist retrieval failed');
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
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released
      FROM "artist"
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2;
    `;

    const countQuery = `SELECT COUNT(*) FROM "artist";`;

    try {
      const [result, countResult] = await Promise.all([
        pool.query(query, [limit, offset]),
        pool.query(countQuery),
      ]);

      const formattedResult = result.rows.map((row) => ({
        ...row,
        dob: row.dob ? new Date(row.dob).toLocaleDateString() : null,
        created_at: row.created_at
          ? new Date(row.created_at).toLocaleDateString()
          : null,
        updated_at: row.updated_at
          ? new Date(row.updated_at).toLocaleDateString()
          : null,
      }));

      return {
        data: formattedResult,
        totalRecords: parseInt(countResult.rows[0].count, 10),
      };
    } catch (error) {
      console.error('Error retrieving artists:', error);

      throw new Error('Failed to fetch artists');
    }
  }

  /**
   * Partially update artist's details
   *
   */
  static async updateArtist(artistId: number, updates: UpdateArtist) {
    let fields = Object.keys(updates);

    if (fields.length === 0) {
      throw new Error('No fields provided for update');
    }

    // Convert camelCase keys to snake_case for PostgreSQL
    fields = fields.map(camelToSnake);

    // Add updated_at field to be updated
    fields.push('updated_at');

    const values = [...Object.values(updates), new Date(), artistId];

    const setClause = fields
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');

    const query = `
      UPDATE "artist"
      SET ${setClause}
      WHERE id = $${values.length}
      RETURNING id;
    `;

    try {
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Artist not found or update failed');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating artist:', error);
      throw new Error('Artist update failed');
    }
  }

  /**
   * Delete an artist
   *
   */
  static async deleteArtist(artistID: number) {
    const query = `
      DELETE FROM "artist"
      WHERE id = $1
      RETURNING id;
    `;

    try {
      const result = await pool.query(query, [artistID]);

      if (result.rows.length === 0) {
        throw new Error('Artist not found or deletion failed');
      }

      return result.rows[0].id;
    } catch (error) {
      console.error('Error deleting artist:', error);
      throw new Error('Artist deletion failed');
    }
  }
}

export default ArtistModel;
