import {IsNotEmpty, IsUrl} from 'class-validator';
import {Link} from "../model/Link";
import {ObjectID} from "typeorm";

export class CreateLinkDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  buttonText: string;

  @IsUrl({
    protocols: ['http','https'],
    require_protocol: true,
  })
  buttonUrl: string;

  @IsUrl({
    protocols: ['http','https'],
    require_protocol: true,
  })
  pageUrl: string;

}

export class CreateLinkResultDto {
  hash: string;
}

export class ViewLinkDto {
  _id: string;
  hash: string;
  name: string;
  message: string;
  buttonText: string;
  buttonUrl: string;
  pageUrl: string;

  id(): ObjectID {
    return ObjectID.createFromHexString(this._id);
  }

  public static toDto(link: Link): ViewLinkDto {
    if(link){
      const dto = new ViewLinkDto();
      dto._id = link._id.toHexString();
      dto.hash = link.hash;
      dto.pageUrl = link.pageUrl;
      dto.buttonText = link.buttonText;
      dto.buttonUrl = link.buttonUrl;
      dto.name = link.name;
      dto.message = link.message;
    }
    return null;
  }

}
