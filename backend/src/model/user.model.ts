import { pool } from '../config/dbConfig';
import { UpdateUser, User } from '../interfaces/user';
import { camelToSnake } from '../utils/common';

class UserModel {
  /**
   * Create a new user
   *
   */
  static async createUser(user: User) {
    const query = `
      INSERT INTO "user" (first_name, last_name, email, password, phone, dob, gender, address, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
    `;

    const values = Object.values(user);

    try {
      const result = await pool.query(query, values);

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
      SELECT id, first_name, last_name, email, password, phone, dob, gender, address, role, created_at, updated_at
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
        return result.rows[0];
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
  static async getAllUsers() {
    const query = `
      SELECT id, first_name, last_name, email, phone, dob, gender, address, role, created_at, updated_at
      FROM "user";
    `;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error) {
      console.error('Error retrieving all users:', error);

      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Partially update user details
   *
   */
  static async updateUser(userId: number, updates: UpdateUser) {
    let fields = Object.keys(updates);

    if (fields.length === 0) {
      throw new Error('No fields provided for update');
    }

    fields = fields.map(camelToSnake);

    // Add updated_at field
    fields.push('updated_at');

    const values = [...Object.values(updates), new Date(), userId];

    const setClause = fields
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');

    const query = `
      UPDATE "user"
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING id;
    `;

    try {
      const result = await pool.query(query, values);

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
}

export default UserModel;
