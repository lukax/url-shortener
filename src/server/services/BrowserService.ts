import {Service} from "typedi";
import {URL} from "url";
import * as puppeteer from "puppeteer";
import * as pTimeout from "p-timeout";
import {BLOCKED_REGEXP} from '../app.blocked';

@Service({ global: true }) //completely global and not container-specific
export class BrowserService {

  browser: puppeteer.Browser;

  async getContentOfPage(pageURL: string, hostURL: string) : Promise<any>{
    let content: string;
    let page: puppeteer.Page;

    try {
      await this.initBrowser();

      page = await this.browser.newPage();

      const nowTime = +new Date();
      let reqCount = 0;
      await page.setRequestInterception(true);
      page.on('request', (request: any) => {
        const url = request.url();
        const method = request.method();
        const resourceType = request.resourceType();

        // Skip data URIs
        if (/^data:/i.test(url)) { request.continue(); return; }
        const seconds = (+new Date() - nowTime) / 1000;
        const shortURL = this.truncate(url, 70);
        const otherResources = /^(manifest|other)$/i.test(resourceType);
        // Abort requests that exceeds 15 seconds
        // Also abort if more than 100 requests
        if (seconds > 15 || reqCount > 100 || false){
          console.log(`❌⏳ ${method} ${shortURL}`);
          request.abort();
        } else if (BLOCKED_REGEXP.test(url) || otherResources){
          console.log(`❌ ${method} ${shortURL}`);
          request.abort();
        } else {
          console.log(`✅ ${method} ${shortURL}`);
          request.continue();
          reqCount++;
        }
      });

      let responseReject: any;
      const responsePromise = new Promise((_, reject) => { responseReject = reject; });
      page.on('response', ({ headers }) => {
        const location = headers['location'];
        if (location && location.includes(hostURL)){
          responseReject(new Error('Possible infinite redirects detected.'));
        }
      });

      await page.setViewport({ width: 1920, height: 1080 });

      console.log('⬇️ Fetching ' + pageURL);
      await Promise.race([
        responsePromise,
        page.goto(pageURL, { waitUntil: 'networkidle2', timeout: 15 * 1000 })
      ]);

      // Pause all media and stop buffering
      page.frames().forEach((frame) => {
        frame.evaluate(() => {
          let elements: any = document.querySelectorAll('video, audio');
          elements.forEach((m: any) => {
            if (!m) return;
            if (m.pause) m.pause();
            //m.preload = 'none';
          });
        });
      });


      const { origin, hostname, pathname, searchParams } = new URL(pageURL);
      const raw = searchParams.get('raw') || false;

      if(raw) { console.log('⬇⬇   RAW ' + pageURL); }

      const htmlHandle = await page.$('html');

      content = await pTimeout(raw ? page.content() : page.evaluate((html) => {
        let content = '';
        // if (document.doctype) { content = new XMLSerializer().serializeToString(document.doctype); }
        const doc:any = html;

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
          let r = new RegExp('^(?:[a-z]+:)?//', 'i');
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

        content += html.outerHTML;

        // Remove comments
        content = content.replace(/<!--[\s\S]*?-->/g, '');

        return content;
      }, htmlHandle), 20 * 1000, 'Render timed out');

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
      if (/not opened/i.test(message) && this.browser){
        console.error('🕸 Web socket failed');
        try {
          this.browser.close();
          this.browser = null;
        } catch (err) {
          console.warn(`Chrome could not be killed ${err.message}`);
          this.browser = null;
        }
      }
    }

    return content;
  }

  private async initBrowser(): Promise<any> {
    if(!this.browser){
      this.browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      })
    }
  }

  private truncate(str: string, len: number) { return  str.length > len ? str.slice(0, len) + '…' : str };

}
