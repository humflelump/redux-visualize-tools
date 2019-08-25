import { AnyAction } from 'redux';
import { initialNodeTypeFilters, NODE_TYPES } from '../../../graph/types';

export const initialState = {
  filterNodesAffectedByOldActions: false,
  filterIsolatedNodes: true,
  nodeTypeFilters: initialNodeTypeFilters(),
};

export interface IFilterState {
  filterNodesAffectedByOldActions: boolean;
  filterIsolatedNodes: boolean;
  nodeTypeFilters: { [key: string]: boolean };
}

export function FilterReducer(
  state: IFilterState = initialState,
  action: AnyAction
): IFilterState {
  switch (action.type) {
    case 'SET_filterNodesAffectedByOldActions':
      return {
        ...state,
        filterNodesAffectedByOldActions: action.bool,
      };
    case 'SET_filterIsolatedNodes':
      return {
        ...state,
        filterIsolatedNodes: action.bool,
      };
    case 'APPLY_NODE_TYPE_FILTER':
      return {
        ...state,
        nodeTypeFilters: {
          ...state.nodeTypeFilters,
          [action.nodeType]: action.bool,
        },
      };
    default:
      return state;
  }
}
