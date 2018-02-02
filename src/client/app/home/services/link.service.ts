import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Analytics, AnalyticsService} from "../../modules/analytics/services/index";
import {AuthHttp} from "angular2-jwt";
import {VerifyUrlDto} from "../../../../server/dtos/VerifyUrlDto";
import {LinkCreate} from "../link-create/link-create.actions";
import {CreateLinkDto, CreateLinkResultDto, VerifyUrlResultDto} from "../../shared/entities";
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
    return this.http.post<VerifyUrlResultDto>(`/api/verify/url`, <VerifyUrlDto>{
        url: this.linkenizer(url)
      });
  }

  createLink(model: CreateLinkDto): Observable<CreateLinkResultDto> {
    return this.http.post<CreateLinkResultDto>(`/api/links`, Object.assign({}, model, <CreateLinkDto>{
        pageUrl: this.linkenizer(model.pageUrl),
        buttonUrl: this.linkenizer(model.buttonUrl)
      }));
  }

  linkenizer(link: string): string {
    return (!!link)
      ? (link.indexOf('://') === -1) ? 'http://' + link : link
      : link;
  }

  isUrl(url: string): boolean {
    return URL_REGEXP.test(url);
  }

}
