import {APP_CONFIG} from "../app.config";

interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  apiURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: APP_CONFIG.AUTH_CLIENT_ID,
  domain:  APP_CONFIG.AUTH_DOMAIN,
  callbackURL:  APP_CONFIG.AUTH_CALLBACK_URL,
  apiURL: APP_CONFIG.AUTH_API_URL
};

