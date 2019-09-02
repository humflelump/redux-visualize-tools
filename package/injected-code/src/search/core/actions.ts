import { IState } from '../../store';
import { Dispatch } from 'redux';
import { INode, NODE_FILTER_TYPE } from '../../graph/types';
import { triggerResetZoomWhenGraphIsFinishedCalculating } from '../../graph/core/selectors';
import { SearchActions } from './reducers';
import { GraphActions } from '../../graph/core/reducers';
const state = () => (window as any).store.getState() as IState;
const dispatch = () => (window as any).store.dispatch as Dispatch;

export function clickedSearchNode(node: INode) {
  dispatch()(
    GraphActions.setNodeFilter(
      NODE_FILTER_TYPE.DEPENDENTS_AND_DEPENENCIES,
      node.id
    )
  );
  dispatch()(GraphActions.clickNode(node.id));
  dispatch()(SearchActions.closeDropdown());
  triggerResetZoomWhenGraphIsFinishedCalculating();
}
