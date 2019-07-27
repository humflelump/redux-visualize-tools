import { AnyAction } from 'redux';

export const initialState = {
  isLeftSidePanelOpen: false,
};

export interface ILeftPanelState {
  isLeftSidePanelOpen: boolean;
}

export function LeftPanelReducer(
  state: ILeftPanelState = initialState,
  action: AnyAction
): ILeftPanelState {
  switch (action.type) {
    case 'TOGGLE_IF_LEFT_PANEL_OPEN':
      return {
        ...state,
        isLeftSidePanelOpen: action.bool,
      };
    default:
      return state;
  }
}
