import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  API: '',

  AUTH_CLIENT_ID: 'T9IPDYb4JkFXkwWLeQDy56nVI9K0wH6H',
  AUTH_DOMAIN: 'jeitin.auth0.com',
  AUTH_CALLBACK_URL: 'http://app.jeit.in/callback',
  AUTH_API_URL: 'http://app.jeit.in'
};

export = ProdConfig;

