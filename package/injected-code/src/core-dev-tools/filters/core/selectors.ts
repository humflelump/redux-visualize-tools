import { createSelector } from 'reselect';
import { IState } from '../../../store';
import { INode } from '../../../graph/types';

const graphData = (state: IState) => state.CommChannel.graph;

const filterOldActions = (state: IState) =>
  state.Filters.filterNodesAffectedByOldActions;

export const filterFunction = createSelector(
  [filterOldActions, graphData],
  (filterOldActions, graph) => {
    const functions: Array<(node: INode) => boolean> = [];
    if (filterOldActions) {
      const f = (node: INode) => {
        return node.action === graph.lastAction;
      };
      functions.push(f);
    }
    return (node: INode) => {
      for (const f of functions) {
        if (!f(node)) { return false; }
      }
      return true;
    };
  }
);
