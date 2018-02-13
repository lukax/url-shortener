export class CreateLinkViewModel {
  name? = '';
  message? = '';
  buttonText? = '';
  buttonUrl? = '';
  pageUrl? = '';
  userEmail?: string;
}

export interface CreateLinkResultViewModel {
  hash?: string;
  message?: string;
  pageUrl?: string;
  metadata?: PageMetadataViewModel;
  isExpired?: boolean;
}

export interface VerifyUrlResultViewModel {
  isValid: boolean;
  message: string;
}

export interface VerifyUrlViewModel {
  url: string;
}

export interface LinkViewModel extends CreateLinkViewModel {
  metadata?: PageMetadataViewModel;
}

export interface PageMetadataViewModel {
  author?: string;
  date?: string;
  description?: string;
  video?: string;
  image?: string;
  lang?: string;
  logo?: string;
  publisher?: string;
  title?: string;
  url?: string;

  [name: string]: string;
}
