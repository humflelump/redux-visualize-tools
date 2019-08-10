import { IState } from '../../store';
import { createSelector } from 'reselect';
import { createUiNodes } from './gen-renderable-graph';
import { scaleLinear, ScaleLinear } from 'd3';
import { keyBy, Dictionary } from 'lodash';
import { INode, IUINode, IRectangleBodyData, NODE_FILTER_TYPE } from '../types';
import { extractRectangleBodyData } from '../ui/functions';
import {
  getDependencies,
  getDependents,
  getRelatives,
  filterOutIsolatedNodes,
} from './functions';

const xTo = (state: IState) => state.Graph.xTo;
const xFrom = (state: IState) => state.Graph.xFrom;
const yTo = (state: IState) => state.Graph.yTo;
const yFrom = (state: IState) => state.Graph.yFrom;
const graphData = (state: IState) => state.CommChannel.graph;
const mousePosition = (state: IState) => state.Graph.mousePosition;
const clickedNodeId = (state: IState) => state.Graph.clickedNodeId;
const filter = (state: IState) => state.Graph.clickedNodeFilter;

function getXScale(xTo: number[], xFrom: number[]) {
  return scaleLinear()
    .domain(xFrom)
    .range(xTo);
}
export const xScale = createSelector(
  [xTo, xFrom],
  getXScale
);

export const scale = createSelector(
  [xScale],
  xScale => {
    const domain = xScale.domain();
    const range = xScale.range();
    const scale = (range[1] - range[0]) / (domain[1] - domain[0]);
    return scale;
  }
);

function getYScale(yTo: number[], yFrom: number[]) {
  return scaleLinear()
    .domain(yFrom)
    .range(yTo);
}
export const yScale = createSelector(
  [yTo, yFrom],
  getYScale
);

const nodeData = createSelector(
  [graphData],
  (data: any) => {
    const ids = Object.keys(data.nodes);
    return ids.map(id => data.nodes[id] as INode);
  }
);

const nodeDataWithoutLoneNodes = createSelector(
  [nodeData],
  filterOutIsolatedNodes
);

const filteredNodeData = createSelector(
  [nodeDataWithoutLoneNodes, filter, clickedNodeId],
  (data, filter, nodeId) => {
    if (!nodeId) {
      return data;
    } else if (filter === NODE_FILTER_TYPE.NO_FILTER) {
      return data;
    } else if (filter === NODE_FILTER_TYPE.DEPENENCIES) {
      return getDependencies(data, nodeId);
    } else if (filter === NODE_FILTER_TYPE.DEPENDENTS) {
      return getDependents(data, nodeId);
    } else if (filter === NODE_FILTER_TYPE.DEPENDENTS_AND_DEPENENCIES) {
      return getRelatives(data, nodeId);
    } else {
      throw new Error('Unexpected type');
    }
  }
);

const uiNodes = createSelector(
  [filteredNodeData],
  createUiNodes
);

export const scaledUiNodes = createSelector(
  [uiNodes, xScale, yScale],
  (uiNodes, xScale, yScale) => {
    const result = uiNodes.map(node => {
      return {
        ...node,
        x: xScale(node.x),
        y: yScale(node.y),
        width: xScale(node.width) - xScale(0),
        height: yScale(node.height) - yScale(0),
      };
    });
    return result as IUINode[];
  }
);

export const indexedUiNodes = createSelector(
  [scaledUiNodes],
  nodes => keyBy(nodes, d => d.data.id)
);

export const clickedNode = createSelector(
  [indexedUiNodes, clickedNodeId],
  (nodes, id) => {
    if (!id) {
      return null;
    }
    return nodes[id] || null;
  }
);

export const getRectangleData = createSelector(
  [graphData],
  graph => {
    return (node: IUINode) => {
      return extractRectangleBodyData(node, graph);
    };
  }
);

export const hoveredNode = createSelector(
  [scaledUiNodes, mousePosition],
  (nodes, mouse) => {
    if (!mouse) {
      return null;
    }
    const [x, y] = mouse;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (
        x >= node.x &&
        x <= node.x + node.width &&
        y >= node.y &&
        y <= node.y + node.height
      ) {
        return node;
      }
    }
    return null;
  }
);

export const selectedNode = createSelector(
  [clickedNode, hoveredNode],
  (clickedNode, hoveredNode) => {
    return hoveredNode || clickedNode;
  }
);
