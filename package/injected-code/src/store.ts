import { ICommChannelState, CommChannelReducer } from './comm-channel/reducers';
import {
  combineReducers,
  Reducer,
  createStore,
  Store,
  applyMiddleware,
  AnyAction,
} from 'redux';
import { IGraphState, GraphReducer } from './graph/core/reducers';
import { listenForResizeEvents } from './window-dimensions/listener';
import { WindowState, WindowReducer } from './window-dimensions/reducers';
import { createLogger } from 'redux-logger';
import {
  ILeftPanelState,
  LeftPanelReducer,
} from './core-dev-tools/left-side-panel/core/reducers';
import {
  IStateAnalysisState,
  StateAnalysisReducer,
} from './core-dev-tools/state/core/reducers';
import { ISettingsState, SettingsReducer } from './settings/core/reducers';
import {
  ILeftPanelDragRegion,
  DragRegionReducer,
} from './core-dev-tools/drag-region/core/reducers';
import { IHeaderState, HeaderReducer } from './header/core/reducers';
import {
  IFilterState,
  FilterReducer,
} from './core-dev-tools/filters/core/reducers';
import { ISearchState, SearchReducer } from './search/core/reducers';

export interface IState {
  CommChannel: ICommChannelState;
  Graph: IGraphState;
  Window: WindowState;
  LeftPanel: ILeftPanelState;
  StateAnalysis: IStateAnalysisState;
  Settings: ISettingsState;
  DragRegion: ILeftPanelDragRegion;
  Header: IHeaderState;
  Filters: IFilterState;
  Search: ISearchState;
}

const appReducer: Reducer<IState> = combineReducers<IState>({
  CommChannel: CommChannelReducer,
  Graph: GraphReducer,
  Window: WindowReducer,
  LeftPanel: LeftPanelReducer,
  StateAnalysis: StateAnalysisReducer,
  Settings: SettingsReducer,
  DragRegion: DragRegionReducer,
  Header: HeaderReducer,
  Filters: FilterReducer,
  Search: SearchReducer,
});

const withAsyncSelector = (state: IState, action: AnyAction) => {
  if (action.type === 'RERENDER') {
    return { ...state };
  }
  return appReducer(state, action);
};

const middlewares = [createLogger({})];

export const store: Store = createStore(
  withAsyncSelector,
  applyMiddleware(...middlewares)
);
listenForResizeEvents(store);
(window as any).store = store;
