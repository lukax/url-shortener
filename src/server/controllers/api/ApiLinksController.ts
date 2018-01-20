import { JsonController, Get, Post, Body, NotFoundError, UseBefore } from "routing-controllers";
import { Inject, Service } from "typedi";
import { Link } from "../../model/Link";
import { createHash } from 'crypto';
import { LinkService } from "../../services/LinkService";
import { request } from 'http';
import { log } from "util";
import url from "url";
import {checkJwt} from "../../app.auth";
import {LinkCreatedDto, LinkDto} from "../../dtos/LinkCreateDto";
import axios from 'axios';


@Service()
@JsonController('/api')
//@UseBefore(checkJwt())
export class ApiLinksController {

    @Inject()
    private links: LinkService;

    /**
     * Sample API type insert
     * @param {string} name
     * @returns {Promise<any>}
     */
    @Post('/links')
    async insertNewLink(@Body() model: LinkDto): Promise<LinkCreatedDto> {

        log("InsertNewUrl " + JSON.stringify(model));

        if(await this.isUrlInvalid(model.pageUrl)){
          throw new NotFoundError(`Page URL does not contain a valid HTML page :(`);
        }
        if(await this.isUrlInvalid(model.buttonUrl)){
          throw new NotFoundError(`Button URL does not contain a valid HTML page :(`);
        }

        const newLink = new Link();
        newLink.hash = createHash('sha1').update(model.pageUrl + (+new Date())).digest('hex').substring(0, 5);
        newLink.pageUrl = model.pageUrl;
        newLink.name = model.name;
        newLink.message = model.message;
        newLink.buttonText = model.buttonText;
        newLink.buttonUrl = model.buttonUrl;
        this.links.persist(newLink);

        return {
          hash: newLink.hash
        };
    }

    /**
     * Simple Hello World from the API
     * @returns {Promise<any>}
     */
    @Get('/links')
    async getAllLinks(): Promise<LinkDto[]> {
        return (await this.links.getAll());
    }

    private async isUrlInvalid(url: string): Promise<boolean> {
      try {
        const res = await axios.head(url);

        return res.status < 200 ||
          res.status >= 400 ||
          !/text\/html/i.test(res.headers['content-type']);
      }
      catch(e){
        console.log(e);
        return false;
      }
    }

}
