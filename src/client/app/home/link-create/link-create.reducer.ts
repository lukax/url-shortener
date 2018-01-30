import { createFormGroupReducerWithUpdate, createFormGroupState, FormGroupState, validate } from 'ngrx-forms';
import { required,pattern } from 'ngrx-forms/validation';
import {CreateLinkDto} from "../../shared/entities";
import {LinkCreate} from "./link-create.actions";
import {State as RootState} from "../../app.reducer";
import {combineReducers} from "@ngrx/store";
import {URL_REGEXP} from "../../shared/utils";

export interface State extends RootState {
  linkCreate: {
    chooseLinkForm: FormGroupState<CreateLinkDto>,
    setupBrandForm: FormGroupState<CreateLinkDto>,
    setupCtaForm: FormGroupState<CreateLinkDto>
    shortPageUrl: string,
    cta: CreateLinkDto
  };
}

const CHOOSE_LINK_INITIAL_STATE = createFormGroupState<CreateLinkDto>('chooseLinkForm', {
  pageUrl: ''
});
const SETUP_BRAND_INITIAL_STATE = createFormGroupState<CreateLinkDto>('setupBrandForm', {
  name: '',
});
const SETUP_CTA_INITIAL_STATE = createFormGroupState<CreateLinkDto>('setupCtaForm', {
  message: '',
  buttonText: '',
  buttonUrl: ''
});
const CTA_INITIAL_STATE = {
  name: 'A nice attention grabbing header!',
  message: 'A descriptive sentence for the Call To Action (CTA)',
  buttonUrl: '',
  buttonText: 'CONTACT US NOW!',
};

const chooseLinkFormGroupReducerWithUpdate = createFormGroupReducerWithUpdate<CreateLinkDto>({
  pageUrl: validate([required,pattern(URL_REGEXP)]),
});
const setupBrandFormGroupReducerWithUpdate = createFormGroupReducerWithUpdate<CreateLinkDto>({
  name: validate(required),
});
const setupCtaFormGroupReducerWithUpdate = createFormGroupReducerWithUpdate<CreateLinkDto>({
  message: validate(required),
  buttonText: validate(required),
  buttonUrl: validate([required, pattern(URL_REGEXP)]),
});

export function reducer(_s: any, _a: any) {
  return combineReducers({
    chooseLinkForm(s = CHOOSE_LINK_INITIAL_STATE, a: LinkCreate.Actions) {
      return chooseLinkFormGroupReducerWithUpdate(s, a);
    },
    setupBrandForm(s = SETUP_BRAND_INITIAL_STATE, a: LinkCreate.Actions) {
      return setupBrandFormGroupReducerWithUpdate(s, a);
    },
    setupCtaForm(s = SETUP_CTA_INITIAL_STATE, a: LinkCreate.Actions) {
      return setupCtaFormGroupReducerWithUpdate(s, a);
    },
    shortPageUrl(s = '', a: LinkCreate.SubmitSetupCtaResultAction) {
      if(a.type === LinkCreate.ActionTypes.SUBMIT_SETUP_CTA_RESULT) {
        return a.payload;
      }
      return s;
    },
    cta(s = CTA_INITIAL_STATE, a: LinkCreate.Actions) {
      switch (a.type) {
        case LinkCreate.ActionTypes.SUBMIT_PAGE_URL:
        case LinkCreate.ActionTypes.SUBMIT_SETUP_BRAND:
        case LinkCreate.ActionTypes.SUBMIT_SETUP_CTA:
          return Object.assign({}, s, a.payload);
        default:
          return s;
      }
    }

    // searchResults(s: string[] = [], a: Action) {
    //   if (a.type === SetSearchResultAction.TYPE) {
    //     return (a as SetSearchResultAction).results;
    //   }
    //
    //   return s;
    // },
  })(_s, _a);
}


export const getChooseLinkForm = (state: State) => state.linkCreate.chooseLinkForm;
export const getSetupBrandForm = (state: State) => state.linkCreate.setupBrandForm;
export const getSetupCtaForm = (state: State) => state.linkCreate.setupCtaForm;
export const getShortPageUrl = (state: State) => state.linkCreate.shortPageUrl;
export const getCta = (state: State) => state.linkCreate.cta;
