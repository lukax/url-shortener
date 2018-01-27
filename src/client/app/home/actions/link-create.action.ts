import { Action } from '@ngrx/store';
import {LinkCreateDto, type} from '../../core/index';

/**
 * Each action should be namespaced
 * this allows the interior to have similar typed names as other actions
 * however still allow index exports
 */
export namespace LinkCreate {
  // Category to uniquely identify the actions
  export const CATEGORY: string = 'LinkCreate';

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

    CHOOSE_PAGE_LINK: string;
    CHOOSE_PAGE_LINK_SUCCESS: string;

    SETUP_BRAND: string;
    SETUP_CTA: string;
    SETUP_CTA_SUCCESS: string;

  }

  export const ActionTypes: IHomeActions = {
    INIT: type(`${CATEGORY} Init`),
    INITIALIZED: type(`${CATEGORY} Initialized`),
    INIT_FAILED: type(`${CATEGORY} Init Failed`),

    CHOOSE_PAGE_LINK: type(`${CATEGORY} Choose page link`),
    CHOOSE_PAGE_LINK_SUCCESS: type(`${CATEGORY} Choose page link`),
    SETUP_BRAND: type(`${CATEGORY} Setup brand`),
    SETUP_CTA: type(`${CATEGORY} Setup CTA`),
    SETUP_CTA_SUCCESS: type(`${CATEGORY} Setup CTA success`),
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
    constructor(public payload: LinkCreateDto) { }
  }

  export class InitFailedAction implements Action {
    type = ActionTypes.INIT_FAILED;
    payload: string = null;
  }

  export class ChoosePageLinkAction implements Action {
    type = ActionTypes.CHOOSE_PAGE_LINK;
    constructor(public payload: LinkCreateDto) { }
  }

  export class ChoosePageLinkSuccessAction implements Action {
    type = ActionTypes.CHOOSE_PAGE_LINK_SUCCESS;
    constructor(public payload: LinkCreateDto) { }
  }

  export class SetupBrandAction implements Action {
    type = ActionTypes.SETUP_BRAND;
    constructor(public payload: LinkCreateDto) { }
  }

  export class SetupCtaAction implements Action {
    type = ActionTypes.SETUP_CTA;
    constructor(public payload: LinkCreateDto) { }
  }

  export class SetupCtaSuccessAction implements Action {
    type = ActionTypes.SETUP_CTA_SUCCESS;
    constructor(public payload: LinkCreateDto) { }
  }

  /**
   * Export a type alias of all actions in this action group
   * so that reducers can easily compose action types
   */
  export type Actions
    = InitAction
    | InitializedAction
    | InitFailedAction
    | ChoosePageLinkAction
    | SetupBrandAction
    | SetupCtaAction;
}
