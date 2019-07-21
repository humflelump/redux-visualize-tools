import { AnyAction } from "redux";
import Immutable from 'immutable';

export interface Component2State {
    text: string,
}

const initialState: Component2State = {
    text: 'Component2String',
};

export function Component2Reducer(state: Component2State = initialState, action: AnyAction): Component2State {
    return state;
}

