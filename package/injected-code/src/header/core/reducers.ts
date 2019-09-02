import { ImmerReducer } from 'immer-reducer';
import { createActionCreators, createReducerFunction } from 'immer-reducer';
import { HEADER_TAB_OPTIONS, HEADER_TABS } from '../types';

const initialState = {
  headerTab: HEADER_TAB_OPTIONS[0],
};

type IHeaderState = typeof initialState;

class HeaderReducerClass extends ImmerReducer<IHeaderState> {
  setHeaderTab(tab: HEADER_TABS) {
    this.draftState.headerTab = tab;
  }
}

export const HeaderActions = createActionCreators(HeaderReducerClass);
export const HeaderReducer = createReducerFunction(
  HeaderReducerClass,
  initialState
);
