import {Action} from "@ngrx/store";
import {type} from "../shared/type";


export namespace Auth {

  // Category to uniquely identify the actions
  export const CATEGORY = 'Auth';

  /**
   * For each action type in an action group, make a simple
   * enum object for all of this group's action types.
   *
   * The 'type' utility function coerces strings into string
   * literal types and runs a simple check to guarantee all
   * action types in the application are unique.
   */
  export interface IHomeActions {
    LOGIN: string;
    LOGIN_DONE: string;
    HANDLE_AUTHENTICATION: string;
    HANDLE_AUTHENTICATION_DONE: string;
  }

  export const ActionTypes: IHomeActions = {
    LOGIN: type(`${CATEGORY} LOGIN`),
    LOGIN_DONE: type(`${CATEGORY} LOGIN_DONE`),
    HANDLE_AUTHENTICATION: type(`${CATEGORY} HANDLE_AUTHENTICATION`),
    HANDLE_AUTHENTICATION_DONE: type(`${CATEGORY} HANDLE_AUTHENTICATION_DONE`),
  };

  /*
  *
  *
  * */
  export class LoginAction implements Action {
    type = ActionTypes.LOGIN;
  }
  export class LoginDoneAction implements Action {
    type = ActionTypes.LOGIN_DONE;
  }

  export class HandleAuthenticationAction implements Action {
    type = ActionTypes.HANDLE_AUTHENTICATION;
  }
  export class HandleAuthenticationDoneAction implements Action {
    type = ActionTypes.HANDLE_AUTHENTICATION_DONE;
  }

  export type Actions
    = LoginAction
    | LoginDoneAction
    | HandleAuthenticationAction
    | HandleAuthenticationDoneAction;
}
