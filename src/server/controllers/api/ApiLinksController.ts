import { JsonController, Get, Post, Body, NotFoundError, UseBefore } from "routing-controllers";
import { Inject, Service } from "typedi";
import { Link } from "../../model/Link";
import { createHash } from 'crypto';
import { LinkService } from "../../services/LinkService";
import { request } from 'http';
import { log } from "util";
import { URL } from "url";
import {checkJwt} from "../../app.auth";
import {LinkDto} from "../../../client/app/core/LinkDto";

@Service()
@JsonController('/api')
//@UseBefore(checkJwt())
export class ApiLinksController {

    @Inject()
    private links: LinkService;

    /**
     * Sample API type insert
     * @param {string} name
     * @returns {Promise<any>}
     */
    @Post('/links')
    async insertNewLink(@Body() model: LinkDto): Promise<any> {

        log("InsertNewUrl " + JSON.stringify(model));

        if(!model.name){
            return 'Name is empty.';
        }
        if(!model.message){
            return 'Message is empty.';
        }
        if(!/^https?:\/\//i.test(model.buttonUrl)){
            return 'Invalid Button URL.';
        }
        if(!model.buttonText){
            return 'Button text is empty.';
        }
        if (!/^https?:\/\//i.test(model.pageUrl)) {
            return 'Invalid Page URL.';
        }
        const { origin, hostname, pathname, searchParams } = new URL(model.pageUrl);
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
        newLink.hash = createHash('sha1').update(model.pageUrl + (+new Date())).digest('hex').substring(0, 5);
        newLink.pageUrl = model.pageUrl;
        newLink.name = model.name;
        newLink.message = model.message;
        newLink.buttonText = model.buttonText;
        newLink.buttonUrl = model.buttonUrl;
        this.links.persist(newLink);
        return newLink.hash;
    }

    /**
     * Simple Hello World from the API
     * @returns {Promise<any>}
     */
    @Get('/links')
    async getAllLinks(): Promise<any> {
        return this.links.getAll();
    }


}
