import {ActionReducerMap} from "@ngrx/store";
import {routerReducer, RouterReducerState} from "@ngrx/router-store";
import {DBSchema} from "@ngrx/db";
import {RouterStateUrl} from "./shared/utils";

export interface State {
  router: RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  router: routerReducer,
};

export const schema: DBSchema = {
  version: 1,
  name: 'jeitin_app',
  stores: {
    books: {
      autoIncrement: true,
      primaryKey: 'id',
    },
  },
};
