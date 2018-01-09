import {JsonController, Get, Post, Param, Body} from "routing-controllers";
import {Inject, Service} from "typedi";
import {Url} from "../../model/Url";
import * as crypto from 'crypto';
import { UrlService } from "../../services/UrlService";
import * as http from 'http';
import { log } from "util";
import { URL as SYSURL } from "url";

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
    async insertNewUrl(@Body() model: { title: string, url: string}): Promise<any> {

        log("InsertNewUrl " + JSON.stringify(model));

        if(!model.title){
            return 'no title!';
        }
        if (!/^https?:\/\//i.test(model.url)) {
            return 'invalid url!';
        }
        const { origin, hostname, pathname, searchParams } = new SYSURL(model.url);
        const path = decodeURIComponent(pathname);

        const res = await new Promise((resolve, reject) => {
            const req = http.request({
              method: 'HEAD',
              host: hostname,
              path,
            }, ({ statusCode, headers }) => {
              if (!headers || (statusCode == 200 && !/text\/html/i.test(headers['content-type']))){
                reject(new Error('not a HTML page :('));
              } else {
                resolve();
              }
            });
            req.on('error', reject);
            req.end();
          });

        const newUrl = new Url();
        newUrl.hash = crypto.createHash('sha1').update(model.url).digest('hex').substring(0, 5);
        newUrl.url = model.url;
        newUrl.title = model.title;
        this.urls.persist(newUrl);
        return newUrl.hash;
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