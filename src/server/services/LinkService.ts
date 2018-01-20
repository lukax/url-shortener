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

    public async getAllByUser(userId: string): Promise<Link[]> {
        return this.repo.find({ userId: userId });
    }

    public async findOneByHash(hash: string): Promise<Link> {
        return this.repo.findOne(<any>{ _hash: hash });
    }

    public async persist(link: Link): Promise<any> {
        return this.repo.save(link);
    }

    public async updateCache(link: Link, pageCacheContent: string){
        link.pageCache = pageCacheContent;
        link.pageCacheTime = +new Date();
        this.repo.save(link);
    }

    public async getCacheReadyLink(link: Link): Promise<Link> {
        return await this.repo.findOne({ pageUrl: link.pageUrl, cache : { $exists: true } });
    }

    public async hasCacheForLink(link: Link): Promise<boolean> {
        const result = await this.getCacheReadyLink(link);
        return result != null && !this.isCacheExpired(result);
    }

    private isCacheExpired(url: Link): boolean {
        const seconds = (+new Date() - url.pageCacheTime) / 1000;
        const maxTimeAliveSeconds = 60 * 60 * 24;
        return url.pageCache == null || seconds > maxTimeAliveSeconds;
    }

}
