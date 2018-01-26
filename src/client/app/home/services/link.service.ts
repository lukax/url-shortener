// angular
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// libs
import { Observable } from 'rxjs/Observable';

// app

// module
import { LinkCreate } from '../actions/index';
import {CreateLinkDto} from "../../../../../dist/tmp/app/core/LinkDto";
import "rxjs/add/observable/of";
import {Analytics, AnalyticsService} from "../../modules/analytics/services";

@Injectable()
export class LinkService extends Analytics {

  constructor(
    public analytics: AnalyticsService,
    private http: Http
  ) {
    super(analytics);
    this.category = LinkCreate.CATEGORY;
  }

  getCurrentCreateLink(): Observable<CreateLinkDto> {
    return Observable.of(new CreateLinkDto())
  }

}
