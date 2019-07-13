import { createSelector } from 'reselect';
import createAsyncSelector from 'async-selector';
import * as d3 from 'd3';
import * as functions from './functions';
import * as constants from './constants';
import * as contextMenuSelectors from '../context-menu/selectors';
import _ from 'underscore';
import Graph from '../classes/graph';
import Node from '../classes/node';

const nodes = contextMenuSelectors.filteredNodes;

function getRectangles(nodes) {
    const results = nodes.map((node) => {
        const x = node.x * constants.WIDTH + (node.x + 1) * constants.PADDING;
        const y = node.depth * constants.HEIGHT + (node.depth + 1) * constants.PADDING;
        return {
            node: node,
            x: x,
            y: y,
            width: constants.WIDTH,
            height: constants.HEIGHT,
            scale: 1,
        };
    });
    return results;
}
export const rectangles = createSelector([nodes], getRectangles);
