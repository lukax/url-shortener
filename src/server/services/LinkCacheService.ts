import {Service} from "typedi";
import {OrmRepository} from "typeorm-typedi-extensions";
import {LinkCache} from "../model/LinkCache";
import {LinkCacheRepository} from "../repository/LinkCacheRepository";

@Service()
export class LinkCacheService {

  @OrmRepository(LinkCache)
  private repo: LinkCacheRepository;

  public async saveCache(pageUrl: string, cacheContent: string): Promise<boolean> {
    let linkCache = await this.repo.findOne({ pageUrl: pageUrl });
    if(!linkCache){
      linkCache = new LinkCache();
    }
    linkCache.cacheContent = cacheContent;
    linkCache.pageUrl = pageUrl;
    linkCache.cacheTime = +new Date();
    await this.repo.save(linkCache);
    return true;
  }

  public async findCache(pageUrl: string): Promise<{content: string, isAlive: boolean}> {
    const linkCache = await this.repo.findOne({ pageUrl: pageUrl });
    const isAlive = linkCache != null && linkCache.isAlive();
    return { content: isAlive ? linkCache.cacheContent : null,
             isAlive: isAlive };
  }

}
