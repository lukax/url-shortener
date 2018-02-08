export class CreateLinkDto {
  name? = '';
  message? = '';
  buttonText? = '';
  buttonUrl? = '';
  pageUrl? = '';
  userEmail?: string;
}

export interface CreateLinkResultDto {
  hash?: string;
  message?: string;
}

export interface VerifyUrlResultDto {
  isValid: boolean;
  message: string;
}

export interface VerifyUrlDto {
  url: string;
}
