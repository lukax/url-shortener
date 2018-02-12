import "reflect-metadata";
import {Action, useContainer as rtUsec, createExpressServer} from "routing-controllers";
import {Container} from "typedi";
import {Express} from "express";
import morgan = require("morgan");
import {readdirSync} from "fs";
import bodyParser = require("body-parser");
import {join} from "path";
import {getConnectionManager, useContainer as ormUsec, createConnection} from "typeorm";
import {appConfig} from "./app.config";
import * as compression from "compression";
import * as jwt from 'jsonwebtoken';
import {IUserJwt} from "./dtos/IUser";
import {UserService} from "./services/UserService";
import { PagesController } from "./controllers/web/PagesController";
import { ApiLinksController } from "./controllers/api/ApiLinksController";
import * as Raven from 'raven';
import { User } from "./model/User";
import { LinkCache } from "./model/LinkCache";
import { Link } from "./model/Link";
import { BrowserService } from "./services/BrowserService";
import { LinkCacheService } from "./services/LinkCacheService";
import { LinkService } from "./services/LinkService";
Raven.config('https://d1021346a5ad46c5b241716a7f0e0e2e:0cde665a1f2b46c39fad070c0cc7a66a@sentry.io/284838', {
  autoBreadcrumbs: {
    'console': true,  // console logging
    'http': true,     // http and https requests
  }
}).install();

export async function createApp(): Promise<Express> {

  Container.set([{ id: 'config', value: appConfig }]);

  /**
   * Setup routing-controllers to use typedi container.
   */
  rtUsec(Container);
  ormUsec(Container);

  /** 
   * Import controllers, services and entities
  */
  const controllers = [
    PagesController,
    ApiLinksController
  ];
  const services = [
    BrowserService,
    LinkCacheService,
    LinkService,
    UserService
  ];
  const entities = [
    Link,
    User,
    LinkCache
  ];

  try {
    /**
     * Connect to database
     */
    await createConnection(Object.assign({}, appConfig.database, { entities: entities }));
  } catch(ex) {
    console.log('Error! Failed to connect to db');
  }
  
  const expressApp = createExpressServer({
    /**
     * We can add options about how routing-controllers should configure itself.
     * Here we specify what controllers should be registered in our express server.
     */
    controllers: controllers,

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
   * Use middlewares
   */
  // The request handler must be the first middleware on the app
  expressApp.use(Raven.requestHandler());
  expressApp.use(morgan('combined')); //logger
  expressApp.use(bodyParser.raw());
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(bodyParser.json());
  //expressApp.use(bodyParser.text());
  expressApp.use(compression());

  // The error handler must be before any other error middleware
  expressApp.use(Raven.errorHandler());

  /**
   * Configure the view engine.
   */
  //expressApp.set('view engine', 'twig');
  //expressApp.set('views', join(__dirname, '/resources/views'));

  return expressApp;
}
