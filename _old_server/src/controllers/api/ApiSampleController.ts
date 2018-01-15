import { JsonController, Get, Post, Body, NotFoundError, UseBefore } from "routing-controllers";
import { Inject, Service } from "typedi";
import { Link } from "../../model/Link";
import { createHash } from 'crypto';
import { LinkService } from "../../services/LinkService";
import { request } from 'http';
import { log } from "util";
import { URL } from "url";
import { ensureLoggedIn } from 'connect-ensure-login';

@Service()
@JsonController('/api')
export class ApiSampleController {

    @Inject()
    private links: LinkService;

    /**
     * Sample API type insert
     * @param {string} name
     * @returns {Promise<any>}
     */
    @Post('/urls')
    async insertNewUrl(@Body() model: { title: string, url: string, description: string, ctaUrl: string, ctaHeader: string }): Promise<any> {

        log("InsertNewUrl " + JSON.stringify(model));

        if(!model.title){
            return 'no title!';
        }
        if(!model.description){
            return 'no description!';
        }
        if(!model.ctaUrl){
            return 'no cta url!';
        }
        if(!model.ctaHeader){
            return 'no cta header!';
        }
        if (!/^https?:\/\//i.test(model.url)) {
            return 'invalid url!';
        }
        const { origin, hostname, pathname, searchParams } = new URL(model.url);
        const path = decodeURIComponent(pathname);

        try{
            const res = await new Promise((resolve, reject) => {
                const req = request({
                method: 'HEAD',
                host: hostname,
                path,
                timeout: 5000 
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
        } catch(e){
            if(new RegExp("not a HTML page").test(e)){
                throw new NotFoundError(`URL is not a HTML page :(`); // message is optional
            }
            else {
                throw new NotFoundError(`please try again`); // message is optional
            }
        }

        const newLink = new Link();
        newLink.hash = createHash('sha1').update(model.url + (+new Date())).digest('hex').substring(0, 5);
        newLink.url = model.url;
        newLink.title = model.title;
        newLink.ctaHeader = model.ctaHeader;
        newLink.ctaUrl = model.ctaUrl;
        newLink.description = model.description;
        this.links.persist(newLink);
        return newLink.hash;
    }

    /**
     * Simple Hello World from the API
     * @returns {Promise<any>}
     */
    @Get('/urls')
    async getAllUrls(): Promise<any> {
        return this.links.getAll();
    }

    
}