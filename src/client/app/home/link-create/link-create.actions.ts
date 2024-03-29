import { Action } from '@ngrx/store';
import {CreateLinkViewModel, CreateLinkResultViewModel} from "../../shared/models";
import {type} from "../../shared/type";

/**
 * Each action should be namespaced
 * this allows the interior to have similar typed names as other actions
 * however still allow index exports
 */
export namespace LinkCreate {
  // Category to uniquely identify the actions
  export const CATEGORY = 'LinkCreate';

  /**
   * For each action type in an action group, make a simple
   * enum object for all of this group's action types.
   *
   * The 'type' utility function coerces strings into string
   * literal types and runs a simple check to guarantee all
   * action types in the application are unique.
   */
  export interface IHomeActions {
    INIT: string;
    INITIALIZED: string;
    INIT_FAILED: string;

    SUBMIT_PAGE_URL: string;
    SUBMIT_SETUP_BRAND: string;
    SUBMIT_SETUP_CTA: string;
    SUBMIT_SETUP_CTA_RESULT: string;
    SET_PAGE_URL_PREVIEW: string;
    SELECT_STEP: string;
    SELECTED_STEP: string;

    NEW_LINK: string;

    FORM_SAVE: string;
    FORM_SAVED: string;
    FORM_RESTORE: string;
    FORM_RESTORED: string;
  }

  export const ActionTypes: IHomeActions = {
    INIT: type(`${CATEGORY} Init`),
    INITIALIZED: type(`${CATEGORY} Initialized`),
    INIT_FAILED: type(`${CATEGORY} Init Failed`),

    SUBMIT_PAGE_URL: type(`${CATEGORY} SUBMIT_PAGE_URL`),
    SUBMIT_SETUP_BRAND: type(`${CATEGORY} SUBMIT_SETUP_BRAND`),
    SUBMIT_SETUP_CTA: type(`${CATEGORY} SUBMIT_SETUP_CTA`),
    SUBMIT_SETUP_CTA_RESULT: type(`${CATEGORY} SUBMIT_SETUP_CTA_RESULT`),
    SET_PAGE_URL_PREVIEW: type(`${CATEGORY} SET_PAGE_URL_PREVIEW`),
    SELECT_STEP: type(`${CATEGORY} SELECT_STEP`),
    SELECTED_STEP: type(`${CATEGORY} SELECTED_STEP`),

    NEW_LINK: type(`${CATEGORY} NEW_LINK`),

    FORM_SAVE: type(`${CATEGORY} FORM_SAVE`),
    FORM_SAVED: type(`${CATEGORY} FORM_SAVED`),
    FORM_RESTORE: type(`${CATEGORY} FORM_RESTORE`),
    FORM_RESTORED: type(`${CATEGORY} FORM_RESTORED`),
  };

  /**
   * Every action is comprised of at least a type and an optional
   * payload. Expressing actions as classes enables powerful
   * type checking in reducer functions.
   *
   * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
   */
  export class InitAction implements Action {
    type = ActionTypes.INIT;
    payload: string = null;
  }

  export class InitializedAction implements Action {
    type = ActionTypes.INITIALIZED;
    constructor(public payload: CreateLinkViewModel) { }
  }

  export class InitFailedAction implements Action {
    type = ActionTypes.INIT_FAILED;
    payload: string = null;
  }

  export class SubmitPageUrlAction implements Action {
    type = ActionTypes.SUBMIT_PAGE_URL;
    constructor(public payload: CreateLinkViewModel) { }
  }

  export class SubmitSetupBrandAction implements Action {
    type = ActionTypes.SUBMIT_SETUP_BRAND;
    constructor(public payload: CreateLinkViewModel) { }
  }

  export class SubmitSetupCtaAction implements Action {
    type = ActionTypes.SUBMIT_SETUP_CTA;
    constructor(public payload: CreateLinkViewModel) { }
  }

  export class SubmitSetupCtaResultAction implements Action {
    type = ActionTypes.SUBMIT_SETUP_CTA_RESULT;
    constructor(public payload: CreateLinkResultViewModel) { }
  }

  export class SetPageUrlPreviewAction implements Action {
    type = ActionTypes.SET_PAGE_URL_PREVIEW;
    constructor(public payload: string) { }
  }

  export type StepperTypes = 'choose-link' | 'setup-brand' | 'setup-cta' | 'share-link';
  export class SelectStepAction implements Action {
    type = ActionTypes.SELECT_STEP;
    constructor(public payload: StepperTypes) { }
  }
  export class SelectedStepAction implements Action {
    type = ActionTypes.SELECTED_STEP;
    constructor(public payload: StepperTypes) { }
  }

  export class NewLinkAction implements Action {
    type = ActionTypes.NEW_LINK;
    constructor(public payload?: undefined) { }
  }

  export class FormSaveAction implements Action {
    type = ActionTypes.FORM_SAVE;
    constructor(public payload?: undefined) { }
  }

  export class FormSavedAction implements Action {
    type = ActionTypes.FORM_SAVED;
    constructor(public payload?: undefined) { }
  }

  export class FormRestoreAction implements Action {
    type = ActionTypes.FORM_RESTORE;
    constructor(public payload?: undefined) { }
  }
  export class FormRestoredAction implements Action {
    type = ActionTypes.FORM_RESTORED;
    constructor(public payload?: undefined) { }
  }

  /**
   * Export a type alias of all actions in this action group
   * so that reducers can easily compose action types
   */
  // interface ActionWithPayload extends Action {
  //   type: string;
  //   payload: any;
  // }

  export type Actions
    = InitAction
    | InitializedAction
    | InitFailedAction
    | SubmitPageUrlAction
    | SubmitSetupBrandAction
    | SubmitSetupCtaAction
    | SubmitSetupCtaResultAction
    | SetPageUrlPreviewAction
    | SelectStepAction
    | FormSaveAction | FormSavedAction
    | FormRestoreAction | FormRestoredAction
    ;
}
