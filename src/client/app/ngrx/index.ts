import { Observable } from 'rxjs/Observable';
import {ActionReducer, MetaReducer, select, State, Store} from '@ngrx/store';
import 'deep-freeze-strict';
import { storeFreeze } from 'ngrx-store-freeze';
import * as fromHome from '../home/index';
import { DBSchema } from '@ngrx/db';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface IAppState {
  linkCreate: fromHome.IHomeState;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
export const reducers = {
  linkCreate: fromHome.reducer
};


export function getLinkCreate(state$: Store<IAppState>): Observable<fromHome.IHomeState> {
  return state$.select(s => s.linkCreate);
}

// console.log all actions
export function logger(reducer: ActionReducer<IAppState>): ActionReducer<IAppState> {
  return function(state: IAppState, action: any): IAppState {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<IAppState>[] = (String('<%= BUILD_TYPE %>') === 'dev')
  ? [logger, storeFreeze]
  : [];

/**
 * ngrx/db uses a simple schema config object to initialize stores in IndexedDB.
 */
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
