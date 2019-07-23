import { AnyAction } from "redux";
import Immutable from 'immutable';

export const initialState = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export type WindowState = typeof initialState


export function WindowReducer(state: WindowState = initialState, action: AnyAction): WindowState {
    switch(action.type) {
        case 'SET_WINDOW_DIMENSIONS':
            return { 
                ...state, 
                width: action.width,
                height: action.height,
            };
        default:
            return state;
    }
}

