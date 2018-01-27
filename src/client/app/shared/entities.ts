export class CreateLinkDto {
  name = '';
  message = '';
  buttonText = '';
  buttonUrl = '';
  pageUrl = '';
}

export interface CreateLinkResultDto {
  hash: string;
}

export interface VerifyUrlResultDto {
  isInvalid: boolean;
  message: string;
}

export interface VerifyUrlDto {
  url: string;
}
