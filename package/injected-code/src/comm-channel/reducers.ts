import { ImmerReducer } from 'immer-reducer';
import { createActionCreators, createReducerFunction } from 'immer-reducer';

const initialState = {
  graph: null as any | null,
};

type ICommChannelState = typeof initialState;

class CommChannelReducerClass extends ImmerReducer<ICommChannelState> {
  setGraph(graph: any) {
    this.draftState.graph = graph;
  }
}

export const CommChannelActions = createActionCreators(CommChannelReducerClass);
export const CommChannelReducer = createReducerFunction(
  CommChannelReducerClass,
  initialState
);
