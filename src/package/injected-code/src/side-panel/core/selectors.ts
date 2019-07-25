import { State } from '../../store';
import { createSelector } from 'reselect';
import { windowWidth, windowHeight } from '../../window-dimensions/selectors';
import { hoveredNode, selectedNode } from '../../graph/core/selectors';
import { UINode } from '../../graph/types';
import { WIDTH } from '../ui/constants';

export const showPanelOnRight = createSelector(
    [selectedNode, windowWidth, windowHeight], 
    (node, windowWidth, windowHeight) => {
        if (!node) return true;
        const center = node.x + node.width / 2;
        if (center < windowWidth - WIDTH) {
            return true;
        } else {
            return center < WIDTH;
        }
    }
);

export const isVisible = createSelector(
    [selectedNode], node => node !== null
);