import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackComponent } from './callback.component';
import { AuthService } from './auth.service';
import {Http, HttpModule, RequestOptions} from "@angular/http";
import {Router, RouterModule} from "@angular/router";
import {AuthEmbeddedService} from "./auth-embedded.service";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {AuthEffects} from "./auth.effects";
import {reducer} from "./auth.reducer";
import {JwtModule} from "@auth0/angular-jwt";
import {HttpClientModule} from "@angular/common/http";
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        },
        // whitelistedDomains: ['localhost:3001']
      }
    }),

    RouterModule.forChild([
      { path: 'callback', component: CallbackComponent }
    ]),

    // StoreModule.forFeature('auth', reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: [CallbackComponent],
  providers: [
    {
      provide: AuthService,
      useFactory: function(router: Router) { return new AuthEmbeddedService(router); },
      deps: [Router]
    },
  ],
  exports: [CallbackComponent]
})
export class AuthModule { }
