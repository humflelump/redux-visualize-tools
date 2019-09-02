import { ImmerReducer } from 'immer-reducer';
import { createActionCreators, createReducerFunction } from 'immer-reducer';

const initialState = {
  userSelectedAction: null as number | null,
};

export type IStateAnalysisState = typeof initialState;

export class StateAnalysisClass extends ImmerReducer<IStateAnalysisState> {
  selectAction(actionNumber: number) {
    this.draftState.userSelectedAction = actionNumber;
  }
}

export const StateAnalysisActions = createActionCreators(StateAnalysisClass);
export const StateAnalysisReducer = createReducerFunction(
  StateAnalysisClass,
  initialState
);
