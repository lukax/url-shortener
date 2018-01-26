import { IHomeState, sampleInitialState } from '../states/index';
import { LinkCreate } from '../actions/index';

export function reducer(
  state: IHomeState = sampleInitialState,
  // could support multiple state actions via union type here
  // ie: NameList.Actions | Other.Actions
  // the seed's example just has one set of actions: NameList.Actions
  action: LinkCreate.Actions
): IHomeState {
  switch (action.type) {
    case LinkCreate.ActionTypes.INITIALIZED:
      return (<any>Object).assign({}, state, {
        names: action.payload
      });

    case LinkCreate.ActionTypes.NAME_ADDED:
      return (<any>Object).assign({}, state, {
        names: [...state.names, action.payload]
      });

    default:
      return state;
  }
}
