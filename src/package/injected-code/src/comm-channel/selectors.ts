import { IState } from '../store';
import { Store, AnyAction } from 'redux';
import { createSelector } from 'reselect';

export const parentStore = createSelector(
  (state: IState) => state.CommChannel.graph,
  graph => {
    if (graph && graph.store) {
      return graph.store as Store;
    }
    return null;
  }
);
