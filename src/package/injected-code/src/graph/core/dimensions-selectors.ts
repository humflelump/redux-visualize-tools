import { windowWidth, windowHeight } from '../../window-dimensions/selectors';
import { effectiveRightPanelWidth } from '../../side-panel/core/selectors';
import { createSelector } from 'reselect';
import { IState } from '../../store';

export const dimensions = createSelector(
  [windowWidth, windowHeight, effectiveRightPanelWidth],
  (width, height, rightPanelWidth) => {
    return {
      left: 0,
      top: 0,
      width: width - rightPanelWidth,
      height,
    };
  }
);
