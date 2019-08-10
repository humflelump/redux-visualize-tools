import { AnyAction } from 'redux';

export interface ICommChannelState {
  graph: any;
}

const initialState: ICommChannelState = {
  graph: null,
};

// export type SetTextAction = {type: 'SET_TEXT1', text: string}
// export type SetNumberAction = {type: 'SET_NUMBER1', num: number}
// type Union = SetTextAction | SetNumberAction;

export function CommChannelReducer(
  state: ICommChannelState = initialState,
  action: AnyAction
): ICommChannelState {
  switch (action.type) {
    case 'SET_GRAPH':
      return { ...state, graph: action.graph };
    default:
      return state;
  }
}
