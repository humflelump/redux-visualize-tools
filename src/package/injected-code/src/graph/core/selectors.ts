import { State } from '../../store';
import { createSelector } from 'reselect';
import { createUiNodes, } from './gen-renderable-graph';
import * as d3 from 'd3';
import { keyBy, Dictionary } from 'lodash';
import { Node, UINode, RectangleBodyData } from '../types';
import { extractRectangleBodyData } from '../ui/functions';



const xTo = (state: State) => state.Graph.xTo;
const xFrom = (state: State) => state.Graph.xFrom;
const yTo = (state: State) => state.Graph.yTo;
const yFrom = (state: State) => state.Graph.yFrom;
const windowWidth = (state: State) => state.Window.width;
const windowHeight = (state: State) => state.Window.height;
const graphData = (state: State) => state.CommChannel.graph;
const mousePosition = (state: State) => state.Graph.mousePosition;


export const dimensions = createSelector(
    [windowWidth, windowHeight], (width, height) => {
        return {
            left: 0,
            top: 0,
            width,
            height,
        };
    }
);

function getXScale(xTo: number[], xFrom: number[]) {
    return d3.scaleLinear().domain(xFrom).range(xTo);
}
export const xScale = createSelector([xTo, xFrom], getXScale);

export const scale = createSelector(
    [xScale], (xScale) => {
        const domain = xScale.domain();
        const range = xScale.range();
        const scale = (range[1] - range[0]) / (domain[1] - domain[0]);
        return scale;
    }
);

function getYScale(yTo: number[], yFrom: number[]) {
    return d3.scaleLinear().domain(yFrom).range(yTo);
}
export const yScale = createSelector([yTo, yFrom], getYScale);


const nodeData = createSelector(
    [graphData], (data: any) => {
        const ids = Object.keys(data.nodes);
        return ids.map(id => data.nodes[id] as Node);
    }
);

const uiNodes = createSelector(
    [nodeData], createUiNodes
);

export const scaledUiNodes = createSelector(
    [uiNodes, xScale, yScale], (uiNodes, xScale, yScale) => {
        const result = uiNodes.map((node) => {
            return {
                ...node,
                x: xScale(node.x),
                y: yScale(node.y),
                width: xScale(node.width) - xScale(0),
                height: yScale(node.height) - yScale(0),
            }
        });
        return result as UINode[];
    }
);

export const getRectangleData = createSelector(
    [graphData], (graph) => {
        return (node: UINode) => {
            return extractRectangleBodyData(node, graph);
        }
    }
)

export const hoveredNode = createSelector(
    [scaledUiNodes, mousePosition], (nodes, mouse) => {
        if (!mouse) return null;
        const [x, y] = mouse;
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (x >= node.x && x <= node.x + node.width && y >= node.y && y <= node.y + node.height) {
                return node;
            }
        }
        return null;
    }
)

export const indexedUiNodes = createSelector(
    [scaledUiNodes], nodes => keyBy(nodes, d => d.data.id)
);





