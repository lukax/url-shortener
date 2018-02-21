import { createFormGroupReducerWithUpdate, createFormGroupState, FormGroupState, validate } from 'ngrx-forms';
import { required,pattern } from 'ngrx-forms/validation';
import {CreateLinkViewModel, LinkViewModel} from "../../shared/models";
import {LinkCreate} from "./link-create.actions";
import {State as RootState} from "../../app.reducer";
import {combineReducers} from "@ngrx/store";
import {URL_REGEXP} from "../../shared/utils";
import {DBSchema} from "@ngrx/db";

export interface State extends RootState {
  linkCreate: {
    chooseLinkForm: FormGroupState<CreateLinkViewModel>,
    setupBrandForm: FormGroupState<CreateLinkViewModel>,
    setupCtaForm: FormGroupState<CreateLinkViewModel>
    shortPageUrl: string,
    previewPageUrl: string,
    errorMessage: string,
    stepper: LinkCreate.StepperTypes,
    isCompleted: boolean
  };
}

export const CHOOSE_LINK_INITIAL_STATE = createFormGroupState<CreateLinkViewModel>('chooseLinkForm', {
  pageUrl: ''
});
export const SETUP_BRAND_INITIAL_STATE = createFormGroupState<CreateLinkViewModel>('setupBrandForm', {
  name: '',
  message: '',
});
export const SETUP_CTA_INITIAL_STATE = createFormGroupState<CreateLinkViewModel>('setupCtaForm', {
  buttonText: '',
  buttonUrl: ''
});
const CTA_INITIAL_STATE: LinkViewModel = {
  name: 'Título para sua chamada',
  message: 'Uma descrição para sua "chamada"',
  buttonUrl: '',
  buttonText: 'Texto do botão',
};
const STEPPER_INITIAL_STATE: LinkCreate.StepperTypes = 'choose-link';

const chooseLinkFormGroupReducerWithUpdate = createFormGroupReducerWithUpdate<CreateLinkViewModel>({
  pageUrl: validate([required, pattern(URL_REGEXP)]),
});
const setupBrandFormGroupReducerWithUpdate = createFormGroupReducerWithUpdate<CreateLinkViewModel>({
  name: validate([required]),
});
const setupCtaFormGroupReducerWithUpdate = createFormGroupReducerWithUpdate<CreateLinkViewModel>({
  message: validate([required]),
  buttonText: validate([required]),
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
        return `${window.location.protocol}//${window.location.host}/${(a.payload.hash != null ? a.payload.hash : '')}`;
      }
      return s;
    },
    errorMessage(s = '', a: LinkCreate.SubmitSetupCtaResultAction) {
      if(a.type === LinkCreate.ActionTypes.SUBMIT_SETUP_CTA_RESULT) {
        return a.payload.message;
      }
      return s;
    },
    stepper(s = STEPPER_INITIAL_STATE, a: LinkCreate.Actions) {
      switch(a.type) {
        case LinkCreate.ActionTypes.SELECT_STEP:
        case LinkCreate.ActionTypes.SELECTED_STEP:
          return a.payload;
        default:
          return s;
      }
    },
    previewPageUrl(s: string = null, a: LinkCreate.Actions) {
      switch (a.type) {
        case LinkCreate.ActionTypes.SET_PAGE_URL_PREVIEW:
          return a.payload;
        default:
          return s;
      }
    },
    completed(s = false, a: LinkCreate.Actions) {
      switch(a.type) {
        case LinkCreate.ActionTypes.SUBMIT_SETUP_CTA_RESULT:
          return true;
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
export const getStepper = (state: State) => state.linkCreate.stepper;
export const getErrorMessage = (state: State) => state.linkCreate.errorMessage;
export const getPreviewPageUrl = (state: State) => state.linkCreate.previewPageUrl;
export const getIsCompleted = (state: State) => state.linkCreate.isCompleted;
export const getCta = (state: State): CreateLinkViewModel => ({
  pageUrl: state.linkCreate.chooseLinkForm.value.pageUrl,
  name: state.linkCreate.setupBrandForm.value.name,
  message: state.linkCreate.setupBrandForm.value.message,
  buttonText: state.linkCreate.setupCtaForm.value.buttonText,
  buttonUrl: state.linkCreate.setupCtaForm.value.buttonUrl,
});
