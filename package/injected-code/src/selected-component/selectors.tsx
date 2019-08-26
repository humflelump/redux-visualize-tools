import { createSelector } from "reselect";
import { IState } from "../store";
import React from 'react';
import ReactDOM from "react-dom";
import { nodeData } from "../graph/core/node-data-selector";
import { INode, IUINode } from "../graph/types";
import { clickedNode } from "../graph/core/selectors";

const nodeId = (state: IState) => state.SelectedComponent.nodeIdToShowComponentFor;
const graphData = (state: IState) => state.CommChannel.graph;

export const nodeToShowComponentFor = createSelector(
  [nodeData, nodeId], (nodes, nodeId) => {
    if (!nodeId) { return null; }
    return nodes.find(d => d.id === nodeId) || null;
  }
);

export const canShowComponentForClickedNode = createSelector(
  [clickedNode, graphData], (node: IUINode, graph) => {
    if (!node) return false;
    if (!graph) return false;
    if (!graph.store) return false;
    if (!node.data.componentInfo.component) return false;
    if (!node.data.componentInfo.props) return false;
    if (!graph.appData.ReactDOM) return false;
    if (!graph.appData.Provider) return false;
    return true;
  }
)
