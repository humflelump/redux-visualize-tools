import { windowWidth, windowHeight } from '../../window-dimensions/selectors';
import { effectiveRightPanelWidth } from '../../side-panel/core/selectors';
import { createSelector } from 'reselect';
import { IState } from '../../store';
import { LEFT_PANEL_WIDTH } from '../../core-dev-tools/left-side-panel/ui/constants';

const isLeftPanelOpen = (state: IState) => state.LeftPanel.isLeftSidePanelOpen;

const leftPanelWidth = createSelector(
  [isLeftPanelOpen],
  open => (open ? LEFT_PANEL_WIDTH : 0)
);

export const dimensions = createSelector(
  [windowWidth, windowHeight, effectiveRightPanelWidth, leftPanelWidth],
  (width, height, rightPanelWidth, leftPanelWidth) => {
    return {
      left: leftPanelWidth,
      top: 0,
      width: width - rightPanelWidth - leftPanelWidth,
      height,
    };
  }
);
