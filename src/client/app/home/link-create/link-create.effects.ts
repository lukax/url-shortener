import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { LinkService } from '../services/link.service';
import {ClearAsyncErrorAction, SetAsyncErrorAction, StartAsyncValidationAction} from "ngrx-forms";
import {LinkCreate} from './link-create.actions';

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
    .map((action: LinkCreate.ChoosePageLinkAction) => {
      // analytics
      this.linkService.track(LinkCreate.ActionTypes.CHOOSE_PAGE_LINK, { label: JSON.stringify(action.payload) });
      return new LinkCreate.GotoSectionAction('setup-brand');
    });

  @Effect() setupCta$: Observable<LinkCreate.Actions> = this.actions$
    .ofType(LinkCreate.ActionTypes.SETUP_CTA)
    .switchMap(
      (action: LinkCreate.SetupCtaAction) =>

        Observable.timer(300)
          .concat(() =>
            this.linkService.createLink(action.payload)
              .flatMap(createLinkResult => {
                this.linkService.track(LinkCreate.ActionTypes.SETUP_CTA_SUCCESS, { label: JSON.stringify(createLinkResult) });
                return [
                  new LinkCreate.SetupCtaSuccessAction(createLinkResult),
                  new LinkCreate.GotoSectionAction('share-link'),
                ];
              })
              .catch(err => {
                this.linkService.track(LinkCreate.ActionTypes.SETUP_CTA_FAILED, { label: 'fail' });
                return [
                  new LinkCreate.SetupCtaFailedAction(err.message),
                ];
              })
          )
        );

  @Effect() verifyPageUrl$: Observable<Action> = this.store
    .select(s => s.linkCreate.formState)
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
    private store: Store<any>,
    private actions$: Actions,
    private linkService: LinkService
  ) { }
}
