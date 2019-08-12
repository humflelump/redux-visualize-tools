import { AnyAction } from 'redux';

export const initialState = {
  maxNodesCanAutoCalculate: 5,
};

export interface ISettingsState {
  maxNodesCanAutoCalculate: number;
}

export function SettingsReducer(
  state: ISettingsState = initialState,
  action: AnyAction
): ISettingsState {
  switch (action.type) {
    case 'SET_MAXIMUM_NODES_THAT_CAN_BE_AUTO_CALCULATED':
      return { ...state, maxNodesCanAutoCalculate: action.bool };
    default:
      return state;
  }
}
