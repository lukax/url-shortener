import {Inject, Service} from "typedi";
import {Controller, Get, Post, Redirect, Render, QueryParam, HttpCode, Req, Res, Param} from "routing-controllers";
import {ApiSampleController} from "../api/ApiSampleController";
import {Request, Response} from "express";
import * as crypto from "crypto";
import { LinkService } from "../../services/LinkService";
import { Link } from "../../model/Link";
import { log } from "util";
import * as pTimeout from "p-timeout";
import { URL } from "url";
import * as puppeteer from "puppeteer";

let browser: puppeteer.Browser;

@Service()
@Controller()
export class SampleController {

    @Inject()
    private links: LinkService;

    @Inject()
    private api: ApiSampleController;

    /**
     * Generate sample content if nothing provided.
     * @returns {Promise<void>}
     */
    private async checkUrls() {
        const urls: Link[] = await this.links.getAll();
        if (!urls.length) {
            const sample = [
                {title: 'search engine', url: 'http://www.google.com'},
                {title: 'example page', url: 'http://www.example.com'},
                {title: 'veja os políticos que apoiam a pena de morte', url: 'http://www1.folha.uol.com.br/cotidiano/2018/01/1948659-apoio-a-pena-de-morte-bate-recorde-entre-brasileiros-aponta-o-datafolha.shtml'}
            ];
            for (const x of sample) {
                const url = new Link();
                url.title = x.title;
                url.hash = crypto.createHash('sha1').update(x.url).digest('hex').substring(0, 5);
                url.url = x.url;
                await this.links.persist(url);
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
        const urls: Link[] = await this.links.getAll();
        return {
            port: this.config.host.port,
            title: this.config.app.title,
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
        const link: Link = await this.links.findOneByHash(hash);
        if(!link) return null;

        const { host } = request.headers;

        let content;
        if(await this.links.hasCacheForLink(link)) {
            console.log(`access -> ${hash}. cached`);
            content = (await this.links.getCacheReadyLink(link)).cache;
        }
        else {
            console.log(`access -> ${hash}. no cache`);
            content = await this.runInBrowser(link.url, host);
            this.links.updateCache(link, content);
        }

        return {
            port: this.config.host.port,
            title: this.config.app.title,
            link: link,
            content: content || "An error has occurred, please try again"
        };
    }

    private async runInBrowser(pageURL: string, hostURL: string) : Promise<any>{
        let content: string;
        let page: puppeteer.Page;

        try {

            if(!browser){
                browser = await puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
                })
            }
            
            page = await browser.newPage();

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
            if (location && location.includes(hostURL)){
                responseReject(new Error('Possible infinite redirects detected.'));
            }
            });

            const result = await page.goto(pageURL, {waitUntil: 'networkidle2'});

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

            const { origin, hostname, pathname, searchParams } = new URL(pageURL);
            const raw = searchParams.get('raw') || false;

            content = await pTimeout(raw ? page.content() : page.evaluate(() => {
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
                const absEls = doc.querySelectorAll('link[href], script[src], img[src]');
                absEls.forEach((el: any) => {
                let href = el.getAttribute('href');
                let src = el.getAttribute('src');
                var r = new RegExp('^(?:[a-z]+:)?//', 'i');
                if (src && !r.test(src.trim())){
                    src = src.trim();
                    if(!(/^\/[^/]/i.test(src))){
                        src = '/' + src;
                    }
                    el.src = origin + src;
                } else if (href && !r.test(href.trim())){
                    href = href.trim();
                    if(!(/^\/[^/]/i.test(href))){
                        href = '/' + href;
                    }
                    el.href = origin + href;
                }
                });

                content += doc.outerHTML;

                // Remove comments
                content = content.replace(/<!--[\s\S]*?-->/g, '');

                return content;
            }), 20 * 1000, 'Render timed out');

            console.log('💥 Done action render');

            // Try to stop all execution
            page.frames().forEach((frame) => {
                frame.evaluate(() => {
                    // Clear all timer intervals https://stackoverflow.com/a/6843415/20838
                    for (var i = 1; i < 99999; i++) window.clearInterval(i);
                    // Disable all XHR requests
                    XMLHttpRequest.prototype.send = (_: any)=>_;
                    // Disable all RAFs
                    (<any>requestAnimationFrame) = (_: any)=>_;
                });
            });

            page.removeAllListeners();
            //await page.deleteCookie((await page.cookies()).map(x => { name: x.name,  }));
            await page.close();
        }
        catch (e) {
            if (page) {
              console.error(e);
              console.log('💔 Force close ' + pageURL);
              page.removeAllListeners();
              page.close();
            }
            //cache.del(pageURL);
            const { message = '' } = e;
            //res.writeHead(400, {
            //  'content-type': 'text/plain',
            //});
            content = null;

            // Handle websocket not opened error
            if (/not opened/i.test(message) && browser){
              console.error('🕸 Web socket failed');
              try {
                browser.close();
                browser = null;
              } catch (err) {
                console.warn(`Chrome could not be killed ${err.message}`);
                browser = null;
              }
            }
          }
        
          return content;
    }

}