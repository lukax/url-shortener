import {OrmRepository} from "typeorm-typedi-extensions";
import {Service} from "typedi";
import { LinkRepository } from "../repository/LinkRepository";
import { Link } from "../model/Link";

/**
 * Default service for the users.
 */
@Service()
export class LinkService {

    @OrmRepository(Link)
    private repo: LinkRepository;

    public async getAll(): Promise<Link[]> {
        return this.repo.find();
    }

    public async findOneByHash(hash: string): Promise<Link> {
        return this.repo.findOne(<any>{ _hash: hash });
    }

    public async persist(link: Link): Promise<any> {
        return this.repo.save(link);
    }

    public async updateCache(link: Link, cacheContent: string){
        link.cache = cacheContent;
        link.cacheTime = +new Date();
        this.repo.save(link);
    }

    public async getCacheReadyLink(link: Link): Promise<Link> {
        const url = await this.repo.findOne(<any> { _url: link.url, _cache : { $exists: true } });
        return url;
    }

    public async hasCacheForLink(link: Link): Promise<boolean> {
        const url = await this.repo.findOne(<any> { _url: link.url, _cache : { $exists: true } });
        return url != null && !this.isCacheExpired(url);
    }

    private isCacheExpired(url: Link): boolean {
        const seconds = (+new Date() - url.cacheTime) / 1000;
        const maxTimeAliveSeconds = 60 * 60 * 24;
        return url.cache == null || seconds > maxTimeAliveSeconds;
    }

}