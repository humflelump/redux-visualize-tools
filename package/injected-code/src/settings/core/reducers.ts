import { ImmerReducer } from 'immer-reducer';
import { createActionCreators, createReducerFunction } from 'immer-reducer';

const initialState = {};

type ISettingsState = typeof initialState;

class SettingsReducerClass extends ImmerReducer<ISettingsState> {}

export const SettingsActions = createActionCreators(SettingsReducerClass);
export const SettingsReducer = createReducerFunction(
  SettingsReducerClass,
  initialState
);
