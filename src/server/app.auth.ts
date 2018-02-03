import {Express} from "express";
import passport = require('passport');
import flash = require('connect-flash');
import session = require('express-session');
import cookieParser = require('cookie-parser');
import {authenticate} from "passport";
import {appConfig} from "./app.config";
const Auth0Strategy = require('passport-auth0');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');

function checkJwt() {
  return jwt({
    // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 15,
      jwksUri: `https://${appConfig.auth.AUTH_DOMAIN}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: appConfig.auth.AUTH_API_ID,
    issuer: `https://${appConfig.auth.AUTH_DOMAIN}/`,
    algorithms: ['RS256']
  });
}

function checkScopes() {
  return jwtAuthz([ /*'read:messages'*/ ]);
}

function registerAuthMiddleware(expressApp: Express) {
  expressApp.use(cors());

  // Configure Passport to use Auth0
  const strategy = new Auth0Strategy(
      {
          domain: appConfig.auth.AUTH_DOMAIN,
          clientID: appConfig.auth.AUTH_CLIENT_ID,
          clientSecret: appConfig.auth.AUTH_CLIENT_SECRET,
          callbackURL: appConfig.auth.AUTH_CALLBACK_URL
      },
      function(accessToken: any, refreshToken: any, extraParams: any, profile: any, done: any) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile);
      }
  );

  passport.use(strategy);

  // This can be used to keep a smaller payload
  passport.serializeUser(function(user, done) {
      done(null, user);
  });

  passport.deserializeUser(function(user, done) {
      done(null, user);
  });

  // -----

  expressApp.use(cookieParser());
  expressApp.use(
    session({
      secret: 'shhhhhhhhhhhhh',
      resave: true,
      saveUninitialized: true
    })
  );
  expressApp.use(passport.initialize());
  expressApp.use(passport.session());

  expressApp.use(flash());

  // Handle auth failure error messages
  expressApp.use(function(req, res, next) {
      if (req && req.query && req.query.error) {
      req.flash("error", req.query.error);
      }
      if (req && req.query && req.query.error_description) {
      req.flash("error_description", req.query.error_description);
      }
      next();
  });

  // Check logged in
  expressApp.use(function(req: any, res, next) {
      res.locals.loggedIn = false;
      if (req.session.passport && typeof req.session.passport.user != 'undefined') {
      res.locals.loggedIn = true;
      }
      next();
  });

  expressApp.get('/login',
      authenticate('auth0', <any>{
          clientID: appConfig.auth.AUTH_CLIENT_ID,
          domain: appConfig.auth.AUTH_DOMAIN,
          redirectUri: appConfig.auth.AUTH_CALLBACK_URL,
          responseType: 'code',
          audience: 'https://' + appConfig.auth.AUTH_DOMAIN + '/userinfo',
          scope: 'openid profile'
      }));

  expressApp.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  expressApp.get('/callback',
      passport.authenticate('auth0', { failureRedirect: '/failure' }),
      function(req, res) {
          res.redirect(req.session.returnTo || '/admin');
      });

  expressApp.get('/failure', function(req, res) {
      const error = req.flash("error");
      const error_description = req.flash("error_description");
      req.logout();
      res.render('failure', {
          error: error[0],
          error_description: error_description[0],
      });
  });
}

export {registerAuthMiddleware, checkJwt};
