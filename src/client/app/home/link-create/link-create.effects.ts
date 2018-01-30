import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { LinkService } from '../services/link.service';
import {ClearAsyncErrorAction, SetAsyncErrorAction, StartAsyncValidationAction} from "ngrx-forms";
import {LinkCreate} from './link-create.actions';
import {getChooseLinkForm, State} from "./link-create.reducer";

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
    .ofType(LinkCreate.ActionTypes.SUBMIT_PAGE_URL)
    .map((action: LinkCreate.SubmitPageUrlAction) => {
      // analytics
      this.linkService.track(LinkCreate.ActionTypes.SUBMIT_PAGE_URL, { label: JSON.stringify(action.payload) });
      return new LinkCreate.SelectStepAction('setup-brand');
    });

  @Effect() setupCta$: Observable<LinkCreate.Actions> = this.actions$
    .ofType(LinkCreate.ActionTypes.SUBMIT_SETUP_CTA)
    .switchMap(
      (action: LinkCreate.SubmitSetupCtaAction) =>

        Observable.timer(300)
          .concat(() =>
            this.linkService.createLink(action.payload)
              .flatMap(createLinkResult => {
                this.linkService.track(LinkCreate.ActionTypes.SUBMIT_SETUP_CTA_RESULT, { label: JSON.stringify(createLinkResult) });
                return [
                  new LinkCreate.SubmitSetupCtaResultAction(createLinkResult),
                  new LinkCreate.SelectStepAction('share-link'),
                ];
              })
              .catch(err => {
                this.linkService.track(LinkCreate.ActionTypes.SUBMIT_SETUP_CTA_RESULT, { label: 'fail' });
                return [
                  new LinkCreate.SubmitSetupCtaResultAction({ error: err.message }),
                ];
              })
          )
        );

  @Effect() verifyPageUrl$: Observable<Action> = this.store
    .select(getChooseLinkForm)
    .filter(fs => !!fs.value.pageUrl)
    .distinct(fs => fs.value)
    .switchMap(fs =>
      Observable.timer(300)
        .map(() => new StartAsyncValidationAction(
          fs.controls.pageUrl.id,
          'exists',
        ))
        .concat(
          this.linkService.verifyUrl( fs.value.pageUrl )

            .flatMap((resp) => {
              if (resp.isValid) {
                return [
                  new LinkCreate.SetPageUrlPreviewAction(fs.value),
                  new ClearAsyncErrorAction(
                    fs.controls.pageUrl.id,
                    'exists',
                  ),
                ];
              }
              return [
                new LinkCreate.SetPageUrlPreviewAction(null),
                new SetAsyncErrorAction(
                  fs.controls.pageUrl.id,
                  'exists',
                  fs.value.pageUrl,
                ),
              ];
            })

            .catch(resp => [
              new LinkCreate.SetPageUrlPreviewAction(null),
              new SetAsyncErrorAction(
                fs.controls.pageUrl.id,
                'exists',
                fs.value.pageUrl,
              ),
            ])
        )
    );

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private linkService: LinkService
  ) { }
}
