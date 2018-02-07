import {Inject, Service} from "typedi";
import {Controller, Get, Render, HttpCode, Req, Res, Param, UseBefore, NotFoundError} from "routing-controllers";
import {Request, Response} from "express";
import { LinkService } from "../../services/LinkService";
import { IAppConfig } from "../../app.config";
import {BrowserService} from "../../services/BrowserService";
import {LinkCacheService} from "../../services/LinkCacheService";


@Service()
@Controller()
export class PagesController {

    @Inject() private linkSvc: LinkService;
    @Inject() private browserSvc: BrowserService;
    @Inject() private linkCacheSvc: LinkCacheService;

    constructor (@Inject('config') private config: IAppConfig) {}

    @Render('viewUrl')
    @Get('/api/pages/:hash([a-z0-9]{5})') // match 5 digit hex string!
    @HttpCode(200)
    async viewUrlAction(@Param("hash") hash: string, @Req() req: Request): Promise<any> {
        console.log("Loading url hash: " + hash);
        const link = await this.linkSvc.findOneByHash(hash);
        if(!link) throw new NotFoundError();

        const { host } = req.headers;

        let content = null;
        const cache = await this.linkCacheSvc.findCache(link.pageUrl);
        if(cache.isAlive) {
            console.log(`access -> ${hash}. cached`);
            content = cache.content;
        } else {
          console.log(`access -> ${hash}. no cache`);
          content = await this.browserSvc.getContentOfPage(link.pageUrl, host);
          await this.linkCacheSvc.saveCache(link.pageUrl, content);
        }

        return {
            port: this.config.host.port,
            title: this.config.app.title,
            link: link,
            content: content || "An error has occurred, please try again"
        };
    }

}
