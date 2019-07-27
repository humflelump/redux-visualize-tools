import { AnyAction } from 'redux';
import { IUINode, NODE_FILTER_TYPE } from '../types';

export const initialState = {
  xTo: [0, 500],
  xFrom: [0, 500],
  yTo: [0, 500],
  yFrom: [0, 500],
  mousePosition: null,
  clickedNodeId: null,
  clickedNodeFilter: NODE_FILTER_TYPE.NO_FILTER,
};

export interface IGraphState {
  xTo: number[];
  xFrom: number[];
  yTo: number[];
  yFrom: number[];
  mousePosition: number[] | null;
  clickedNodeId: string | null;
  clickedNodeFilter: NODE_FILTER_TYPE;
}

export function GraphReducer(
  state: IGraphState = initialState,
  action: AnyAction
): IGraphState {
  switch (action.type) {
    case 'SET_CLICKED_NODE_FILTER':
      return {
        ...state,
        clickedNodeFilter: action.filter,
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
        clickedNodeFilter: NODE_FILTER_TYPE.NO_FILTER,
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
