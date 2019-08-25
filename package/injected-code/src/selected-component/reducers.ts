import { AnyAction } from 'redux';

export const initialState = {
  nodeIdToShowComponentFor: null,
};

export interface ISelectedComponentState {
  nodeIdToShowComponentFor: string | null;
}

export function SelectedComponentReducer(
  state: ISelectedComponentState = initialState,
  action: AnyAction
): ISelectedComponentState {
  switch (action.type) {
    case 'SET_NODE_ID_TO_SHOW_COMPONENT_FOR':
      return { ...state, nodeIdToShowComponentFor: action.id };
    default:
      return state;
  }
}
