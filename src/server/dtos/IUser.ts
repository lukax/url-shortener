
export interface IUser {
  iss: string;
  sub: string;
  aud?: string[] | string;
  iat: number;
  exp: number;
  azp: string;
  scope?: string;
  email?: string;
  email_verified?: boolean;
}
