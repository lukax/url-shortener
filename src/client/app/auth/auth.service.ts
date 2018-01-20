import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import { Router } from '@angular/router';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
declare var auth0: any;

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    audience: AUTH_CONFIG.apiURL,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: 'openid profile email'
  });
  private userProfileSubject: Subject<UserProfile> = new Subject<UserProfile>();

  constructor(public router: Router) {}

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err: any, authResult: any) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.router.navigate(['/']);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  private setSession(authResult: any): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return (new Date().getTime()) < expiresAt;
  }


  public getProfile(): Observable<UserProfile> {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      this.auth0.client.userInfo(accessToken, (err: any, profile: any) => {
        if (profile) {
          this.userProfileSubject.next(profile);
        }
      });
    }

    return this.userProfileSubject.asObservable();
  }

}

export interface UserProfile {
  name: string;
  nickname: string;
  picture: string;
  user_id: string;
  username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  email_verified?: string;
  clientID: string;
  gender?: string;
  locale?: string;
  identities: any[];
  created_at: string;
  updated_at: string;
  sub: string;
  user_metadata?: any;
  app_metadata?: any;
}
