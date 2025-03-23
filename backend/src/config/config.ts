import { config } from 'dotenv';

const pathToEnv = __dirname + '/../.env';

config({ path: pathToEnv });

const serverConfig = {
  serverPort: Number(process.env.SERVER_PORT) || 8000,
  host: process.env.SERVER_HOST || '127.0.0.1',
  environment: process.env.NODE_ENV || 'development',
  saltRounds: 10,
  database: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dbName: process.env.DB_NAME || 'music_db',
  },
};

export default serverConfig;
