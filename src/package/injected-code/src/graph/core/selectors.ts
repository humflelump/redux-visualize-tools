import { State } from '../../store';
import { createSelector } from 'reselect';
import { createUiNodes, UINode } from './gen-renderable-graph';
import * as d3 from 'd3';
import { keyBy, Dictionary } from 'lodash';

export interface NodeMetadata {
    description?: string,
    file?: string,
}

export interface Action {
    userAction: any,
    actionNumber: number,
};

export enum NODE_TYPES {
    RESELECT_SELECTOR = 'RESELECT_SELECTOR',
    ASYNC_SELECTOR = 'ASYNC_SELECTOR',
    CONNECT = 'CONNECT',
    REACT_COMPONENT = 'REACT_COMPONENT',
    STATE_VARIABLE = 'STATE_VARIABLE',
    FUNCTION = 'FUNCTION',
}

export interface Node {
    id: string,
    metadata: NodeMetadata,
    dependencies: Node[],
    value: any,
    duration?: number,
    type: NODE_TYPES,
    name: string,
    action?: Action,
}

const xTo = (state: State) => state.Graph.xTo;
const xFrom = (state: State) => state.Graph.xFrom;
const yTo = (state: State) => state.Graph.yTo;
const yFrom = (state: State) => state.Graph.yFrom;
const windowWidth = (state: State) => state.Window.width;
const windowHeight = (state: State) => state.Window.height;
const graphData = (state: State) => state.CommChannel.graph;

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

export const indexedUiNodes = createSelector(
    [scaledUiNodes], nodes => keyBy(nodes, d => d.data.id)
);





