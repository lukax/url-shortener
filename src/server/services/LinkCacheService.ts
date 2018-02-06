import {Service} from "typedi";
import {OrmRepository} from "typeorm-typedi-extensions";
import {LinkCache} from "../model/LinkCache";
import {LinkCacheRepository} from "../repository/LinkCacheRepository";
import * as aws from 'aws-sdk';
import {appConfig} from "../app.config";

@Service()
export class LinkCacheService {

  @OrmRepository(LinkCache)
  private repo: LinkCacheRepository;

  private s3 = new aws.S3({ accessKeyId:appConfig.storage.AWS_ACCESS_KEY_ID, secretAccessKey: appConfig.storage.AWS_SECRET_ACCESS_KEY });

  public async saveCache(pageUrl: string, cacheContent: string): Promise<boolean> {

    const fileKey = this.getPageUrlKey(pageUrl);
    const params = {Bucket: appConfig.storage.AWS_S3_BUCKET, Key: fileKey, Body: cacheContent};
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

    await this.repo.save(linkCache);
    return true;
  }

  public async findCache(pageUrl: string): Promise<{content: string, isAlive: boolean}> {
    const linkCache = await this.repo.findOne({ pageUrl: pageUrl });

    const fileKey = this.getPageUrlKey(pageUrl);
    const params = {Bucket: appConfig.storage.AWS_S3_BUCKET, Key: fileKey};
    let ok = true;
    let content;
    try {
      await new Promise((resolve, reject) => {
        this.s3.getObject(params, (err, data) => {
          if (err) {
            console.log(err);
            ok = false;
            reject();
          } else {
            console.log(`cache content downloaded ${fileKey}`);
            content = data.Body.toString();
            resolve();
          }
        });
      });
    } catch(e) {
      ok = false;
    }

    if(!ok) {
      return {content: null, isAlive: false};
    }

    const isAlive = linkCache != null && linkCache.isAlive();
    return { content: isAlive ? content : null, isAlive: isAlive };
  }

  private getPageUrlKey(pageUrl: string): string {
    return `pageUrl//${pageUrl}`;
  }


}
