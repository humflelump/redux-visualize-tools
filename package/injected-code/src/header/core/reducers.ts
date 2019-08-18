import { AnyAction } from 'redux';
import { HEADER_TAB_OPTIONS, HEADER_TABS } from '../types';

export const initialState = {
  headerTab: HEADER_TAB_OPTIONS[0],
};

export interface IHeaderState {
  headerTab: HEADER_TABS;
}

export function HeaderReducer(
  state: IHeaderState = initialState,
  action: AnyAction
): IHeaderState {
  switch (action.type) {
    case 'SET_HEADER_TAB':
      return { ...state, headerTab: action.tab };
    default:
      return state;
  }
}
