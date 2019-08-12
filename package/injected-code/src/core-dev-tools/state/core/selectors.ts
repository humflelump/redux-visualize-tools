import { IState } from '../../../store';
import { createSelector } from 'reselect';
import { actions } from '../../actions/core/selectors';
import { IAction } from '../../../graph/types';
import { windowHeight } from '../../../window-dimensions/selectors';
import { LEFT_PANEL_WIDTH } from '../../left-side-panel/ui/constants';
import { parentStore } from '../../../comm-channel/selectors';
import { AnyAction, Store } from 'redux';

const userSelectedAction = (state: IState) =>
  state.StateAnalysis.userSelectedAction;

export const selectedAction = createSelector(
  [userSelectedAction, actions],
  (action, actions) => {
    if (action) {
      return action;
    }
    if (actions.length > 0) {
      return actions[actions.length - 1];
    }
    return null;
  }
);

export const currentState: ((state: IState) => any) & {
  resultFunc: (res: Store<any, AnyAction>) => any;
  recomputations: () => number;
  resetRecomputations: () => number;
} = createSelector(
  [parentStore],
  store => store.getState()
);

export const stateAnalysisDimensions = createSelector(
  [windowHeight],
  height => {
    return {
      width: LEFT_PANEL_WIDTH,
      height: (height - 48) / 2,
    };
  }
);
