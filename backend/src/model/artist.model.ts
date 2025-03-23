import { PoolClient } from 'pg';

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
  static async createArtist(artist: Artist, client?: PoolClient) {
    const pgClient = client ?? pool;

    const query = `
        INSERT INTO "artist" (first_release_year, no_of_albums_released, user_id)
        VALUES ($1, $2, $3)
        RETURNING id;
`;

    const values = [
      artist.firstReleaseYear,
      artist.noOfAlbumsReleased,
      artist.userId,
    ];

    try {
      const result = await pgClient.query(query, values);

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
      SELECT
        a.*,
        u.*
      FROM artist a
      JOIN "user" u ON a.user_id = u.id
      WHERE a.id = $1;
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
    SELECT
      a.id,
      a.first_release_year,
      a.no_of_albums_released,
      u.first_name,
      u.last_name,
      u.dob,
      u.gender,
      u.address
    FROM artist a
    JOIN "user" u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT $1 OFFSET $2;
  `;

    const countQuery = `
    SELECT COUNT(*)
    FROM artist a
    JOIN "user" u ON a.user_id = u.id;
  `;

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
  static async updateArtist(
    artistId: number,
    updates: Partial<UpdateArtist>,
    client?: PoolClient,
  ) {
    const pgClient = client ?? pool;

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
      const result = await pgClient.query(query, values);

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
   * Find artist by user id
   *
   */
  static async findArtistByUserId(userId: number) {
    const query = `
      SELECT
      id AS artist_id
      FROM artist
      WHERE user_id = $1;
    `;

    try {
      const result = await pool.query(query, [userId]);

      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (error) {
      console.error('Error finding artist by ID:', error);

      throw new Error('Artist retrieval failed');
    }
  }
}

export default ArtistModel;
