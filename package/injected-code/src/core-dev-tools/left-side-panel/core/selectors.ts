import { IState } from '../../../store';
import { createSelector } from 'reselect';
import { LEFT_PANEL_WIDTH } from '../ui/constants';

const isLeftSidePanelOpen = (state: IState) =>
  state.LeftPanel.isLeftSidePanelOpen;

export const leftPanelEffectiveWidth = createSelector(
  [isLeftSidePanelOpen],
  open => {
    return open ? LEFT_PANEL_WIDTH : 0;
  }
);
