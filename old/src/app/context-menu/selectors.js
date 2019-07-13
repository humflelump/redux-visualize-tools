import { createSelector } from 'reselect';
import createAsyncSelector from 'async-selector';
import * as d3 from 'd3';
import * as constants from './constants';
import * as graphConstants from '../graph/constants';
import * as graphFunctions from '../graph/functions';
import _ from 'underscore';
import Graph from '../classes/graph';
import Node from '../classes/node';

const dispatchId = state => state.Graph.dispatchId;
const selectedNodeId = state => state.ContextMenu.selectedNodeId;
const settingsOpen = state => state.Graph.settingsOpen;
const serializableFlatGraph = state => state.Graph.graph;
const filterType = state => state.ContextMenu.filterType;
const nodeIdToFilterOn = state => state.ContextMenu.nodeIdToFilterOn;
const shouldFilterUnconnectedNodes = state => state.Settings.shouldFilterUnconnectedNodes;
const shouldRemoveInactiveNodes = state => state.Settings.shouldRemoveInactiveNodes;

function getCorrectedGraph(nodes) {
    if (!nodes) return [];
    return graphFunctions.removeNonLeafStateVariables(nodes);
}
export const correctedGraph = createSelector([serializableFlatGraph], getCorrectedGraph);

function removeUnconnectedNodesIfNecessary(nodes, shouldFilterUnconnectedNodes) {
    if (!shouldFilterUnconnectedNodes) {
        return nodes;
    }
    return graphFunctions.removeUnconnectedNodes(nodes);
}
export const correctedGraph2 = createSelector([correctedGraph, shouldFilterUnconnectedNodes], removeUnconnectedNodesIfNecessary);

function removeUnupdatedNodesIfNecessary(nodes, dispatchId, shouldRemoveInactiveNodes) {
    if (!shouldRemoveInactiveNodes) {
        return nodes;
    }
    return graphFunctions.removeUnupdatedNodes(nodes, dispatchId);
}
export const correctedGraph3 = createSelector([correctedGraph2, dispatchId, shouldRemoveInactiveNodes], removeUnupdatedNodesIfNecessary);

function createGraph(flatGraph) {
    const nodes = flatGraph.map(d => {
        return new Node(d, d.id);
    });
    const graph = new Graph(nodes);
    return graph.nodes;
}
export const nodes = createSelector([correctedGraph3], createGraph);

function getNodeToFilterOn(nodeIdToFilterOn, nodes) {
    const node = nodes.find(n => n.id === nodeIdToFilterOn);
    return node || null;
}
export const nodeToFilterOn = createSelector([nodeIdToFilterOn, nodes], getNodeToFilterOn);

function getSelectedNode(selectedNodeId, nodes) {
    const node = nodes.find(n => n.id === selectedNodeId);
    return node || null;
}
export const selectedNode = createSelector([selectedNodeId, nodes], getSelectedNode);

function getNodeData(selectedNode) {
    if (!selectedNode) return { data: 'na' };
    return selectedNode.data.value;
}
export const nodeValue = createSelector([selectedNode], getNodeData);

function getNodeMetatdata(selectedNode, dispatchId) {
    if (!selectedNode) return { data: 'na' };
    const d = selectedNode.data;
    const duration = typeof d.duration === 'number'
        ? d.duration.toPrecision(4)
        : 'N/A';
    return {
        description: d.description,
        duration: `${duration} ms`,
        lastCalled: dispatchId - d.dispatchId,
    }
}
export const nodeMetadata = createSelector([selectedNode, dispatchId], getNodeMetatdata);

function getText(selectedNode, dispatchId) {
    if (!selectedNode) return '';
    const d = selectedNode.data;
    const duration = typeof d.duration === 'number'
        ? d.duration.toPrecision(4)
        : 'N/A';
    let lastCall;
    if (typeof d.dispatchId !== 'number' || d.dispatchId < 0) {
        lastCall = 'N/A';
    } else if (d.dispatchId === dispatchId) {
        lastCall = 'Most Recent Action'
    } else {
        lastCall = `${dispatchId - d.dispatchId} Actions Ago`;
    }
    return `Description: ${d.description}
Duration: ${duration} ms
Last Call: ${lastCall}
---------------------------------------
${d.stringifiedResult || ''}
`;
}

export const dataText = createSelector([selectedNode, dispatchId], getText);

function filterNodes(nodes, nodeToFilterOn, filterType) {
    
    const make = (nodes) => {
        const n = nodes.map(d => new Node(d.data, d.id));
        const ids = new Set(n.map(d => d.id));
        n.forEach((d) => {
            d.data = {
                ...d.data,
                dependencies: d.data.dependencies
                    .filter(id => ids.has(id)),
            };
        });
        return (new Graph(n)).nodes
    }
    if (!nodeToFilterOn) {
        return nodes;
    }
    if (filterType === constants.NO_FILTER) {
        return nodes;
    } else if (filterType === constants.DEPENDENCIES_FILTER) {
        return make(nodeToFilterOn.getDependencies());
    } else if (filterType === constants.DEPENDENTS_FILTER) {
        return make(nodeToFilterOn.getDependents());
    }
    const both = [...nodeToFilterOn.getDependents(), ...nodeToFilterOn.getDependencies()];
    return make(_.uniq(both, d => d.id));
}
export const filteredNodes = createSelector([nodes, nodeToFilterOn, filterType], filterNodes);

function getIfMenuIsOpen(selectedNode) {
    return selectedNode !== null;
}
export const isMenuOpen = createSelector([selectedNode], getIfMenuIsOpen);

function getDimensions(isMenuOpen, settingsOpen) {
    return {
        bottom: isMenuOpen ? 0 : constants.HEIGHT * -1,
        left: 0,
        right: settingsOpen ? graphConstants.SETTINGS_WIDTH : 0,
        height: constants.HEIGHT,
    };
}
export const dimensions = createSelector([isMenuOpen, settingsOpen], getDimensions);

function getIfFilterPopupIsOpen(nodeToFilterOn) {
    return Boolean(nodeToFilterOn);
}
export const isFilterPopupOpen = createSelector([nodeToFilterOn], getIfFilterPopupIsOpen);

function getFilterPopupDimensions(isFilterPopupOpen, dimensions) {
    const btm = dimensions.bottom + dimensions.height;
    const open = isFilterPopupOpen; //rename
    return {
        left: 0,
        right: 0,
        bottom: btm + (open ? 0 : -1 * constants.FILTER_POPUP_HEIGHT),
        height: constants.FILTER_POPUP_HEIGHT,
    };
}
export const filterPopupDimensions = createSelector([isFilterPopupOpen, dimensions], getFilterPopupDimensions);
