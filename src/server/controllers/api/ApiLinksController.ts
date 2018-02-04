import {
  JsonController, Get, Post, Body, NotFoundError, UseBefore, Put, Param, CurrentUser,
  Req
} from "routing-controllers";
import { Inject, Service } from "typedi";
import { LinkService } from "../../services/LinkService";
import { log } from "util";
import {CreateLinkDto, CreateLinkResultDto, ViewLinkDto} from "../../dtos/CreateLinkDto";
import {VerifyUrlDto, VerifyUrlResultDto} from "../../dtos/VerifyUrlDto";
import {checkJwt} from "../../app.auth";
import {User} from "../../model/User";


@Service()
@JsonController('/api/links')
@UseBefore(checkJwt())
export class ApiLinksController {

    @Inject()
    private links: LinkService;

    @Get('/')
    async findAllLinks(): Promise<ViewLinkDto[]> {
      return await this.links.findAll();
    }

    @Post('/')
    async insertLink(@Body() model: CreateLinkDto, @CurrentUser() user: User): Promise<CreateLinkResultDto> {

        log(`💥 insert link - ${JSON.stringify(model)}, user - ${JSON.stringify(user)}`);

        return await this.links.create(model, user);
    }

    @Put('/:hash')
    async editLink(@Param("hash") hash: string, @Body() model: CreateLinkDto, @CurrentUser() user: User): Promise<boolean> {

      log(`💥 edit link - ${JSON.stringify(model)}, user - ${JSON.stringify(user)}`);

      const l = await this.links.findOneByHash(hash);
      if(l == null) {
        throw new NotFoundError(`Link not found`);
      }

      return await this.links.update(model, hash, user);
    }

    @Post('/verify')
    async verifyUrl(@Body() model: VerifyUrlDto, @CurrentUser() user: User): Promise<VerifyUrlResultDto> {

      log(`💥 verify link - ${JSON.stringify(model)}, user - ${JSON.stringify(user)}`);

      const isValid = await this.links.isUrlValid(model.url);
      return <VerifyUrlResultDto>{
        isValid: isValid,
        message: !isValid ? 'Url not supported' : undefined
      };
    }

}
