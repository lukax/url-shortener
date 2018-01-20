interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  apiURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'T9IPDYb4JkFXkwWLeQDy56nVI9K0wH6H',
  domain: 'jeitin.auth0.com',
  callbackURL: 'http://localhost:3000/callback',
  apiURL: 'http://localhost:3000'
};
