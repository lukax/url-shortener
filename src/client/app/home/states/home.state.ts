import { Observable } from 'rxjs/Observable';

export interface IHomeState {
  names: Array<string>;
}

export const sampleInitialState: IHomeState = {
  names: <Array<string>>[]
};

// selects specific slice from sample state
export function getNames(state$: Observable<IHomeState>) {
  return state$.select(state => state.names);
}
