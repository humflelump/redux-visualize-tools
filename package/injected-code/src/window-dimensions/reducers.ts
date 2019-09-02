import { ImmerReducer } from 'immer-reducer';
import { createActionCreators, createReducerFunction } from 'immer-reducer';

const initialState = {
  width: window.innerWidth,
  height: window.innerHeight,
};

type WindowState = typeof initialState;

class DimensionsReducer extends ImmerReducer<WindowState> {
  setDimensions(width: number, height: number) {
    this.draftState.width = width;
    this.draftState.height = height;
  }
}

export const WindowActions = createActionCreators(DimensionsReducer);
export const WindowReducer = createReducerFunction(
  DimensionsReducer,
  initialState
);
