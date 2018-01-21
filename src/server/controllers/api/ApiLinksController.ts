import {JsonController, Get, Post, Body, NotFoundError, UseBefore, Put, Param} from "routing-controllers";
import { Inject, Service } from "typedi";
import { LinkService } from "../../services/LinkService";
import { log } from "util";
import {CreateLinkDto, CreateLinkResultDto, ViewLinkDto} from "../../dtos/LinkCreateDto";


@Service()
@JsonController('/api')
//@UseBefore(checkJwt())
export class ApiLinksController {

    @Inject()
    private links: LinkService;

    @Get('/links')
    async findAllLinks(): Promise<ViewLinkDto[]> {
      return await this.links.findAll();
    }

    @Post('/links')
    async insertLink(@Body() model: CreateLinkDto): Promise<CreateLinkResultDto> {

        log("insert link - " + JSON.stringify(model));

        return await this.links.create(model);
    }

    @Put('/links/:hash')
    async editLink(@Param("hash") hash: string, @Body() model: CreateLinkDto): Promise<boolean> {

      log("edit link - " + JSON.stringify(model));

      const l = await this.links.findOneByHash(hash);
      if(l == null){
        throw new NotFoundError(`Link not found`);
      }

      return await this.links.update(model, hash);
    }



}
