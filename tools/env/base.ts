import { EnvConfig } from './env-config.interface';
import dotenv = require('dotenv');
const dotenvConfig = dotenv.config();
if (dotenvConfig.error) { throw dotenvConfig.error; }

const BaseConfig: EnvConfig = {
  // API url
  API: process.env.AUTH_API_ID,

  AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
  AUTH_DOMAIN: process.env.AUTH_DOMAIN,
  AUTH_CALLBACK_URL: process.env.AUTH_CALLBACK_URL,
  AUTH_API_ID: process.env.AUTH_API_ID,
};

export = BaseConfig;

