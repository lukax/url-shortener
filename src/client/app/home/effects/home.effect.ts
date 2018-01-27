import { Injectable } from '@angular/core';
import {Action, Store} from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { LinkService } from '../services/link.service';
import { LinkCreate } from '../actions/index';

@Injectable()
export class HomeEffects {

  /**
   * This effect makes use of the `startWith` operator to trigger
   * the effect immediately on startup.
   */
  @Effect() init$: Observable<Action> = this.actions$
    .ofType(LinkCreate.ActionTypes.INIT)
    .startWith(new LinkCreate.InitAction)
    .switchMap(() => this.nameListService.getCurrentCreateLink())
    .map(payload => {
      return new LinkCreate.InitializedAction(payload);
    })
    // nothing reacting to failure at moment but you could if you want (here for example)
    .catch(() => Observable.of(new LinkCreate.InitFailedAction()));

  // @Effect() add$: Observable<LinkCreate.Actions> = this.actions$
  //   .ofType(LinkCreate.ActionTypes.ADD)
  //   .map(action => {
  //     let name = action.payload;
  //     // analytics
  //     this.nameListService.track(LinkCreate.ActionTypes.NAME_ADDED, { label: name });
  //     return new LinkCreate.NameAddedAction(name);
  //   });

  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private nameListService: LinkService
  ) { }
}
