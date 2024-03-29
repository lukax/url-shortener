import {OrmRepository} from "typeorm-typedi-extensions";
import {Service} from "typedi";
import { LinkRepository } from "../repository/LinkRepository";
import { Link } from "../model/Link";
import {randomBytes} from "crypto";
import axios from "axios";
import {CreateLinkDto, CreateLinkResultDto, ViewLinkDto} from "../dtos/CreateLinkDto";
import {ObjectID} from "typeorm";
import {User} from "../model/User";
import { LinkCacheRepository } from "../repository/LinkCacheRepository";
import { LinkCache } from "../model/LinkCache";

@Service()
export class LinkService {

    @OrmRepository(Link)
    private repo: LinkRepository;

    @OrmRepository(LinkCache)
    private repoLinkCache: LinkCacheRepository;


    public async findAll(): Promise<ViewLinkDto[]> {
        const links = await this.repo.find();
        return links.map((x) => ViewLinkDto.toDto(x)).filter(x => x != null);
    }

    public async findAllByUser(user: User): Promise<ViewLinkDto[]> {
        const links = await this.repo.find({ userId: user._id });
        return links.map((x) => ViewLinkDto.toDto(x)).filter(x => x != null);
    }

    public async findOneByHash(hash: string): Promise<ViewLinkDto> {
        const link = await this.repo.findOne({ hash: hash });
        if(link) {
          const linkCache = await this.repoLinkCache.findOne({ pageUrl: link.pageUrl });
          return ViewLinkDto.toDto(link, linkCache);
        }

        return null;
    }

    public async create(model: CreateLinkDto, user: User): Promise<CreateLinkResultDto> {

      await this.throwIfNotValid(model);

      let link = new Link();
      link.pageUrl = model.pageUrl;
      link.buttonText = model.buttonText;
      link.buttonUrl = model.buttonUrl;
      link.name = model.name;
      link.message = model.message;
      link.hash = this._createUrlHash(link);
      if(!!user) {
        link.userId = user._id;
      }

      if((await this.findOneByHash(link.hash)) != null) {
        throw new Error("Could not save link, hash already exists. ");
      }

      link = await this.repo.save(link);

      const linkCache = await this.repoLinkCache.findOne({ pageUrl: link.pageUrl });
      let isExpired = false;
      let metadata = {};
      if(linkCache) {
        isExpired = linkCache.isExpired();
        metadata = linkCache.metadata;

      }

      return { hash: link.hash, pageUrl: link.pageUrl, isExpired, metadata };
    }

    public async update(model: CreateLinkDto, hash: string, user: User): Promise<boolean> {

      await this.throwIfNotValid(model);

      const link = await this.findOneByHash(hash);
      if(link == null) {
        throw new Error("Hash not found");
      }

      link.pageUrl = model.pageUrl;
      link.buttonText = model.buttonText;
      link.buttonUrl = model.buttonUrl;
      link.name = model.name;
      link.message = model.message;

      const result = await this.repo.save(link);

      return result != null;
    }

    async isUrlValid(url: string): Promise<boolean> {
      try {
        const res = await axios.head(url, {timeout: 10000});

        const isValid = res.status >= 200 && res.status < 400 /*&& /text\/html/i.test(res.headers['content-type'])*/;
        console.log(`isUrlValid: ${isValid}, status=${res.status}, content-type=${res.headers['content-type']}`);

        return isValid;
      } catch(e) {
        console.log(`isUrlValid: error ${e.message}`);
        return false;
      }
    }

    private async throwIfNotValid(model: CreateLinkDto) {
      if(!(await this.isUrlValid(model.pageUrl))) {
        throw new Error(`Page URL does not contain a valid HTML page :(`);
      }
      if(!(await this.isUrlValid(model.buttonUrl))) {
        throw new Error(`Button URL does not contain a valid HTML page :(`);
      }
    }

    private _createUrlHash(link: Link): string {
      return randomBytes(3).toString('hex').substring(0, 5);
    }

}
