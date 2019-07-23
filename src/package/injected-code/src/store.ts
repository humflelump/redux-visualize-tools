import { CommChannelState, CommChannelReducer} from "./comm-channel/reducers";
import { combineReducers, Dispatch, Reducer, createStore, Store } from 'redux';
import { GraphState, GraphReducer } from "./graph/core/reducers";
import { listenForResizeEvents } from "./window-dimensions/listener";
import { WindowState, WindowReducer } from "./window-dimensions/reducers";

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

export const store: Store = createStore(appReducer);
listenForResizeEvents(store);
(<any>window).store = store;

