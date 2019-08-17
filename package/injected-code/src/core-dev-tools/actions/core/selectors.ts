import { IState } from '../../../store';
import { IAction } from '../../../graph/types';
import { createSelector } from 'reselect';
import { windowHeight } from '../../../window-dimensions/selectors';
import { LEFT_PANEL_WIDTH } from '../../left-side-panel/ui/constants';

export const actions = (state: IState) => {
  if (state.CommChannel.graph) {
    return state.CommChannel.graph.actions as IAction[];
  }
  return [] as IAction[];
};

export const actionsListDimensions = createSelector(
  [windowHeight],
  height => {
    return {
      width: LEFT_PANEL_WIDTH,
      height: (height - 48) / 2,
    };
  }
);
