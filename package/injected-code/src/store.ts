import { CommChannelReducer } from './comm-channel/reducers';
import {
  combineReducers,
  createStore,
  Store,
  applyMiddleware,
  AnyAction,
} from 'redux';
import { GraphReducer } from './graph/core/reducers';
import { listenForResizeEvents } from './window-dimensions/listener';
import { WindowReducer } from './window-dimensions/reducers';
import { createLogger } from 'redux-logger';
import { LeftPanelReducer } from './core-dev-tools/left-side-panel/core/reducers';
import { StateAnalysisReducer } from './core-dev-tools/state/core/reducers';
import { SettingsReducer } from './settings/core/reducers';
import { DragRegionReducer } from './core-dev-tools/drag-region/core/reducers';
import { HeaderReducer } from './header/core/reducers';
import { FilterReducer } from './core-dev-tools/filters/core/reducers';
import { SearchReducer } from './search/core/reducers';
import { SelectedComponentReducer } from './selected-component/reducers';
import { mergeState, loadPersistedState, persist } from './persist';
import throttle from 'lodash/throttle';

const appReducer = combineReducers({
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
  SelectedComponent: SelectedComponentReducer,
});

export type IState = ReturnType<typeof appReducer>;

const withAsyncSelector = (state: IState, action: AnyAction) => {
  if (action.type === 'RERENDER') {
    return { ...state };
  }
  if (action.type === 'MERGE_PERSISTED_STATE') {
    return mergeState(state, action.toMerge);
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

function handleStatePersistance() {
  // clear the subscription from the last app refresh
  (window as any)._unsub_ && (window as any)._unsub_();
  try {
    store.dispatch({
      type: 'MERGE_PERSISTED_STATE',
      toMerge: loadPersistedState(),
    });
  } catch (e) {
    console.log(e);
  }
  const throttledPersist = throttle(persist, 500);
  (window as any)._unsub_ = store.subscribe(() => {
    throttledPersist(store.getState());
  });
}

setTimeout(handleStatePersistance);
