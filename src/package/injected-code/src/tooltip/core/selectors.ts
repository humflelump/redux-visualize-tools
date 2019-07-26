import { createSelector } from "reselect";
import { hoveredNode } from "../../graph/core/selectors";
import { windowWidth } from "../../window-dimensions/selectors";
import { State } from '../../store';
import { UINode } from "../../graph/types";
import { dimensions } from "../../graph/core/dimensions-selectors";

const WIDTH = 280;
const HEIGHT = 145;

export const tooltipPosition = createSelector(
    [hoveredNode, dimensions], (node, graphDimensions) => {
        if (!node) 
            return { left: 0, top: 0, width: 0, height: 0, showOnRight: true };
        const rightX = node.x + node.width;
        const graphRight = graphDimensions.left + graphDimensions.width;
        const showOnRight = rightX + WIDTH <= graphRight;
        let top = node.y + node.height / 2 - HEIGHT / 2;
        top = Math.max(0, top);
        let left = showOnRight 
            ? node.x + node.width 
            : node.x - WIDTH;
        left = Math.max(0, left);
        return {
            left,
            top,
            width: WIDTH,
            height: HEIGHT,
            showOnRight,
        };
    }
)
