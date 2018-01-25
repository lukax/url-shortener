export class LinkCreateDto {
  name = '';
  message = '';
  buttonText = '';
  buttonUrl = '';
  pageUrl = '';
}

export class LinkCreatedDto {
  hash: string;
}
