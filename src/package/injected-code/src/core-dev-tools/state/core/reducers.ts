import { AnyAction } from 'redux';
import { IAction } from '../../../graph/types';

export interface IStateAnalysisState {
  userSelectedAction: IAction | null;
}

const initialState: IStateAnalysisState = {
  userSelectedAction: null,
};

export function StateAnalysisReducer(
  state: IStateAnalysisState = initialState,
  action: AnyAction
): IStateAnalysisState {
  switch (action.type) {
    case 'SET_SELECTED_ACTION':
      return { ...state, userSelectedAction: action.action };
    case 'CLEAR_SELECTED_ACTION':
      return { ...state, userSelectedAction: null };
    default:
      return state;
  }
}
