import { IState } from '../../store';
import { createSelector } from 'reselect';
import { scaleLinear, ScaleLinear } from 'd3';
import { keyBy, Dictionary, isEqual } from 'lodash';
import { INode, IUINode, IRectangleBodyData, NODE_FILTER_TYPE } from '../types';
import { extractRectangleBodyData } from '../ui/functions';
import {
  getDependencies,
  getDependents,
  getRelatives,
  filterOutIsolatedNodes,
  updateNodeData,
  isGraphShapeDifferent,
} from './functions';
import createAsyncSelector from 'async-selector';
import { asyncGraphRender } from '../../gen-graph-layout';

export const xTo = (state: IState) => state.Graph.xTo;
export const xFrom = (state: IState) => state.Graph.xFrom;
export const yTo = (state: IState) => state.Graph.yTo;
export const yFrom = (state: IState) => state.Graph.yFrom;
const graphData = (state: IState) => state.CommChannel.graph;
const mousePosition = (state: IState) => state.Graph.mousePosition;
const clickedNodeId = (state: IState) => state.Graph.clickedNodeId;
const filter = (state: IState) => state.Graph.nodeFilter;

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
    if (!data) {
      return [] as INode[];
    }
    const ids = Object.keys(data.nodes);
    return ids.map(id => data.nodes[id] as INode);
  }
);

const nodeDataWithoutLoneNodes = createSelector(
  [nodeData],
  filterOutIsolatedNodes
);

export const filteredNodeData = createSelector(
  [nodeDataWithoutLoneNodes, filter],
  (data, filter) => {
    if (!filter.nodeId) {
      return data;
    } else if (filter.filterType === NODE_FILTER_TYPE.NO_FILTER) {
      return data;
    } else if (filter.filterType === NODE_FILTER_TYPE.DEPENENCIES) {
      return getDependencies(data, filter.nodeId);
    } else if (filter.filterType === NODE_FILTER_TYPE.DEPENDENTS) {
      return getDependents(data, filter.nodeId);
    } else if (
      filter.filterType === NODE_FILTER_TYPE.DEPENDENTS_AND_DEPENENCIES
    ) {
      return getRelatives(data, filter.nodeId);
    } else {
      throw new Error('Unexpected type');
    }
  }
);

let shouldResetZoom = true;
// Sometimes we want the zoom to automatically reset when the graph changes, sometimes we don't
export function triggerResetZoomWhenGraphIsFinishedCalculating() {
  shouldResetZoom = true;
}

const createGraphAsyncSelector = createAsyncSelector(
  {
    onResolve: () => {
      if (shouldResetZoom) {
        shouldResetZoom = false;
        (window as any).resetZoom();
      } else {
        (window as any).store.dispatch({ type: 'RERENDER' });
      }
    },
    async: (nodes: INode[]) => asyncGraphRender.compute(nodes),
    sync: () => [],
  },
  filteredNodeData
);

export const uiNodes = createSelector(
  [createGraphAsyncSelector, nodeData],
  (resp: any, nodes) => {
    const result = resp.previous || [];
    // We want the data to be as up-to-date as possible even if the structure of the graph is old.
    return updateNodeData(nodes, result);
  }
);

export const isGraphLoading = createSelector(
  [createGraphAsyncSelector],
  (resp: any) => resp.isWaiting
);

export const scaledUiNodes = createSelector(
  [uiNodes, xScale, yScale],
  (uiNodes, xScale, yScale) => {
    const result: IUINode[] = uiNodes.map(node => {
      return {
        ...node,
        x: xScale(node.x),
        y: yScale(node.y),
        width: xScale(node.width) - xScale(0),
        height: yScale(node.height) - yScale(0),
      };
    });
    return result;
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
