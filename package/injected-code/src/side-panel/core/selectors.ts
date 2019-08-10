import { IState } from '../../store';
import { createSelector } from 'reselect';
import { clickedNode } from '../../graph/core/selectors';
import { IUINode } from '../../graph/types';
import { WIDTH } from '../ui/constants';

export const isRightSidePanelOpen = createSelector(
  [clickedNode],
  node => node !== null
);

export const effectiveRightPanelWidth = createSelector(
  [isRightSidePanelOpen],
  open => {
    return open ? WIDTH : 0;
  }
);
