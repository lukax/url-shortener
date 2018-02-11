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
    AUTH_API_ID: string;
  };

  storage: {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_S3_BUCKET: string;
  };
}

const appConfig: IAppConfig = ({
  database: {
    type: process.env.DB_TYPE,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    logging: ["query", "error"],
  },
  host: {
    port: process.env.PORT
  },
  app: {
    title: process.env.APP_TITLE
  },
  auth: {
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    AUTH_CALLBACK_URL: process.env.AUTH_CALLBACK_URL,
    AUTH_API_ID: process.env.AUTH_API_ID
  },
  storage: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  },
});

export { appConfig };
