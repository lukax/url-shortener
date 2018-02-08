import "reflect-metadata";
import "newrelic";
import {Action, useContainer as rtUsec, useExpressServer} from "routing-controllers";
import {Container} from "typedi";
import {Express} from "express";
import morgan = require("morgan");
import {readdirSync} from "fs";
import bodyParser = require("body-parser");
import {join} from "path";
import {getConnectionManager, useContainer as ormUsec} from "typeorm";
import {appConfig} from "./app.config";
import * as compression from "compression";
import * as jwt from 'jsonwebtoken';
import {IUserJwt} from "./dtos/IUser";
import {UserService} from "./services/UserService";
import { PagesController } from "./controllers/web/PagesController";
import { ApiLinksController } from "./controllers/api/ApiLinksController";
import * as Raven from 'raven';
Raven.config('https://d1021346a5ad46c5b241716a7f0e0e2e:0cde665a1f2b46c39fad070c0cc7a66a@sentry.io/284838').install();

export function init(expressApp: Express) {

  // The request handler must be the first middleware on the app
  expressApp.use(Raven.requestHandler());

  /**
   * Provide a configuration injectable.
   */
  Container.set([{ id: 'config', value: appConfig }]);

  /**
   * Setup routing-controllers to use typedi container.
   */
  rtUsec(Container);
  ormUsec(Container);

  useExpressServer(expressApp, {
    /**
     * We can add options about how routing-controllers should configure itself.
     * Here we specify what controllers should be registered in our express server.
     */
    controllers: [
      PagesController,
      ApiLinksController
    ],

    // authorizationChecker: async (action: Action, roles: string[]) => {
    //   // here you can use request/response objects from action
    //   // also if decorator defines roles it needs to access the action
    //   // you can use them to provide granular access check
    //   // checker must return either boolean (true or false)
    //   // either promise that resolves a boolean value
    //   // demo code:
    //   // const token = action.request.headers["authorization"];
    //   //
    //   // const user = await getEntityManager().findOneByToken(User, token);
    //   // if (user && !roles.length)
    //   //   return true;
    //   // if (user && roles.find(role => user.roles.indexOf(role) !== -1))
    //   //   return true;
    //   return !!action.request.user;
    // },

    currentUserChecker: async (action: Action) => {
      const token = action.request.headers["authorization"].split(' ')[1];
      const decoded: IUserJwt = <IUserJwt>jwt.decode(token);
      const userSvc = Container.get(UserService);
      return await userSvc.findByToken(decoded);
    }

  });

  /**
   * Import services
   */
  readdirSync(join(__dirname, '/services'))
    .filter(file => file.endsWith('.js'))
    .forEach((file) => require(join(__dirname, '/services', file)));

  /**
   * Import entities
   */
  appConfig.database.entities = [];
  readdirSync(join(__dirname, '/model'))
    .filter(file => file.endsWith('.js'))
    .forEach((file) => {
      const exported = require(join(__dirname, '/model', file));
      Object.keys(exported).forEach(className => {
        appConfig.database.entities.push(exported[className]);
      });
    });

  /**
   * This creates the default connection using appConfig
   */
  getConnectionManager().create(appConfig.database).connect().then(() => {
    console.log('Connected to db!');
  });

  /**
   * Use middlewares
   */
  expressApp.use(morgan('combined')); //logger
  expressApp.use(bodyParser.raw());
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(bodyParser.json());
  //expressApp.use(bodyParser.text());
  expressApp.use(compression());

  /**
   * Configure the view engine.
   */
  expressApp.set('view engine', 'twig');
  expressApp.set('views', join(__dirname, '/resources/views'));


  // The error handler must be before any other error middleware
  expressApp.use(Raven.errorHandler());

  /**
   * Setup static file serving
   */
  //expressApp.use(serveStatic('static'));

  /**
   * Start the express app.
   */
  //expressApp.listen(appConfig.host.port);
  //console.log(`Server is up and running at port ${appConfig.host.port}`);
}
