import dotenv = require('dotenv');

const dotenvConfig = dotenv.config();
if (dotenvConfig.error) { throw dotenvConfig.error; }

export interface IAppConfig {
  database: any;
  host: any;
  app: any;

  auth: {
    AUTH0_CLIENT_ID: string;
    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_SECRET: string;
    AUTH0_CALLBACK_URL: string;
    AUTH0_AUDIENCE: string;
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
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || `http://localhost:${process.env.PORT}/callback`,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE
  }
};

export { appConfig }
