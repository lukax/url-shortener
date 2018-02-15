import { Injectable } from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {UserProfile} from "./auth.service";
import {APP_CONFIG} from "../app.config";

@Injectable()
export class AuthEmbeddedService {

  lock = new Auth0LockPasswordless(APP_CONFIG.AUTH_CLIENT_ID, APP_CONFIG.AUTH_DOMAIN, {
    passwordlessMethod: 'code',
    autoclose: true,
    closable: false,
    auth: {
      redirectUrl: `${window.location.protocol}//${window.location.host}/callback`,
      responseType: 'token id_token',
      audience: APP_CONFIG.AUTH_API_ID,
      params: {
        scope: 'openid profile email'
      }
    },
    theme: {
      logo: '/assets/logo-small.png',
      primaryColor: '#800080'
    },
    languageDictionary: {
      emailInputPlaceholder: "eumesmo@gmail.com",
      title: "Jeit.in",
      loginWithLabel: 'Login com %s',
      passwordlessEmailAlternativeInstructions:
        'Senão, digite seu email para entrar<br/>ou criar uma conta',
      submitLabel: 'Enviar',
      welcome: 'Bem-vindo %s!',
      passwordlessEmailCodeInstructions: 'Um email com o código foi enviado para %s.',
      resendCodeAction: 'Não recebeu o código?',
      resendLabel: 'Reenviar',
      resendingLabel: 'Reenviando...',
      retryLabel: 'Tentar novamente',
      blankErrorHint: 'Não pode estar em branco',
      codeInputPlaceholder: 'seu código',
    },
  });

  constructor(public router: Router) {}

  public login(): void {
    this.lock.show();
  }

  // Call this method in app.component.ts
  // if using path-based routing
  public handleAuthentication(): void {
    this.lock.on('authenticated', (authResult: any) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.router.navigate(['/']);
      }
    });
    this.lock.on('authorization_error', (err: any) => {
      this.router.navigate(['/']);
      console.log(err);
      alert(`Error: ${err.error}. Check the console for further details.`);
    });
  }

  // Call this method in app.component.ts
  // if using hash-based routing
  public handleAuthenticationWithHash(): void {
    this
      .router
      .events
      .filter(event => event instanceof NavigationStart)
      .filter((event: NavigationStart) => (/access_token|id_token|error/).test(event.url))
      .subscribe(() => {
        this.lock.resumeAuth(window.location.hash, (err: any, authResult: any) => {
          if (err) {
            this.router.navigate(['/']);
            console.log(err);
            alert(`Error: ${err.error}. Check the console for further details.`);
            return;
          }
          this.setSession(authResult);
          this.router.navigate(['/']);
        });
      });
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
    return new Date().getTime() < expiresAt;
  }

  public getProfile(): Observable<UserProfile> {
    // const accessToken = localStorage.getItem('access_token');
    // if (accessToken) {
    //   this.auth.client.userInfo(accessToken, (err: any, profile: any) => {
    //     if (profile) {
    //       this.userProfileSubject.next(profile);
    //     }
    //   });
    // }
    return Observable.of(<any>{});
    // return this.userProfileSubject.asObservable();
  }

  private setSession(authResult: any): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

}
