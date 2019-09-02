import { ImmerReducer } from 'immer-reducer';
import { createActionCreators, createReducerFunction } from 'immer-reducer';

export const initialState = {
  isLeftSidePanelOpen: false,
};

export type ILeftPanelState = typeof initialState;

export class LeftPanelReducerClass extends ImmerReducer<ILeftPanelState> {
  toggleIfPanelOpen() {
    this.draftState.isLeftSidePanelOpen = !this.draftState.isLeftSidePanelOpen;
  }
}

export const LeftPanelActions = createActionCreators(LeftPanelReducerClass);
export const LeftPanelReducer = createReducerFunction(
  LeftPanelReducerClass,
  initialState
);
