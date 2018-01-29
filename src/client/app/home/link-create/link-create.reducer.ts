import { createFormGroupReducerWithUpdate, createFormGroupState, FormGroupState, validate } from 'ngrx-forms';
import { greaterThan, required,pattern } from 'ngrx-forms/validation';
import {CreateLinkDto} from "../../shared/entities";
import {LinkCreate} from "./link-create.actions";
import {State as RootState} from "../../app.reducer";
import {combineReducers} from "@ngrx/store";

export interface State extends RootState {
  linkCreate: {
    formState: FormGroupState<CreateLinkDto>,
    shortPageUrl: string,
  };
}

const FORM_ID = 'link-create-form';
const INITIAL_STATE = createFormGroupState<CreateLinkDto>(FORM_ID, new CreateLinkDto());

const URL_REGEXP = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

const formGroupReducerWithUpdate = createFormGroupReducerWithUpdate<CreateLinkDto>({
  buttonText: validate(required),
  message: validate(required),
  name: validate(required),
  buttonUrl: validate([required, pattern(URL_REGEXP)]),
  pageUrl: validate([required,pattern(URL_REGEXP)]),
});

export function reducer(_s: any, _a: any) {
  return combineReducers({
    formState(s = INITIAL_STATE, a: LinkCreate.Actions) {
      return formGroupReducerWithUpdate(s, a);
    },
    shortPageUrl(s = '', a: LinkCreate.SetupCtaSuccessAction) {
      if(a.type === LinkCreate.ActionTypes.SETUP_CTA_SUCCESS) {
        return a.payload;
      }
      return s;
    }
    // searchResults(s: string[] = [], a: Action) {
    //   if (a.type === SetSearchResultAction.TYPE) {
    //     return (a as SetSearchResultAction).results;
    //   }
    //
    //   return s;
    // },
  })(_s, _a);
};


export const getLinkCreateForm = (state: State) => state.linkCreate.formState;
