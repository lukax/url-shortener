import {IsNotEmpty, IsUrl} from 'class-validator';

export class LinkDto {

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

export class LinkCreatedDto {

  hash: string;

}
