import { pool } from '../config/dbConfig';
import { User } from '../interfaces/user';

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
}

export default UserModel;
