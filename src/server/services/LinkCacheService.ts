import {Service} from "typedi";
import {OrmRepository} from "typeorm-typedi-extensions";
import {LinkCache} from "../model/LinkCache";
import {LinkCacheRepository} from "../repository/LinkCacheRepository";

@Service()
export class LinkCacheService {

  @OrmRepository(LinkCache)
  private repo: LinkCacheRepository;

  public async saveCache(pageUrl: string, cacheContent: string): Promise<boolean> {
    let existingLinkCache = await this.repo.findOne({ pageUrl: pageUrl });
    if(!existingLinkCache){
      let linkCache = new LinkCache();
      linkCache.cacheContent = cacheContent;
      linkCache.pageUrl = pageUrl;
      await this.repo.insert(linkCache);
      return true;
    } else {
      const r = await this.repo.updateOne({pageUrl: pageUrl}, {
        pageCache: cacheContent,
        pageCacheTime: +new Date()
      });
      return r.matchedCount > 0;
    }
  }

  public async findCache(pageUrl: string): Promise<{content: string, isAlive: boolean}> {
    const linkCache = await this.repo.findOne({pageUrl: pageUrl, cache: {$ne:null}});
    return { content: linkCache.cacheContent, isAlive: this._isCacheAlive(linkCache) };
  }

  private _isCacheAlive(link: LinkCache): boolean {
    const seconds = (+new Date() - link.cacheTime) / 1000;
    const maxTimeAliveSeconds = 60 * 60 * 24;
    return link.cacheContent != null && seconds > maxTimeAliveSeconds;
  }

}
