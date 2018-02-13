import {IsNotEmpty, IsUrl} from 'class-validator';
import {Link} from "../model/Link";
import {ObjectID} from "typeorm";
import { PageMetadata } from './PageMetadata';
import { LinkCache } from '../model/LinkCache';

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
  metadata?: PageMetadata;

  public static toDto(link: Link, linkCache?: LinkCache): ViewLinkDto {
    if(link) {
      const dto = new ViewLinkDto();
      dto._id = link._id.toHexString();
      dto.hash = link.hash;
      dto.pageUrl = link.pageUrl;
      dto.buttonText = link.buttonText;
      dto.buttonUrl = link.buttonUrl;
      dto.name = link.name;
      dto.message = link.message;
      if(linkCache) {
        dto.metadata = linkCache.metadata;
      }
      return dto;
    }
    return null;
  }

  id(): ObjectID {
    return ObjectID.createFromHexString(this._id);
  }

}
