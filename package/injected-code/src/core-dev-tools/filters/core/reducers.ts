import { ImmerReducer } from 'immer-reducer';
import { createActionCreators, createReducerFunction } from 'immer-reducer';
import { initialNodeTypeFilters, NODE_TYPES } from '../../../graph/types';

const initialState = {
  filterNodesAffectedByOldActions: false,
  filterIsolatedNodes: true,
  nodeTypeFilters: initialNodeTypeFilters() as { [key: string]: boolean },
};

type IFilterState = typeof initialState;

class FilterReducerClass extends ImmerReducer<IFilterState> {
  filterNodesEffectedByOldActions(bool: boolean) {
    this.draftState.filterNodesAffectedByOldActions = bool;
  }

  filterIsolatedNodes(bool: boolean) {
    this.draftState.filterIsolatedNodes = bool;
  }

  applyNodeTypeFilter(nodeType: string, bool: boolean) {
    this.draftState.nodeTypeFilters[nodeType] = bool;
  }
}

export const FilterActions = createActionCreators(FilterReducerClass);
export const FilterReducer = createReducerFunction(
  FilterReducerClass,
  initialState
);
