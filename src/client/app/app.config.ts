
export const APP_CONFIG: IAppConfig = JSON.parse('<%= ENV_CONFIG %>');

interface IAppConfig {
  AUTH_CLIENT_ID: string;
  AUTH_DOMAIN: string;
  AUTH_CALLBACK_URL: string;
  AUTH_API_URL: string;
}
