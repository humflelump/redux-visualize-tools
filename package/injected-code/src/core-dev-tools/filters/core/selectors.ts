import { createSelector } from 'reselect';
import { IState } from '../../../store';
import { INode } from '../../../graph/types';
import { nodeData } from '../../../graph/core/node-data-selector';

const graphData = (state: IState) => state.CommChannel.graph;

const filterOldActions = (state: IState) =>
  state.Filters.filterNodesAffectedByOldActions;

const nodeTypeFilters = (state: IState) => state.Filters.nodeTypeFilters;
const filterIsolatedNodes = (state: IState) => state.Filters.filterIsolatedNodes;

const RETURN_TRUE = () => true;

const filterIsolatedNodesFunction = createSelector(
  [filterIsolatedNodes, nodeData], (shouldFilter, nodes) => {
    if (!shouldFilter) {
      return RETURN_TRUE;
    }
    const dependencies = new Set<string>();
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      for (const dependency of node.dependencies) {
        dependencies.add(dependency.id);
      }
    }
    return (node: INode) => {
      return node.dependencies.length > 0 || dependencies.has(node.id);
    }
  }
)


const nodeFilterFunction = createSelector(
  [nodeTypeFilters], (filters) => {
    return (node: INode) => {
      return !filters[node.type];
    }
  }
)

export const filterFunction = createSelector(
  [filterOldActions, graphData, nodeFilterFunction, filterIsolatedNodesFunction],
  (filterOldActions, graph, nodeFilterFunction, filterIsolatedNodesFunction) => {
    const functions: Array<(node: INode) => boolean> = [];
    functions.push(nodeFilterFunction);
    functions.push(filterIsolatedNodesFunction);
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
