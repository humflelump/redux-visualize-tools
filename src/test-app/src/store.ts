import { Component1State, Component1Reducer } from "./component1/reducer";
import { combineReducers, Dispatch, Reducer, createStore } from 'redux';

export interface State {
    Component1: Component1State,
}

export function configureStore() {
    const appReducer: Reducer<State> = combineReducers<State>({
        Component1: Component1Reducer,
    });
    
    const store = createStore(appReducer);
    return store;
}

