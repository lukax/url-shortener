import { EnvConfig } from './env-config.interface';
import dotenv = require('dotenv');
const dotenvConfig = dotenv.config();
if (dotenvConfig.error) { throw dotenvConfig.error; }

const DevConfig: EnvConfig = {
  ENV: 'DEV',
  API: 'http://localhost:9001/api',

  AUTH_CALLBACK_URL: `http://localhost:${process.env.PORT}/callback`
};

export = DevConfig;

