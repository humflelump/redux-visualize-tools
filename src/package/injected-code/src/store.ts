import { CommChannelState, CommChannelReducer} from "./comm-channel/reducers";
import { combineReducers, Dispatch, Reducer, createStore, Store, applyMiddleware } from 'redux';
import { GraphState, GraphReducer } from "./graph/core/reducers";
import { listenForResizeEvents } from "./window-dimensions/listener";
import { WindowState, WindowReducer } from "./window-dimensions/reducers";
import { createLogger } from 'redux-logger'


export interface State {
    CommChannel: CommChannelState,
    Graph: GraphState,
    Window: WindowState,
}

const appReducer: Reducer<State> = combineReducers<State>({
    CommChannel: CommChannelReducer,
    Graph: GraphReducer,
    Window: WindowReducer,
});

const middlewares = [
    createLogger({})
];

export const store: Store = createStore(appReducer, applyMiddleware(...middlewares));
listenForResizeEvents(store);
(<any>window).store = store;

