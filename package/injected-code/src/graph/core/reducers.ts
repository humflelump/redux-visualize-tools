import { ImmerReducer } from 'immer-reducer';
import { createActionCreators, createReducerFunction } from 'immer-reducer';
import { NODE_FILTER_TYPE } from '../types';

const initialState = {
  xTo: [0, 500],
  xFrom: [0, 500],
  yTo: [0, 500],
  yFrom: [0, 500],
  mousePosition: null as number[] | null,
  clickedNodeId: null as string | null,
  nodeFilter: {
    filterType: NODE_FILTER_TYPE.NO_FILTER,
    nodeId: null as string | null,
  },
};

type IGraphState = typeof initialState;

class GraphReducerClass extends ImmerReducer<IGraphState> {
  setNodeFilter(filterType: NODE_FILTER_TYPE, nodeId: string | null) {
    this.draftState.nodeFilter.filterType = filterType;
    this.draftState.nodeFilter.nodeId = nodeId;
  }

  clearNodeFilter() {
    this.draftState.nodeFilter.filterType = NODE_FILTER_TYPE.NO_FILTER;
    this.draftState.nodeFilter.nodeId = null;
  }

  clickNode(nodeId: string | null) {
    this.draftState.clickedNodeId = nodeId;
  }

  clearClickedNode() {
    this.draftState.clickedNodeId = null;
  }

  setMousePosition(pos: number[] | null) {
    this.draftState.mousePosition = pos;
  }

  resetMousePosition() {
    this.draftState.mousePosition = null;
  }

  setScales(
    yTo?: number[],
    yFrom?: number[],
    xTo?: number[],
    xFrom?: number[]
  ) {
    this.draftState.yTo = yTo || this.draftState.yTo;
    this.draftState.xTo = xTo || this.draftState.xTo;
    this.draftState.yFrom = yFrom || this.draftState.yFrom;
    this.draftState.xFrom = xFrom || this.draftState.xFrom;
    this.draftState.mousePosition = null;
  }
}

export const GraphActions = createActionCreators(GraphReducerClass);
export const GraphReducer = createReducerFunction(
  GraphReducerClass,
  initialState
);
