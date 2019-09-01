import { IState } from '../../../store';
import { createSelector } from 'reselect';
import { actions } from '../../actions/core/selectors';
import { IAction } from '../../../graph/types';
import { windowHeight } from '../../../window-dimensions/selectors';
import { LEFT_PANEL_WIDTH } from '../../left-side-panel/ui/constants';
import { parentStore } from '../../../comm-channel/selectors';
import { AnyAction, Store } from 'redux';
import { diff } from '../../diff/diff-objects';
import { Delta } from '../../diff/dist';

const userSelectedAction = createSelector(
  [(state: IState) => state.StateAnalysis.userSelectedAction, actions],
  (number, actions) => {
    return actions.find(d => d.actionNumber === number) || null;
  }
);

const topFraction = (state: IState) => state.DragRegion.dividerTop;

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
  store => (store ? store.getState() : {})
);

export const stateDiff = createSelector(
  [selectedAction],
  action => {
    if (!action) {
      return undefined;
    }
    const state1 = action.prevState;
    const state2 = action.nextState;
    const result = diff(state1, state2);
    return result as Delta;
  }
);

export const bottomHalfDimensions = createSelector(
  [windowHeight, topFraction],
  (height, topFraction) => {
    return {
      width: LEFT_PANEL_WIDTH,
      height: height - topFraction * height,
      left: 0,
      top: topFraction * height,
    };
  }
);

export const topHalfDimensions = createSelector(
  [bottomHalfDimensions, windowHeight],
  (bottom, height) => {
    return {
      width: bottom.width,
      height: height - bottom.height,
      left: 0,
      top: 0,
    };
  }
);
