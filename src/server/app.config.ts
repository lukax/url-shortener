import dotenv = require('dotenv');

const dotenvConfig = dotenv.config();
if (dotenvConfig.error) { throw dotenvConfig.error; }

export interface IAppConfig {
  database: any;
  host: any;
  app: any;

  auth: {
    AUTH_CLIENT_ID: string;
    AUTH_DOMAIN: string;
    AUTH_CLIENT_SECRET: string;
    AUTH_CALLBACK_URL: string;
    AUTH_AUDIENCE: string;
  };
}

const appConfig: IAppConfig = {
  database: {
    type: process.env.DB_TYPE,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  },
  host: {
    port: process.env.PORT
  },
  app: {
    title: process.env.APP_TITLE
  },
  auth: {
    AUTH_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || `http://localhost:${process.env.PORT}/callback`,
    AUTH_AUDIENCE: process.env.AUTH0_AUDIENCE
  }
};

export { appConfig };
