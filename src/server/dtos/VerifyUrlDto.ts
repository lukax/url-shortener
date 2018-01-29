import {IsUrl} from "class-validator";

export class VerifyUrlDto {

  @IsUrl({
    protocols: ['http','https'],
    require_protocol: true,
  })
  url: string;

}

export class VerifyUrlResultDto {
  isValid: boolean;
  message: string;
}
