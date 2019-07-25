import { AnyAction } from "redux";
import Immutable from 'immutable';
import { UINode } from "../types";

export const initialState = {
    xTo: [0, 500],
    xFrom: [0, 500],
    yTo: [0, 500],
    yFrom: [0, 500],
    mousePosition: null,
    clickedNode: null,
};

export interface GraphState {
    xTo: number[],
    xFrom: number[],
    yTo: number[],
    yFrom: number[],
    mousePosition: number[] | null,
    clickedNode: UINode | null,
}

export function GraphReducer(state: GraphState = initialState, action: AnyAction): GraphState {
    switch(action.type) {
        case 'CLICK_NODE':
            return {
                ...state,
                clickedNode: action.node,
            };
        case 'CLEAR_CLICKED_NODE':
            return {
                ...state,
                clickedNode: null,
            };
        case 'SET_MOUSE_POSITION':
            return {
                ...state,
                mousePosition: action.position,
            };
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

