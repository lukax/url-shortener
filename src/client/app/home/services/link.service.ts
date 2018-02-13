import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Analytics, AnalyticsService} from "../../modules/analytics/services/index";
import {LinkCreate} from "../link-create/link-create.actions";
import {
  CreateLinkViewModel, CreateLinkResultViewModel, VerifyUrlViewModel, VerifyUrlResultViewModel,
  LinkViewModel
} from "../../shared/models";
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

  getCurrentCreateLink(): Observable<CreateLinkViewModel> {
    return Observable.of(new CreateLinkViewModel());
  }

  verifyUrl(url: string): Observable<VerifyUrlResultViewModel> {
    return this.http.post<VerifyUrlResultViewModel>(`/api/links/verify`, <VerifyUrlViewModel>{
        url: this.linkenizer(url)
      });
  }

  createLink(model: CreateLinkViewModel): Observable<CreateLinkResultViewModel> {
    return this.http.post<CreateLinkResultViewModel>(`/api/links`, Object.assign({}, model, <CreateLinkViewModel>{
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

  getLinkCta(hash: string): Observable<LinkViewModel> {
    return this.http.get<LinkViewModel>(`/api/links/${hash}`);
  }

}
