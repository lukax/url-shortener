import {combineReducers} from "@ngrx/store";
import {Auth} from "./auth.actions";

export function reducer(_s: any, _a: any) {
  return combineReducers({
    user(s = {}, a: Auth.Actions) {
      return s;
    },

  })(_s, _a);
}
