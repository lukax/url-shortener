// angular
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// libs
import { Observable } from 'rxjs/Observable';

// app

// module
import { NameList } from '../actions/index';

@Injectable()
export class LinkService {

  constructor(
    private http: Http
  ) {
    //this.category = NameList.CATEGORY;
  }

  // getNames(): Observable<Array<string>> {
  //   return this.http.get(`${Config.IS_MOBILE_NATIVE() ? '/' : ''}assets/data.json`)
  //     .map(res => res.json());
  // }
}
