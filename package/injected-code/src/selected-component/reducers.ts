import { ImmerReducer } from 'immer-reducer';
import { createActionCreators, createReducerFunction } from 'immer-reducer';

const initialState = {
  nodeIdToShowComponentFor: null as string | null,
};

type ISelectedComponentState = typeof initialState;

class SelectedComponentReducerClass extends ImmerReducer<
  ISelectedComponentState
> {
  setComponentNode(id: string | null) {
    this.draftState.nodeIdToShowComponentFor = id;
  }
}

export const SelectedComponentActions = createActionCreators(
  SelectedComponentReducerClass
);
export const SelectedComponentReducer = createReducerFunction(
  SelectedComponentReducerClass,
  initialState
);
