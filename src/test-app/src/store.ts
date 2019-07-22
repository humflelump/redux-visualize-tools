import { Component1State, Component1Reducer} from "./component1/reducer";
import { Component2State, Component2Reducer} from "./component2/reducer";
import { combineReducers, Dispatch, Reducer, createStore } from 'redux';
import { graph } from 'redux-visualize-tools';

export interface State {
    Component1: Component1State,
    Component2: Component2State,
}

export function configureStore() {
    const appReducer: Reducer<State> = combineReducers<State>({
        Component1: Component1Reducer,
        Component2: Component2Reducer,
    });
    
    const store = graph.enhance(createStore)(appReducer);
    return store;
}

