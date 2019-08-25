import { createSelector } from "reselect";
import { IState } from "../store";
import React from 'react';
import { nodeData } from "../graph/core/node-data-selector";
import { INode } from "../graph/types";

const nodeId = (state: IState) => state.SelectedComponent.nodeIdToShowComponentFor;

export const nodeToShowComponentFor = createSelector(
  [nodeData, nodeId], (nodes, nodeId) => {
    if (!nodeId) { return null; }
    return nodes.find(d => d.id === nodeId) || null;
  }
);

export const component = createSelector(
  [nodeToShowComponentFor], (node) => {
    if (!node) { return null; }
    const Component = node.componentInfo.component as any;
    const props = node.componentInfo.props;
    if (!Component) { return null; }
    if (!props) { return null; }
    return () => <Component {...props} />;
  }
)