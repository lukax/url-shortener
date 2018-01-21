import {OrmRepository} from "typeorm-typedi-extensions";
import {Service} from "typedi";
import { LinkRepository } from "../repository/LinkRepository";
import { Link } from "../model/Link";
import {randomBytes} from "crypto";
import axios from "axios";
import {CreateLinkDto, CreateLinkResultDto, ViewLinkDto} from "../dtos/LinkCreateDto";
import {ObjectID} from "typeorm";

@Service()
export class LinkService {

    @OrmRepository(Link)
    private repo: LinkRepository;

    public async findAll(): Promise<ViewLinkDto[]> {
        const links = await this.repo.find();
        return links.map(ViewLinkDto.toDto);
    }

    public async findAllByUser(userId: string): Promise<ViewLinkDto[]> {
        const links = await this.repo.find({ userId: userId });
        return links.map(ViewLinkDto.toDto);
    }

    public async findOneByHash(hash: string): Promise<ViewLinkDto> {
        const x = await this.repo.findOne(<any>{ _hash: hash });
        return ViewLinkDto.toDto(x);
    }

    public async create(model: CreateLinkDto): Promise<CreateLinkResultDto> {

      let link = new Link();
      link.pageUrl = model.pageUrl;
      link.buttonText = model.buttonText;
      link.buttonUrl = model.buttonUrl;
      link.name = model.name;
      link.message = model.message;
      link.hash = this._createUrlHash(link);

      if(await this._isUrlInvalid(link.pageUrl)){
        throw new Error(`Page URL does not contain a valid HTML page :(`);
      }
      if(await this._isUrlInvalid(link.buttonUrl)){
        throw new Error(`Button URL does not contain a valid HTML page :(`);
      }
      if((await this.findOneByHash(link.hash)) != null){
        throw new Error("Could not save link, hash already exists. ");
      }

      link = await this.repo.save(link);

      return { hash: link.hash };
    }

    public async update(model: CreateLinkDto, hash: string): Promise<boolean> {

      if(await this._isUrlInvalid(model.pageUrl)){
        throw new Error(`Page URL does not contain a valid HTML page :(`);
      }
      if(await this._isUrlInvalid(model.buttonUrl)){
        throw new Error(`Button URL does not contain a valid HTML page :(`);
      }
      if((await this.findOneByHash(hash)) == null){
        throw new Error("Could not save link, hash does not exists");
      }

      const result = await this.repo.updateOne({ hash: hash }, {
        pageUrl: model.pageUrl,
        name: model.name,
        message: model.message,
        buttonText: model.buttonText,
        buttonUrl: model.buttonUrl,
      });

      return result.matchedCount > 0;
    }

    private _createUrlHash(link: Link): string {
      return randomBytes(3).toString('hex').substring(0, 5);
    }

    private async _isUrlInvalid(url: string): Promise<boolean> {
      try {
        const res = await axios.head(url, {timeout: 5000 });

        return res.status < 200 ||
          res.status >= 400 ||
          !/text\/html/i.test(res.headers['content-type']);
      }
      catch(e){
        console.log(e.message);
        return false;
      }
    }

}
