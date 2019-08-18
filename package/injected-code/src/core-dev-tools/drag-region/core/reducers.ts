import { AnyAction } from 'redux';
import { LEFT_PANEL_TABS, TAB_OPTIONS } from '../types';

export interface ILeftPanelDragRegion {
  selectedTab: LEFT_PANEL_TABS;
  dividerTop: number;
}

const initialState: ILeftPanelDragRegion = {
  selectedTab: TAB_OPTIONS[0],
  dividerTop: 0.5,
};

export function DragRegionReducer(
  state: ILeftPanelDragRegion = initialState,
  action: AnyAction
): ILeftPanelDragRegion {
  switch (action.type) {
    case 'SET_LEFT_PANEL_TAB':
      return { ...state, selectedTab: action.tab };
    case 'SET_DRAG_HEIGHT_FRACTION':
      return { ...state, dividerTop: action.top };
    default:
      return state;
  }
}
