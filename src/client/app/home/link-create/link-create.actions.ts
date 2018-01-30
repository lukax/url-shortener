import { Action } from '@ngrx/store';
import {CreateLinkDto, CreateLinkResultDto} from "../../shared/entities";
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
    constructor(public payload: CreateLinkDto) { }
  }

  export class InitFailedAction implements Action {
    type = ActionTypes.INIT_FAILED;
    payload: string = null;
  }

  export class SubmitPageUrlAction implements Action {
    type = ActionTypes.SUBMIT_PAGE_URL;
    constructor(public payload: CreateLinkDto) { }
  }

  export class SubmitSetupBrandAction implements Action {
    type = ActionTypes.SUBMIT_SETUP_BRAND;
    constructor(public payload: CreateLinkDto) { }
  }

  export class SubmitSetupCtaAction implements Action {
    type = ActionTypes.SUBMIT_SETUP_CTA;
    constructor(public payload: CreateLinkDto) { }
  }

  export class SubmitSetupCtaResultAction implements Action {
    type = ActionTypes.SUBMIT_SETUP_CTA_RESULT;
    constructor(public payload: CreateLinkResultDto) { }
  }

  export class SetPageUrlPreviewAction implements Action {
    type = ActionTypes.SET_PAGE_URL_PREVIEW;
    constructor(public payload: CreateLinkDto) { }
  }

  export class SelectStepAction implements Action {
    type = ActionTypes.SELECT_STEP;
    constructor(public payload: 'choose-link' | 'setup-brand' | 'setup-cta' | 'share-link') { }
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
    | SelectStepAction;
}
