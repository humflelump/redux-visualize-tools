import { AnyAction } from 'redux';

export const initialState = {
  filterNodesAffectedByOldActions: false,
};

export interface IFilterState {
  filterNodesAffectedByOldActions: boolean;
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
    default:
      return state;
  }
}
