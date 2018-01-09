import {Inject, Service} from "typedi";
import {Controller, Get, Post, Redirect, Render, QueryParam, HttpCode, Req, Res, Param} from "routing-controllers";
import {ApiSampleController} from "../api/ApiSampleController";
import {Request, Response} from "express";
import * as crypto from "crypto";
import { UrlService } from "../../services/UrlService";
import { Url } from "../../model/Url";
import { log } from "util";
import * as puppeteer from "puppeteer";
import * as pTimeout from "p-timeout";
import { URL as SYSURL } from "url";

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
                {title: 'search engine', url: 'http://www.google.com'},
                {title: 'example page', url: 'http://www.example.com'},
                {title: 'veja os políticos que apoiam a pena de morte', url: 'http://www1.folha.uol.com.br/cotidiano/2018/01/1948659-apoio-a-pena-de-morte-bate-recorde-entre-brasileiros-aponta-o-datafolha.shtml'}
            ];
            for (const x of sample) {
                const url = new Url();
                url.title = x.title;
                url.hash = crypto.createHash('sha1').update(x.url).digest('hex').substring(0, 5);
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
    async viewUrlAction(@Param("hash") hash: string, @Req() request: Request, @Res() response: Response): Promise<any> {
        log("Loading url hash: " + hash);
        const url: Url = await this.urls.findOneByHash(hash);
        if(!url) return null;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const { host } = request.headers;

        const result = await this.run(page, url.url, host);

        return {
            port: this.config.host.port,
            title: this.config.sample.title,
            url: url,
            text: result
        };
    }

    private async run(page: puppeteer.Page, url: string, host: string) : Promise<any>{
        
        const nowTime = +new Date();
        let reqCount = 0;
        await page.setRequestInterception(true);
        page.on('request', (request) => {
          const { url, method, resourceType } = request;
  
          // Skip data URIs
          if (/^data:/i.test(url)){
            request.continue();
            return;
          }
  
          const seconds = (+new Date() - nowTime) / 1000;
          const otherResources = /^(manifest|other)$/i.test(resourceType);
          // Abort requests that exceeds 15 seconds
          // Also abort if more than 100 requests
          if (seconds > 15 || reqCount > 100){
            console.log(`❌⏳ ${method} ${url}`);
            request.abort();
          } else {
            console.log(`✅ ${method} ${url}`);
            request.continue();
            reqCount++;
          }
        });

        let responseReject: any;
        const responsePromise = new Promise((_, reject) => {
          responseReject = reject;
        });
        page.on('response', ({ headers }) => {
          const location = headers['location'];
          if (location && location.includes(host)){
            responseReject(new Error('Possible infinite redirects detected.'));
          }
        });

        const result = await page.goto(url, {waitUntil: 'networkidle2'});

        // Pause all media and stop buffering
        page.frames().forEach((frame) => {
            frame.evaluate(() => {
            document.querySelectorAll('video, audio').forEach((m: any) => {
                if (!m) return;
                if (m.pause) m.pause();
                m.preload = 'none';
            });
            });
        });

        const { origin, hostname, pathname, searchParams } = new SYSURL(url);
        const raw = searchParams.get('raw') || false;

        const content = await pTimeout(raw ? page.content() : page.evaluate(() => {
            let content = '';
            if (document.doctype) {
            content = new XMLSerializer().serializeToString(document.doctype);
            }

            const doc:any = document.documentElement.cloneNode(true);

            // Remove scripts except JSON-LD
            const scripts = doc.querySelectorAll('script:not([type="application/ld+json"])');
            scripts.forEach((s: any) => s.parentNode.removeChild(s));

            // Remove import tags
            const imports = doc.querySelectorAll('link[rel=import]');
            imports.forEach((i: any) => i.parentNode.removeChild(i));

            const { origin, pathname } = location;
            // Inject <base> for loading relative resources
            if (!doc.querySelector('base')){
            const base = document.createElement('base');
            base.href = origin + pathname;
            doc.querySelector('head').appendChild(base);
            }

            // Try to fix absolute paths
            const absEls = doc.querySelectorAll('link[href^="/"], script[src^="/"], img[src^="/"]');
            absEls.forEach((el: any) => {
            const href = el.getAttribute('href');
            const src = el.getAttribute('src');
            if (src && /^\/[^/]/i.test(src)){
                el.src = origin + src;
            } else if (href && /^\/[^/]/i.test(href)){
                el.href = origin + href;
            }
            });

            content += doc.outerHTML;

            // Remove comments
            content = content.replace(/<!--[\s\S]*?-->/g, '');

            return content;
        }), 10 * 1000, 'Render timed out');

        //res.writeHead(200, {
        //    'content-type': 'text/html; charset=UTF-8',
        //    'cache-control': 'public,max-age=31536000',
        //});
        //res.end(content);

        return content;
    }

}