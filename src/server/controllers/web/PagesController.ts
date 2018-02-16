import {Inject, Service} from "typedi";
import {Controller, Get, Render, HttpCode, Req, Res, Param, UseBefore, NotFoundError, BadRequestError} from "routing-controllers";
import {Request, Response} from "express";
import { LinkService } from "../../services/LinkService";
import { IAppConfig } from "../../app.config";
import {BrowserService} from "../../services/BrowserService";
import {LinkCacheService} from "../../services/LinkCacheService";
import { LinkStatsService } from "../../services/LinkStatsService";


@Service()
@Controller()
export class PagesController {

    @Inject()
    private links: LinkService;

    @Inject()
    private stats: LinkStatsService;

    @Inject()
    private browserSvc: BrowserService;

    @Inject()
    private linkCacheSvc: LinkCacheService;


    @Get('/api/pages/:hash([a-z0-9]{5})') // match 5 digit hex string!
    @HttpCode(200)
    async viewUrlAction(@Param("hash") hash: string, @Req() req: Request): Promise<any> {
        console.log("Loading url hash: " + hash);
        const link = await this.links.findOneByHash(hash);
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

        await this.stats.trackHashView(hash);

        if(!content) {
            throw new BadRequestError("An error has occurred, please try again");
        }

        return content;
    }

    @Get('/api/pages/preview/:pageUrl')
    @HttpCode(200)
    async previewUrlAction(@Param("pageUrl") pageUrl: string, @Req() req: Request): Promise<any> {
        console.log("Loading url preview: " + pageUrl);

        pageUrl = decodeURIComponent(pageUrl);
        const isValid = await this.links.isUrlValid(pageUrl);
        if(!isValid) {
            throw new NotFoundError();
        }

        await this.stats.trackPageUrlView(pageUrl);

        const { host } = req.headers;

        let content = null;
        const cache = await this.linkCacheSvc.findCache(pageUrl);
        if(cache.isAlive) {
            console.log(`access -> ${pageUrl}. cached`);
            content = cache.content;
        } else {
          console.log(`access -> ${pageUrl}. no cache`);
          content = await this.browserSvc.getContentOfPage(pageUrl, host);
          await this.linkCacheSvc.saveCache(pageUrl, content);
        }

        if(!content) {
            throw new BadRequestError("An error has occurred, please try again");
        }

        return content;
    }
}
