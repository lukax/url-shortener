import {Express} from "express";
import passport = require('passport');
import flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Auth0Strategy = require('passport-auth0');

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL:
        process.env.AUTH0_CALLBACK_URL || `http://localhost:${process.env.PORT}/callback`
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

  const registerAuthMiddleware = function (expressApp: Express) {
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
  }

  export {registerAuthMiddleware};
