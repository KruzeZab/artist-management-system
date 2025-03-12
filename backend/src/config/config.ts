import { config } from 'dotenv';

const pathToEnv = __dirname + '/../.env';

config({ path: pathToEnv });

const serverConfig = {
  serverPort: Number(process.env.SERVER_PORT) || 8000,
  host: process.env.SERVER_HOST || '127.0.0.1',
};

export default serverConfig;
