import { State } from '../../store';
import { createSelector } from 'reselect';
import { windowWidth, windowHeight } from '../../window-dimensions/selectors';
import { hoveredNode, selectedNode, clickedNode } from '../../graph/core/selectors';
import { UINode } from '../../graph/types';
import { WIDTH } from '../ui/constants';

export const isRightSidePanelOpen = createSelector(
    [clickedNode], node => node !== null
);

export const effectiveRightPanelWidth = createSelector(
    [isRightSidePanelOpen], (open) => {
        return open ? WIDTH : 0;
    }
)