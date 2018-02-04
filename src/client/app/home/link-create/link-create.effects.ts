import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { LinkService } from '../services/link.service';
import {
  ClearAsyncErrorAction, ResetAction, SetAsyncErrorAction, SetUserDefinedPropertyAction, SetValueAction,
  StartAsyncValidationAction
} from "ngrx-forms";
import {LinkCreate} from './link-create.actions';
import {
  CHOOSE_LINK_INITIAL_STATE, getChooseLinkForm, getCta, SETUP_BRAND_INITIAL_STATE, SETUP_CTA_INITIAL_STATE,
  State
} from "./link-create.reducer";
import SelectStepAction = LinkCreate.SelectStepAction;

@Injectable()
export class LinkCreateEffects {

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

  @Effect() setupBrand$: Observable<LinkCreate.Actions> = this.actions$
    .ofType(LinkCreate.ActionTypes.SUBMIT_SETUP_BRAND)
    .map((action: LinkCreate.SubmitPageUrlAction) => {
      // analytics
      this.linkService.track(LinkCreate.ActionTypes.SUBMIT_PAGE_URL, { label: JSON.stringify(action.payload) });
      return new LinkCreate.SelectStepAction('setup-cta');
    });

  @Effect() setupCta$: Observable<Action> = this.actions$
    .ofType(LinkCreate.ActionTypes.SUBMIT_SETUP_CTA)
    .withLatestFrom(this.store.select(getCta))
    .switchMap(([action, cta]) =>
      Observable.timer(300)
        .map(() => new SetUserDefinedPropertyAction(SETUP_CTA_INITIAL_STATE.id, 'isLoading', true))
        .concat(
              this.linkService.createLink(cta)
                .flatMap(createLinkResult => {
                  this.linkService.track(LinkCreate.ActionTypes.SUBMIT_SETUP_CTA_RESULT, { label: JSON.stringify(createLinkResult) });
                  return [
                    new SetUserDefinedPropertyAction(SETUP_CTA_INITIAL_STATE.id, 'isLoading', false),
                    new LinkCreate.SubmitSetupCtaResultAction(createLinkResult),
                    new LinkCreate.SelectStepAction('share-link'),
                  ];
                })
                .catch(err => {
                  this.linkService.track(LinkCreate.ActionTypes.SUBMIT_SETUP_CTA_RESULT, { label: JSON.stringify(err) });
                  return [
                    new SetUserDefinedPropertyAction(SETUP_CTA_INITIAL_STATE.id, 'isLoading', false),
                    new LinkCreate.SubmitSetupCtaResultAction({ message: err.error.message }),
                  ];
                })
            )
    );


  @Effect() verifyPageUrl$: Observable<Action> = this.store
    .select(getChooseLinkForm)
    .filter(fs => !!fs.value.pageUrl)
    .distinct(fs => fs.value)
    .switchMap(fs =>
      Observable.timer(1000)
        .map(() => new StartAsyncValidationAction(fs.controls.pageUrl.id,'exists'))
        .concat(
          this.linkService.verifyUrl( fs.value.pageUrl )
            .flatMap((resp) => {
              if (resp.isValid) {
                return [
                  new LinkCreate.SetPageUrlPreviewAction(fs.value),
                  new ClearAsyncErrorAction(fs.controls.pageUrl.id,'exists'),
                ];
              }
              return [
                new LinkCreate.SetPageUrlPreviewAction(null),
                new SetAsyncErrorAction(fs.controls.pageUrl.id,'exists',fs.value.pageUrl),
              ];
            })
            .catch(resp => [
              new LinkCreate.SetPageUrlPreviewAction(null),
              new SetAsyncErrorAction(fs.controls.pageUrl.id,'exists',fs.value.pageUrl),
            ])
        )
    );

  @Effect() newLinkEffect$: Observable<Action> = this.actions$
    .ofType(LinkCreate.ActionTypes.NEW_LINK)
    .switchMap(() =>
      Observable.of<Action>(
        new SelectStepAction('choose-link'),
        new SetValueAction(CHOOSE_LINK_INITIAL_STATE.id, CHOOSE_LINK_INITIAL_STATE.value),
        new ResetAction(CHOOSE_LINK_INITIAL_STATE.id),
        new SetValueAction(SETUP_BRAND_INITIAL_STATE.id, SETUP_BRAND_INITIAL_STATE.value),
        new ResetAction(SETUP_BRAND_INITIAL_STATE.id),
        new SetValueAction(SETUP_CTA_INITIAL_STATE.id, SETUP_CTA_INITIAL_STATE.value),
        new ResetAction(SETUP_CTA_INITIAL_STATE.id),
      )
    );

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private linkService: LinkService
  ) { }
}
