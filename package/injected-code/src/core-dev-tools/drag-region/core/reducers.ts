import { ImmerReducer } from 'immer-reducer';
import { createActionCreators, createReducerFunction } from 'immer-reducer';
import { LEFT_PANEL_TABS, TAB_OPTIONS } from '../types';

const initialState = {
  selectedTab: TAB_OPTIONS[0],
  dividerTop: 0.5,
};

type ILeftPanelDragRegion = typeof initialState;

class DragRegionReducerClass extends ImmerReducer<ILeftPanelDragRegion> {
  setLeftPanelTab(tab: LEFT_PANEL_TABS) {
    this.draftState.selectedTab = tab;
  }

  setDragFraction(fraction: number) {
    this.draftState.dividerTop = fraction;
  }
}

export const DragRegionActions = createActionCreators(DragRegionReducerClass);
export const DragRegionReducer = createReducerFunction(
  DragRegionReducerClass,
  initialState
);
