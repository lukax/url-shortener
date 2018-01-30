export class CreateLinkDto {
  name? = '';
  message? = '';
  buttonText? = '';
  buttonUrl? = '';
  pageUrl? = '';
}

export interface CreateLinkResultDto {
  hash?: string;
  error?: string;
}

export interface VerifyUrlResultDto {
  isValid: boolean;
  message: string;
}

export interface VerifyUrlDto {
  url: string;
}
