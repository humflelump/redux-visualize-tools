import { IState } from '../../store';
import { Dispatch } from 'redux';
import { INode, NODE_FILTER_TYPE } from '../../graph/types';
import { triggerResetZoomWhenGraphIsFinishedCalculating } from '../../graph/core/selectors';
const state = () => (window as any).store.getState() as IState;
const dispatch = () => (window as any).store.dispatch as Dispatch;

export function clickedSearchNode(node: INode) {
  dispatch()({
    type: 'SET_NODE_FILTER',
    filterType: NODE_FILTER_TYPE.DEPENDENTS_AND_DEPENENCIES,
    nodeId: node.id,
  });
  dispatch()({
    type: 'CLICK_NODE',
    nodeId: node.id,
  });
  dispatch()({
    type: 'CLOSE_SEARCH_DROPDOWN',
  });
  triggerResetZoomWhenGraphIsFinishedCalculating();
}
