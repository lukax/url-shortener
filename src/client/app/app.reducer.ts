import {ActionReducer, ActionReducerMap, MetaReducer} from "@ngrx/store";
import {routerReducer, RouterReducerState} from "@ngrx/router-store";
import {DBSchema} from "@ngrx/db";
import {RouterStateUrl} from "./shared/utils";
import {localStorageSync} from "ngrx-store-localstorage";

export interface State {
  router: RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  router: routerReducer,
};


export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['linkCreate']})(reducer);
}
export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
