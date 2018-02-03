// Feel free to extend this interface
// depending on your app specific config.
export interface EnvConfig {
  API?: string;
  ENV?: string;
  VERSION?: string;

  AUTH_CLIENT_ID?: string;
  AUTH_DOMAIN?: string;
  AUTH_CALLBACK_URL?: string;
  AUTH_API_URL?: string;
}
