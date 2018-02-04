import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  API: process.env.AUTH_API_ID,

};

export = ProdConfig;

