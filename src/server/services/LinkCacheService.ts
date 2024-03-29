import {Service, Inject} from "typedi";
import {OrmRepository} from "typeorm-typedi-extensions";
import {LinkCache} from "../model/LinkCache";
import {LinkCacheRepository} from "../repository/LinkCacheRepository";
import * as aws from 'aws-sdk';
import {appConfig} from "../app.config";
import * as metascraper from 'metascraper';
import { PageMetadata } from '../dtos/PageMetadata';

@Service()
export class LinkCacheService {

  private s3: aws.S3 = new aws.S3({ 
    accessKeyId:appConfig.storage.AWS_ACCESS_KEY_ID, 
    secretAccessKey: appConfig.storage.AWS_SECRET_ACCESS_KEY 
  });

  @OrmRepository(LinkCache)
  private repo: LinkCacheRepository;

  public async saveCache(pageUrl: string, pageHtml: string): Promise<boolean> {

    const fileKey = this.getPageUrlKey(pageUrl);
    const params = {Bucket: appConfig.storage.AWS_S3_BUCKET, Key: fileKey, Body: pageHtml};
    let ok = true;
    try {
      await new Promise((resolve, reject) => {
        this.s3.putObject(params, (err) => {
          if (err) {
            console.log(err);
            ok = false;
            reject();
          } else {
            console.log(`cache content uploaded ${fileKey}`);
            resolve();
          }
        });
      });
    } catch(e) {
      ok = false;
    }

    if(!ok) {
      return false;
    }

    let linkCache = await this.repo.findOne({ pageUrl: pageUrl });
    if(!linkCache) {
      linkCache = new LinkCache();
    }
    linkCache.pageUrl = pageUrl;
    linkCache.cacheTime = +new Date();
    linkCache.fileKey = fileKey;
    linkCache.metadata = await this.getMetadata(pageUrl, pageHtml);

    await this.repo.save(linkCache);
    return true;
  }

  public async findCache(pageUrl: string): Promise<{content: string, isAlive: boolean}> {
    const linkCache = await this.repo.findOne({ pageUrl: pageUrl });
    if(linkCache == null || linkCache.isExpired()) {
      return { content: null, isAlive: false };
    }

    const fileKey = this.getPageUrlKey(pageUrl);
    const params = {Bucket: appConfig.storage.AWS_S3_BUCKET, Key: fileKey};
    let content = null;
    try {
      await new Promise((resolve, reject) => {
        this.s3.getObject(params, (err, data) => {
          if (err) {
            console.log(err);
            reject();
          } else {
            console.log(`cache content downloaded ${fileKey}`);
            content = data.Body.toString();
            resolve();
          }
        });
      });
    } catch(e) { }

    if(content) {
      return { content: content, isAlive: true };
    }

    return { content: null, isAlive: false };
  }

  public async getMetadata(pageUrl:string, pageHtml: string): Promise<PageMetadata> {
    let metadata = {};
    try {
        metadata = await metascraper({url: pageUrl, html: pageHtml});
        console.log(`OK. Metadata for ${pageUrl}: ` + JSON.stringify(metadata));
      } catch(ex) {
        console.log(`ERR. Could not get metadata for ${pageUrl}. ` + ex);
    }
    return metadata;
}

  private getPageUrlKey(pageUrl: string): string {
    return `pageUrl//${pageUrl}`;
  }


}
