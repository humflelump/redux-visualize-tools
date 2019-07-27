import { ICommChannelState, CommChannelReducer } from './comm-channel/reducers';
import {
  combineReducers,
  Reducer,
  createStore,
  Store,
  applyMiddleware,
} from 'redux';
import { IGraphState, GraphReducer } from './graph/core/reducers';
import { listenForResizeEvents } from './window-dimensions/listener';
import { WindowState, WindowReducer } from './window-dimensions/reducers';
import { createLogger } from 'redux-logger';
import {
  ILeftPanelState,
  LeftPanelReducer,
} from './core-dev-tools/left-side-panel/core/reducers';

export interface IState {
  CommChannel: ICommChannelState;
  Graph: IGraphState;
  Window: WindowState;
  LeftPanel: ILeftPanelState;
}

const appReducer: Reducer<IState> = combineReducers<IState>({
  CommChannel: CommChannelReducer,
  Graph: GraphReducer,
  Window: WindowReducer,
  LeftPanel: LeftPanelReducer,
});

const middlewares = [createLogger({})];

export const store: Store = createStore(
  appReducer,
  applyMiddleware(...middlewares)
);
listenForResizeEvents(store);
(window as any).store = store;
