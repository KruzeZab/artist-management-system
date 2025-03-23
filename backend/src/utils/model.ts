import { PoolClient } from 'pg';

import { pool } from '../config/dbConfig';

/**
 * Wraps the query in transaction
 *
 */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await callback(client);

    await client.query('COMMIT');

    client.release();

    return result;
  } catch (error) {
    await client.query('ROLLBACK');

    client.release();

    throw error;
  }
}
