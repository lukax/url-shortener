import * as http from 'http';
import * as express from 'express';
import * as path from 'path';
import * as appIniter from './app';

/**
 * Client Dir
 * @note `dev` default.
 */
let _clientDir = '../../client/dev';


export async function init(port: number, mode: string): Promise<http.Server> {
  
  const app = await appIniter.createApp();

  if (mode === 'dev') {
    /**
     * Dev Mode.
     * @note Dev server will only give for you middleware.
     */
    // app.all('/*', function(req, res, next) {
    //   res.header('Access-Control-Allow-Origin', '*');
    //   res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    //   next();
    // });

    /**
     * Api Routes for `Development`.
     */

    console.log('cwd ' + process.cwd());
    app.use(express.static(path.resolve(process.cwd())));
    app.use(express.static(path.resolve(process.cwd(), './dist/client/dev')));

    /**
     * Spa Res Sender
     */
    const renderIndex = (req: express.Request, res: express.Response) => {
      res.sendFile(path.resolve(__dirname, _clientDir + '/index.html'));
    };
    app.get('/*', renderIndex);
  } else {
    /**
     * Prod Mode.
     * @note Prod mod will give you static + middleware.
     */

    /**
     * Client Dir
     */
    _clientDir = '../../client/prod';

    /**
     * Static.
     */
    app.use('/js', express.static(path.resolve(__dirname, _clientDir + '/js')));
    app.use('/css', express.static(path.resolve(__dirname, _clientDir + '/css')));
    app.use('/assets', express.static(path.resolve(__dirname, _clientDir + '/assets')));
    app.use('/fonts', express.static(path.resolve(__dirname, _clientDir + '/fonts')));

    /**
     * Spa Res Sender.
     */
    const renderIndex = function (req: express.Request, res: express.Response) {
      res.sendFile(path.resolve(__dirname, _clientDir + '/index.html'));
    };

    /**
     * Prevent server routing and use @ng2-router.
     */
    app.get('/*', renderIndex);
  }

  /**
   * Server with gzip compression.
   */
  return new Promise<http.Server>((resolve, reject) => {
    const server = app.listen(port, () => {
      const port = server.address().port;
      console.log('App is listening on port:' + port);
      resolve(server);
    });
  });
}
