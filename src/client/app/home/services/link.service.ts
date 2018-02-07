import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Analytics, AnalyticsService} from "../../modules/analytics/services/index";
import {LinkCreate} from "../link-create/link-create.actions";
import {CreateLinkDto, CreateLinkResultDto, VerifyUrlDto, VerifyUrlResultDto} from "../../shared/entities";
import { HttpClient } from '@angular/common/http';
import {URL_REGEXP} from "../../shared/utils";

@Injectable()
export class LinkService extends Analytics {

  constructor(
    public analytics: AnalyticsService,
    private http: HttpClient,
  ) {
    super(analytics);
    this.category = LinkCreate.CATEGORY;
  }

  getCurrentCreateLink(): Observable<CreateLinkDto> {
    return Observable.of(new CreateLinkDto());
  }

  verifyUrl(url: string): Observable<VerifyUrlResultDto> {
    return this.http.post<VerifyUrlResultDto>(`/api/links/verify`, <VerifyUrlDto>{
        url: this.linkenizer(url)
      });
  }

  createLink(model: CreateLinkDto): Observable<CreateLinkResultDto> {
    return this.http.post<CreateLinkResultDto>(`/api/links`, Object.assign({}, model, <CreateLinkDto>{
        pageUrl: this.linkenizer(model.pageUrl),
        buttonUrl: this.linkenizer(model.buttonUrl)
      }));
  }

  linkenizer(url: string): string {
    return (!!url)
      ? (url.indexOf('://') === -1) ? 'http://' + url : url
      : url;
  }

  isUrl(url: string): boolean {
    return URL_REGEXP.test(url);
  }

  getLinkViewUrl(hash: string): string {
    return `/api/pages/${hash}`;
  }

  getLinkPreviewUrl(pageUrl: string): string {
    return `/api/pages/preview/${encodeURIComponent(this.linkenizer(pageUrl))}`;
  }

  getLinkCta(hash: string): Observable<CreateLinkDto> {
    return this.http.get<CreateLinkDto>(`/api/links/${hash}`);
  }

}
