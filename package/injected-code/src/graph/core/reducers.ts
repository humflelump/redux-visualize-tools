import { AnyAction } from 'redux';
import { IUINode, NODE_FILTER_TYPE, INode } from '../types';
import { NODE_FILTER_TYPES } from '../../side-panel/ui/constants';

export const initialState = {
  xTo: [0, 500],
  xFrom: [0, 500],
  yTo: [0, 500],
  yFrom: [0, 500],
  mousePosition: null,
  clickedNodeId: null,
  nodeFilter: {
    filterType: NODE_FILTER_TYPE.NO_FILTER,
    nodeId: null,
  },
};

export interface IGraphState {
  xTo: number[];
  xFrom: number[];
  yTo: number[];
  yFrom: number[];
  mousePosition: number[] | null;
  clickedNodeId: string | null;
  nodeFilter: {
    filterType: NODE_FILTER_TYPE;
    nodeId: string | null;
  };
}

export function GraphReducer(
  state: IGraphState = initialState,
  action: AnyAction
): IGraphState {
  switch (action.type) {
    case 'SET_NODE_FILTER':
      return {
        ...state,
        nodeFilter: {
          filterType: action.filterType,
          nodeId: action.nodeId,
        },
      };
    case 'CLEAR_NODE_FILTER':
      return {
        ...state,
        nodeFilter: {
          filterType: NODE_FILTER_TYPE.NO_FILTER,
          nodeId: null,
        },
      };
    case 'CLICK_NODE':
      return {
        ...state,
        clickedNodeId: action.nodeId,
      };
    case 'CLEAR_CLICKED_NODE':
      return {
        ...state,
        clickedNodeId: null,
      };
    case 'SET_MOUSE_POSITION':
      return {
        ...state,
        mousePosition: action.position,
      };
    case 'SET_SCALES':
      return {
        ...state,
        yTo: action.yTo || state.yTo,
        xTo: action.xTo || state.xTo,
        yFrom: action.yFrom || state.yFrom,
        xFrom: action.xFrom || state.xFrom,
        mousePosition: null,
      };
    default:
      return state;
  }
}
