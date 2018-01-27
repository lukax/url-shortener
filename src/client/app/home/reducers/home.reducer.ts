import { LinkCreate } from '../actions/index';
import {LinkCreateDto} from "../../core/index";

export interface IHomeState {
  linkCreate: LinkCreateDto;
}

export const initialState: IHomeState = {
  linkCreate: new LinkCreateDto()
};

export function reducer(
  state: IHomeState = initialState,
  // could support multiple state actions via union type here
  // ie: NameList.Actions | Other.Actions
  // the seed's example just has one set of actions: NameList.Actions
  action: LinkCreate.Actions
): IHomeState {
  switch (action.type) {
    case LinkCreate.ActionTypes.INITIALIZED:
      return Object.assign({}, state, {
        linkCreate: action.payload
      });

    case LinkCreate.ActionTypes.CHOOSE_PAGE_LINK:
      return Object.assign({}, state, {
        linkCreate: Object.assign(state.linkCreate, {}, action.payload, {loading: true})
      });

    case LinkCreate.ActionTypes.CHOOSE_PAGE_LINK_SUCCESS:
    case LinkCreate.ActionTypes.SETUP_BRAND:
    case LinkCreate.ActionTypes.SETUP_CTA_SUCCESS:
      return Object.assign({}, state, {
        linkCreate: Object.assign(state.linkCreate, {}, action.payload, {loading: false})
      });


    //
    // case LinkCreate.ActionTypes.NAME_ADDED:
    //   return (<any>Object).assign({}, state, {
    //     names: [...state.names, action.payload]
    //   });

    default:
      return state;
  }
}

export const getLinkCreate = (state: IHomeState) => state.linkCreate;
