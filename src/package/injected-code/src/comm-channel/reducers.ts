import { AnyAction } from "redux";
import Immutable from 'immutable';

export interface CommChannelState {
    graph: any,
}

const initialState: CommChannelState = {
    graph: null,
};

// export type SetTextAction = {type: 'SET_TEXT1', text: string}
// export type SetNumberAction = {type: 'SET_NUMBER1', num: number}
// type Union = SetTextAction | SetNumberAction;

export function CommChannelReducer(state: CommChannelState = initialState, action: AnyAction): CommChannelState {
    switch(action.type) {
        case 'SET_GRAPH':
            return { ...state, graph: action.graph};
        default:
            return state;
    }
}

