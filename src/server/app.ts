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


export function init(expressApp: Express){
  console.log('asdf!');
  /**
   * Provide a configuration injectable.
   */
  Container.set([{ id: 'config', value: appConfig }]);

  /**
   * Setup routing-controllers to use typedi container.
   */
  rtUsec(Container);
  ormUsec(Container);

  /**
   * We create a new express server instance.
   * We could have also use useExpressServer here to attach controllers to an existing express instance.
   */
  //registerAuthMiddleware(expressApp);
  useExpressServer(expressApp, {
    /**
     * We can add options about how routing-controllers should configure itself.
     * Here we specify what controllers should be registered in our express server.
     */
    controllers: [join(__dirname, '/controllers/web/**/*'), join(__dirname, '/controllers/api/**/*') ],

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
    console.log('Connected!');
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
