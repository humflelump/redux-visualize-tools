import { AnyAction } from "redux";

export interface Component1State {
    text: string,
    number: number,
}

const initialState: Component1State = {
    text: 'hey',
    number: 0,
};

export type SetTextAction = {type: 'SET_TEXT1', text: string}
export type SetNumberAction = {type: 'SET_NUMBER1', num: number}
type Union = SetTextAction | SetNumberAction;

export function Component1Reducer(state: Component1State = initialState, action: AnyAction): Component1State {
    switch(action.type) {
        case 'SET_TEXT1':
            return { ...state, text: action.text}
        case 'SET_NUMBER1':
            return { ...state, number: action.num };
        default:
            return state;
    }
}

