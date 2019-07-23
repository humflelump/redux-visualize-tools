import { AnyAction } from "redux";
import Immutable from 'immutable';

export const initialState = {
    xTo: [0, 500],
    xFrom: [0, 500],
    yTo: [0, 500],
    yFrom: [0, 500],
};

export type GraphState = typeof initialState


export function GraphReducer(state: GraphState = initialState, action: AnyAction): GraphState {
    switch(action.type) {
        case 'SET_SCALES':
            console.log({action})
            return { 
                ...state, 
                yTo: action.yTo || state.yTo,
                xTo: action.xTo || state.xTo,
                yFrom: action.yFrom || state.yFrom,
                xFrom: action.xFrom || state.xFrom,
            };
        default:
            return state;
    }
}

