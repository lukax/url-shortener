import {JsonController, Get, Post, Param, Body} from "routing-controllers";
import {Inject, Service} from "typedi";
import {Url} from "../../model/Url";
import * as crypto from 'crypto';
import { UrlService } from "../../services/UrlService";
import * as http from 'http';

@Service()
@JsonController('/api')
export class ApiSampleController {

    @Inject()
    private urls: UrlService;

    /**
     * Sample API type insert
     * @param {string} name
     * @returns {Promise<any>}
     */
    @Post('/urls')
    async insertNewUrl(@Body() urlModel: any): Promise<any> {

        if(!urlModel.title){
            return 'Inform title';
        }
        if (!/^https?:\/\//i.test(urlModel.url)) {
            return 'Invalid url';
        }
        const { origin, hostname, pathname, searchParams } = new URL(urlModel.url);
        const path = decodeURIComponent(pathname);

        const res = await new Promise((resolve, reject) => {
            const req = http.request({
              method: 'HEAD',
              host: hostname,
              path,
            }, ({ statusCode, headers }) => {
              if (!headers || (statusCode == 200 && !/text\/html/i.test(headers['content-type']))){
                reject(new Error('Not a HTML page'));
              } else {
                resolve();
              }
            });
            req.on('error', reject);
            req.end();
          });

        const newUrl = new Url();
        newUrl.hash = crypto.createHash('sha1').update(urlModel.url).digest('hex').substring(0, 4);
        newUrl.url = urlModel.url;
        newUrl.title = urlModel.title;
        this.urls.persist(newUrl);
        return 'ok';
    }

    /**
     * Simple Hello World from the API
     * @returns {Promise<any>}
     */
    @Get('/urls')
    async getAllUrls(): Promise<any> {
        return this.urls.getAll();
    }

    
}