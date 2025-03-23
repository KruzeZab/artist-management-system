import { PoolClient } from 'pg';
import { pool } from '../config/dbConfig';
import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../constants/pagiantion';
import { UpdateUser, User } from '../interfaces/user';
import { camelToSnake } from '../utils/common';

class UserModel {
  /**
   * Create a new user
   *
   */
  static async createUser(user: User, client?: PoolClient) {
    const pgClient = client ?? pool;

    const query = `
        INSERT INTO "user" (first_name, last_name, email, password, phone, dob, gender, address, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
`;

    const values = [
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.phone,
      user.dob,
      user.gender,
      user.address,
      user.role,
    ];

    try {
      const result = await pgClient.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);

      throw new Error('User creation failed');
    }
  }

  /**
   * Find the given user by email
   *
   */
  static async findUserByEmail(email: string) {
    const query = `
      SELECT id, first_name, last_name, email, password, role
      FROM "user"
      WHERE email = $1;
    `;

    try {
      const result = await pool.query(query, [email]);

      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (error) {
      console.error('Error finding user by email:', error);

      throw new Error('User retrieval failed');
    }
  }

  /**
   * Finds the user by given token
   *
   */
  static async findUserByToken(token: string) {
    const query = `
      SELECT id, first_name, last_name, email, role, token, token_expiry
      FROM "user"
      WHERE token = $1;
    `;

    try {
      const result = await pool.query(query, [token]);

      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (error) {
      console.error('Error finding user by token:', error);

      throw new Error('User retrieval failed');
    }
  }

  /**
   * Find the given user by ID
   *
   */
  static async findUserById(userId: number) {
    const query = `
      SELECT id, first_name, last_name, email, phone, dob, gender, address, role, created_at, updated_at
      FROM "user"
      WHERE id = $1;
    `;

    try {
      const result = await pool.query(query, [userId]);

      if (result.rows.length > 0) {
        const user = result.rows[0];

        return {
          ...user,
          dob: user.dob ? new Date(user.dob).toLocaleDateString() : null,
          created_at: user.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : null,
          updated_at: user.updated_at
            ? new Date(user.updated_at).toLocaleDateString()
            : null,
        };
      }
    } catch (error) {
      console.error('Error finding user by ID:', error);

      throw new Error('User retrieval failed');
    }
  }

  /**
   * Get all users
   *
   */
  static async getAllUsers(
    page = DEFAULT_PAGE_START,
    limit = DEFAULT_PAGE_LIMIT,
  ) {
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, first_name, last_name, email, phone, dob, gender, address, role, created_at, updated_at
      FROM "user"
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2;
    `;

    const countQuery = `SELECT COUNT(*) FROM "user";`;

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
      console.error('Error retrieving users:', error);

      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Partially update user details
   *
   */
  static async updateUser(
    userId: number,
    updates: UpdateUser,
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

    const values = [...Object.values(updates), new Date(), userId];

    const setClause = fields
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');

    const query = `
      UPDATE "user"
      SET ${setClause}
      WHERE id = $${values.length}
      RETURNING id, token, email, first_name, last_name, role, token_expiry;
    `;

    try {
      const result = await pgClient.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('User not found or update failed');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('User update failed');
    }
  }

  /**
   * Delete a user
   *
   */
  static async deleteUser(userId: number) {
    const query = `
      DELETE FROM "user"
      WHERE id = $1
      RETURNING id;
    `;

    try {
      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
        throw new Error('User not found or deletion failed');
      }

      return result.rows[0].id;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('User deletion failed');
    }
  }

  /**
   * Updates the user token
   *
   */
  static async updateToken(userId: number, token: string, tokenExpiry: Date) {
    const query = `
      UPDATE "user"
      SET token = $1, token_expiry = $2
      WHERE id = $3
      RETURNING id, token, email, first_name, last_name, role;
    `;

    const values = [token, tokenExpiry, userId];

    try {
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('User not found or token update failed');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating user token:', error);

      throw new Error('User token update failed');
    }
  }
}

export default UserModel;
