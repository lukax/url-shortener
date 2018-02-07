import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { routes} from './app.routes';
import { AdminModule } from './admin/admin.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import {ShareModule as SocialShareModule} from "@ngx-share/core";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {AnalyticsModule} from "./modules/analytics/index";
import {RouterModule} from "@angular/router";
import {DBModule} from "@ngrx/db";
import {RouterStateSerializer, StoreRouterConnectingModule} from "@ngrx/router-store";
import {metaReducers, reducers} from "./app.reducer";
import {EffectsModule} from "@ngrx/effects";
import {CustomRouterStateSerializer} from "./shared/utils";

let DEV_IMPORTS: any[] = [];

if (String('<%= BUILD_TYPE %>') === 'dev') {
  DEV_IMPORTS = [
    ...DEV_IMPORTS,/**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     *
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     *
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    StoreDevtoolsModule.instrument({ name: 'jeit.in', maxAge: 25 })
  ];
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule.forRoot(),
    SocialShareModule.forRoot(),
    AnalyticsModule,

    RouterModule.forRoot(routes),
    StoreModule.forRoot(reducers, {metaReducers}),
    StoreRouterConnectingModule,
    EffectsModule.forRoot([]),

    ...DEV_IMPORTS,

    AdminModule,
    AuthModule,
    HomeModule,
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
