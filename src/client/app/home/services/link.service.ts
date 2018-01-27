// angular
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// libs
import { Observable } from 'rxjs/Observable';

// app

// module
import { LinkCreate } from '../actions/index';
import "rxjs/add/observable/of";
import {Analytics, AnalyticsService} from "../../modules/analytics/services/index";
import {LinkCreateDto} from "../../core/index";

@Injectable()
export class LinkService extends Analytics {

  constructor(
    public analytics: AnalyticsService,
    private http: Http
  ) {
    super(analytics);
    this.category = LinkCreate.CATEGORY;
  }

  getCurrentCreateLink(): Observable<LinkCreateDto> {
    return Observable.of(new LinkCreateDto())
  }

}
