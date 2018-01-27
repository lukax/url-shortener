// angular
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// libs
import { Observable } from 'rxjs/Observable';

// app

// module
import "rxjs/add/observable/of";
import {Analytics, AnalyticsService} from "../../modules/analytics/services/index";
import {AuthHttp} from "angular2-jwt";
import {VerifyUrlDto} from "../../../../server/dtos/VerifyUrlDto";
import {LinkCreate} from "../link-create/link-create.actions";
import {CreateLinkDto, CreateLinkResultDto, VerifyUrlResultDto} from "../../shared/entities";

@Injectable()
export class LinkService extends Analytics {

  constructor(
    public analytics: AnalyticsService,
    private http: AuthHttp,

  ) {
    super(analytics);
    this.category = LinkCreate.CATEGORY;
  }

  getCurrentCreateLink(): Observable<CreateLinkDto> {
    return Observable.of(new CreateLinkDto());
  }

  verifyUrl(url: string): Observable<VerifyUrlResultDto> {
    return this.http.post(`/api/verify/url`, <VerifyUrlDto>{
        url: this.linkenizer(url)
      })
      .map(res => res.json());
  }

  createLink(model: CreateLinkDto): Observable<CreateLinkResultDto> {
    return this.http.post(`/api/links`, Object.assign({}, model, {
        pageUrl: this.linkenizer(model.pageUrl),
        buttonUrl: this.linkenizer(model.buttonUrl)
      }))
      .map(res => res.json());
  }

  linkenizer(link: string): string {
    return (!!link)
      ? (link.indexOf('://') === -1) ? 'http://' + link : link
      : link;
  }
}
