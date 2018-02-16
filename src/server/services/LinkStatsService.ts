import {OrmRepository} from "typeorm-typedi-extensions";
import {Service} from "typedi";
import { LinkRepository } from "../repository/LinkRepository";
import { Link, LinkStats } from "../model/Link";
import {randomBytes} from "crypto";
import axios from "axios";
import {CreateLinkDto, CreateLinkResultDto, ViewLinkDto} from "../dtos/CreateLinkDto";
import {ObjectID} from "typeorm";
import {User} from "../model/User";
import { LinkCacheRepository } from "../repository/LinkCacheRepository";
import { LinkCache, LinkCacheStats } from "../model/LinkCache";

//TODO: transactional updates
@Service()
export class LinkStatsService {

    @OrmRepository(Link)
    private links: LinkRepository;

    @OrmRepository(LinkCache)
    private caches: LinkCacheRepository;

    //-- page url --//

    public async trackPageUrlView(pageUrl: string): Promise<void> {
      const x = await this.caches.findOne({ pageUrl: pageUrl });
      // if(x) {
      //   x.stats = x.stats || new LinkCacheStats();
      //   x.stats.pageViewCount++;
      //   await this.caches.updateOne({ _id: x._id }, x);
      // }
    }

    public async trackVerifyUrl(pageUrl: string): Promise<void> {
      const x = await this.caches.findOne({ pageUrl: pageUrl});
      // if(x) {
      //   x.stats = x.stats || new LinkCacheStats();
      //   x.stats.verifyUrlCount++;
      //   await this.caches.updateOne({ _id: x._id }, x);
      // }
    }

    //-- hash --//

    public async trackHashView(hash: string): Promise<void> {
      const x = await this.links.findOne({ hash: hash });
      // if(x) {
      //   x.stats = x.stats || new LinkStats();
      //   x.stats.hashViewCount++;
      //   await this.links.updateOne({ _id: x._id }, x);
      // }
    }

    public async trackCtaView(hash: string): Promise<void> {
      const x = await this.links.findOne({ hash: hash });
      // if(x) {
      //   x.stats = x.stats || new LinkStats();
      //   x.stats.ctaViewCount++;
      //   await this.links.updateOne({ _id: x._id }, x);
      // }
    }

    public async trackButtonClick(hash: string): Promise<void> {
      const x = await this.links.findOne({ hash: hash });
      // if(x) {
      //   x.stats = x.stats || new LinkStats();
      //   x.stats.buttonClickCount++;
      //   await this.links.updateOne({ _id: x._id }, x);
      // }
    }


}
