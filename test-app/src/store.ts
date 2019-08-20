import { Component1State, Component1Reducer } from "./component1/reducer";
import { Component2State, Component2Reducer } from "./component2/reducer";
import {
  combineReducers,
  Dispatch,
  Reducer,
  createStore,
  compose,
  applyMiddleware
} from "redux";
import { graph } from "./graph";
import thunk from "redux-thunk";

export interface State {
  Component1: Component1State;
  Component2: Component2State;
}

export function configureStore() {
  const appReducer: Reducer<State> = combineReducers<State>({
    Component1: Component1Reducer,
    Component2: Component2Reducer
  });

  const composeEnhancers =
    typeof window === "object" &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose;

  const enhancer = composeEnhancers(
    applyMiddleware(thunk)
    // other store enhancers if any
  );
  const store = graph.enhance(createStore)(appReducer, enhancer);

  return store;
}
