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
  @Effect() init$: Observable<LinkCreate.Actions> = this.actions$
    .ofType(LinkCreate.ActionTypes.INIT)
    .startWith(new LinkCreate.InitAction)
    .switchMap(() => this.linkService.getCurrentCreateLink())
    .map(payload => {
      return new LinkCreate.InitializedAction(payload);
    })
    // nothing reacting to failure at moment but you could if you want (here for example)
    .catch(() => Observable.of(new LinkCreate.InitFailedAction()));

  @Effect() choosePageLink$: Observable<LinkCreate.Actions> = this.actions$
    .ofType(LinkCreate.ActionTypes.CHOOSE_PAGE_LINK)
    .map(action => {
      let pageUrl = action.payload.pageUrl;
      // analytics
      this.linkService.track(LinkCreate.ActionTypes.CHOOSE_PAGE_LINK, { label: action.payload });
      return new LinkCreate.ChoosePageLinkSuccessAction(action.payload);
    });

  @Effect() setupCta$$: Observable<LinkCreate.Actions> = this.actions$
    .ofType(LinkCreate.ActionTypes.SETUP_CTA)
    .map(action => {
      let pageUrl = action.payload.buttonUrl;
      // analytics
      this.linkService.track(LinkCreate.ActionTypes.SETUP_CTA, { label: action.payload });
      return new LinkCreate.SetupCtaSuccessAction(action.payload);
    });

  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private linkService: LinkService
  ) { }
}
