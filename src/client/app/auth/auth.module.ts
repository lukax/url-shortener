import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackComponent } from './callback.component';
import { AuthService } from './auth.service';
import {Http, HttpModule, RequestOptions} from "@angular/http";
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {Router, RouterModule} from "@angular/router";
import {AuthEmbeddedService} from "./auth-embedded.service";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {AuthEffects} from "./auth.effects";
import {reducer} from "./auth.reducer";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: (() => localStorage.getItem('access_token')),
    globalHeaders: [{'Content-Type': 'application/json'}],
  }), http, options);
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule,

    RouterModule.forChild([
      { path: 'callback', component: CallbackComponent }
    ]),

    // StoreModule.forFeature('auth', reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: [CallbackComponent],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    {
      provide: AuthService,
      useFactory: function(router: Router) { return new AuthEmbeddedService(router); },
      deps: [Router]
    },
  ],
  exports: [CallbackComponent]
})
export class AuthModule { }
