import { EnvConfig } from './env-config.interface';

const BaseConfig: EnvConfig = {
  // API url
  API: 'http://localhost:9001',

  AUTH_CLIENT_ID: 'T9IPDYb4JkFXkwWLeQDy56nVI9K0wH6H',
  AUTH_DOMAIN: 'jeitin.auth0.com',
  AUTH_CALLBACK_URL: 'http://localhost:3000/callback',
  AUTH_API_ID: 'https://jeitin.auth0.com/api/v2/'
};

export = BaseConfig;

