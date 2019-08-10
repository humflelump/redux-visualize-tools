import { IState } from '../../../store';
import { createSelector } from 'reselect';
import { actions } from '../../actions/core/selectors';
import { IAction } from '../../../graph/types';
import { windowHeight } from '../../../window-dimensions/selectors';
import { LEFT_PANEL_WIDTH } from '../../left-side-panel/ui/constants';

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

export const stateAnalysisDimensions = createSelector(
  [windowHeight],
  height => {
    return {
      width: LEFT_PANEL_WIDTH,
      height: (height - 48) / 2,
    };
  }
);
