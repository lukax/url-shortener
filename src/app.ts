import 'newrelic';
import "reflect-metadata";
import {createExpressServer, useContainer as rtUsec} from "routing-controllers";
import {Container} from "typedi";
import {Express} from "express";
import morgan = require("morgan");
import {readdirSync} from "fs";
import serveStatic = require("serve-static");
import bodyParser = require("body-parser");
import {join} from "path";
import {getConnectionManager, useContainer as ormUsec} from "typeorm";
import {registerAuthMiddleware} from './app.auth';
import {appConfig} from "./app.config";


/**
 * Provide a configuration injectable.
 */

;
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
const expressApp: Express = createExpressServer({
    /**
     * We can add options about how routing-controllers should configure itself.
     * Here we specify what controllers should be registered in our express server.
     */
    controllers: [join(__dirname, '/controllers/web/**/*'), join(__dirname, '/controllers/api/**/*') ]
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
 * This creates the default connection using config.yml
 */
getConnectionManager().create(appConfig.database).connect().then(() => {
    console.log('Connected!');
});

/**
 * Use middlewares
 */
expressApp.use(morgan('combined')); //logger
expressApp.use(bodyParser.raw());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());

/**
 * Configure the view engine.
 */
expressApp.set('view engine', 'twig');
expressApp.set('views', join(__dirname, '/../resources/views'));

/**
 * Configure authentication
 */
registerAuthMiddleware(expressApp);

/**
 * Setup static file serving
 */
expressApp.use(serveStatic('static'));

/**
 * Setup error handlers
// catch 404 and forward to error handler
expressApp.use(function(req, res, next) {
    const err: any = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// development error handler
// will print stacktrace
if (expressApp.get('env') === 'development') {
    expressApp.use((err: any, req: any, res: any, next: any) => {
        res.status(err.status || 500);
        res.render('error', {
        message: err.message,
        error: err
        });
    });
}
  
// production error handler
// no stacktraces leaked to user
expressApp.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
}); */

/**
 * Start the express app.
 */
expressApp.listen(appConfig.host.port);

console.log(`Server is up and running at port ${appConfig.host.port}`);