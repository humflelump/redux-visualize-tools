import { CommChannelState, CommChannelReducer} from "./comm-channel/reducers";
import { combineReducers, Dispatch, Reducer, createStore, Store } from 'redux';

export interface State {
    CommChannel: CommChannelState,
}


const appReducer: Reducer<State> = combineReducers<State>({
    CommChannel: CommChannelReducer,
});

export const store: Store = createStore(appReducer);
(<any>window).store = store;

