import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import config from '../config/config';

dotenv.config();

const dbConfig = {
  user: config.database.user,
  host: config.database.host,
  password: config.database.password,
  port: config.database.port,
};

const dbName = config.database.dbName;

// Connect to PostgreSQL without specifying a database
const client = new Client({ ...dbConfig, database: 'postgres' });

async function setupDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();

    // Check if database exists
    const dbCheckResult = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    if (dbCheckResult.rowCount === 0) {
      console.log(`Database '${dbName}' does not exist. Creating...`);

      await client.query(`CREATE DATABASE ${dbName}`);

      console.log(`Database '${dbName}' created successfully!`);
    } else {
      console.log(`Database '${dbName}' already exists. Skipping creation.`);
    }

    await client.end();

    const dbClient = new Client({ ...dbConfig, database: dbName });
    await dbClient.connect();

    const basePath = process.cwd();
    const isDev = __dirname.includes('src');

    const schemaPath = path.join(
      basePath,
      isDev ? 'src' : 'build',
      'database',
      'init.sql',
    );
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await dbClient.query(schemaSQL);

    console.log('Tables created successfully.');

    await dbClient.end();
  } catch (error) {
    console.error('Error setting up database: ', error);
  }
}

// Run the setup
setupDatabase();
