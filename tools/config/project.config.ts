import { join } from 'path';

import { SeedConfig } from './seed.config';
import {ExtendPackages} from "./seed.config.interfaces";
// import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');
  FONTS_DEST = `${this.APP_DEST}/fonts`;
  FONTS_SRC = [
    'node_modules/font-awesome/fonts/**'
  ];
  ENABLE_SCSS = 1;

  constructor() {
    super();
     this.APP_TITLE = 'jeit.in';
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
      // {src: 'auth0-js/build/auth0.min.js', inject: 'libs'},

      /* Select a pre-built Material theme */
      {src: '@angular/material/prebuilt-themes/deeppurple-amber.css', inject: true},
      {src: 'font-awesome/css/font-awesome.min.css', inject: true},
      {src: '@ngx-share/button/styles/share-buttons.css', inject: true},
      {src: '@ngx-share/button/styles/themes/material/material-dark-theme.css', inject: true},
      /* Polyfill for unsupported browsers */
      //{src: 'web-animations-js/web-animations.min.js', inject: 'shims'},
      /* For some gestures */
      //{src: 'hammerjs/hammer.js', inject: 'libs'},
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    const additionalPackages: ExtendPackages[] = [
      {
        name: 'auth0-js',
        path: 'node_modules/auth0-js/build/auth0.min.js'
      },
      {
        name: '@auth0/angular-jwt',
        path: 'node_modules/@auth0/angular-jwt/bundles/core.umd.js'
      },
      {
        name: 'jquery',
        path: 'node_modules/jquery/dist/jquery.js',
      },
      {
        name: 'angular2-jwt',
        path: 'node_modules/angular2-jwt/angular2-jwt.js',
      },
      {
        name: '@angular/http',
        path: 'node_modules/@angular/http/bundles/http.umd.js'
      },
      {
        name: '@angular/material',
        path: 'node_modules/@angular/material/bundles/material.umd.js'
      },
      {
        name: '@angular/cdk',
        path: 'node_modules/@angular/cdk/bundles/cdk.umd.js'
      },
      {
        name: '@angular/cdk/a11y',
        path: 'node_modules/@angular/cdk/bundles/cdk-a11y.umd.js'
      },
      {
        name: '@angular/cdk/accordion',
        path: 'node_modules/@angular/cdk/bundles/cdk-accordion.umd.js'
      },
      {
        name: '@angular/cdk/bidi',
        path: 'node_modules/@angular/cdk/bundles/cdk-bidi.umd.js'
      },
      {
        name: '@angular/cdk/coercion',
        path: 'node_modules/@angular/cdk/bundles/cdk-coercion.umd.js'
      },
      {
        name: '@angular/cdk/collections',
        path: 'node_modules/@angular/cdk/bundles/cdk-collections.umd.js'
      },
      {
        name: '@angular/cdk/keycodes',
        path: 'node_modules/@angular/cdk/bundles/cdk-keycodes.umd.js'
      },
      {
        name: '@angular/cdk/layout',
        path: 'node_modules/@angular/cdk/bundles/cdk-layout.umd.js'
      },
      {
        name: '@angular/cdk/observers',
        path: 'node_modules/@angular/cdk/bundles/cdk-observers.umd.js'
      },
      {
        name: '@angular/cdk/overlay',
        path: 'node_modules/@angular/cdk/bundles/cdk-overlay.umd.js'
      },
      {
        name: '@angular/cdk/platform',
        path: 'node_modules/@angular/cdk/bundles/cdk-platform.umd.js'
      },
      {
        name: '@angular/cdk/portal',
        path: 'node_modules/@angular/cdk/bundles/cdk-portal.umd.js'
      },
      {
        name: '@angular/cdk/scrolling',
        path: 'node_modules/@angular/cdk/bundles/cdk-scrolling.umd.js'
      },
      {
        name: '@angular/cdk/stepper',
        path: 'node_modules/@angular/cdk/bundles/cdk-stepper.umd.js'
      },
      {
        name: '@angular/cdk/table',
        path: 'node_modules/@angular/cdk/bundles/cdk-table.umd.js'
      },
      {
        name: 'lodash',
        path: 'node_modules/lodash/lodash.js'
      },
      {
        name: 'auth0-lock',
        packageMeta: {
          main: 'lib/index.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngx-share/button',
        packageMeta: {
          main: 'bundles/ngx-share-button.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngx-share/buttons',
        packageMeta: {
          main: 'bundles/ngx-share-buttons.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngx-share/core',
        packageMeta: {
          main: 'bundles/ngx-share-core.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/core',
        packageMeta: {
          main: 'bundles/core.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/store',
        packageMeta: {
          main: 'bundles/store.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/effects',
        packageMeta: {
          main: 'bundles/effects.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/effects/testing',
        path: 'node_modules/@ngrx/effects/testing/index.js'
      },
      {
        name: '@ngrx/store-devtools',
        packageMeta: {
          main: 'bundles/store-devtools.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/db',
        packageMeta: {
          main: 'bundles/db.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/router-store',
        packageMeta: {
          main: 'bundles/router-store.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngx-translate/core',
        packageMeta: {
          main: 'bundles/core.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngx-translate/http-loader',
        packageMeta: {
          main: 'bundles/http-loader.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'angulartics2',
        path: 'node_modules/angulartics2/bundles/core.umd.js'
      },
      {
        name: 'angulartics2/segment',
        path: 'node_modules/angulartics2/bundles/segment.umd.js'
      },
      {
        name: 'ngrx-store-freeze',
        packageMeta: {
          main: 'bundles/ngrx-store-freeze.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'deep-freeze-strict',
        path: 'node_modules/deep-freeze-strict/index.js'
      },
      {
        name: 'ngrx-forms',
        path: 'node_modules/ngrx-forms/bundles/forms.umd.js'
      },
      {
        name: 'ngrx-forms/validation',
        path: 'node_modules/ngrx-forms/bundles/forms-validation.umd.js'
      },
    ];

    this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    this.PROXY_MIDDLEWARE = [
      require('http-proxy-middleware')(['/'], { ws: false, target: 'http://localhost:9001' })
    ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
