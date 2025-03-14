import { Pool } from 'pg';

import config from './config';

export const dbConfig = {
  user: config.database.user,
  host: config.database.host,
  password: config.database.password,
  port: config.database.port,
};

export const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.dbName,
  password: config.database.password,
  port: config.database.port,
});
