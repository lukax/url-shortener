import {Inject, Service} from "typedi";
import {Controller, Get, Post, Redirect, Render, QueryParam, HttpCode, Req, Res, Param} from "routing-controllers";
import {ApiSampleController} from "../api/ApiSampleController";
import {Request, Response} from "express";
import * as crypto from "crypto";
import { UrlService } from "../../services/UrlService";
import { Url } from "../../model/Url";
import { log } from "util";

@Service()
@Controller()
export class SampleController {

    @Inject()
    private urls: UrlService;

    @Inject()
    private api: ApiSampleController;

    /**
     * Generate sample content if nothing provided.
     * @returns {Promise<void>}
     */
    private async checkUrls() {
        const urls: Url[] = await this.urls.getAll();
        if (!urls.length) {
            const sample = [
                {title: 'A title', url: 'http://www.google.com'},
                {title: 'Another kind of title', url: 'http://www.example.com'}
            ];
            for (const x of sample) {
                const url = new Url();
                url.title = x.title;
                url.hash = crypto.createHash('sha1').update(x.url).digest('hex').substring(0, 4);
                url.url = x.url;
                await this.urls.persist(url);
            }
        }
    }

    constructor (@Inject('config') private config: any) {}

    /**
     * Sample index action.
     * @returns {any}
     */
    @Render('index')
    @Get('/')
    @HttpCode(200)
    async indexAction(): Promise<any> {
        await this.checkUrls();
        const urls: Url[] = await this.urls.getAll();
        return {
            port: this.config.host.port,
            title: this.config.sample.title,
            urls: urls
        };
    }

     /**
     * Sample index action.
     * @returns {any}
     */
    @Render('viewUrl')
    @Get('/:hash')
    @HttpCode(200)
    async viewUrlAction(@Param("hash") hash: string): Promise<any> {
        log("Loading url hash: " + hash);

        await this.checkUrls();
        const url: Url = await this.urls.findOneByHash(hash);
        return {
            port: this.config.host.port,
            title: this.config.sample.title,
            url: url
        };
    }

}