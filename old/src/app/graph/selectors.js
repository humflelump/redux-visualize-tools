import { createSelector } from 'reselect';
import createAsyncSelector from 'async-selector';
import * as d3 from 'd3';
import * as functions from './functions';
import * as constants from './constants';
import * as settingsConstants from '../settings/constants';
import * as graphSelectors from './create-graph-selectors';
import * as settingsSelectors from '../settings/selectors';
import * as contextSelectors from '../context-menu/selectors';
import _ from 'underscore';

const settingsDimensions = settingsSelectors.dimensions;
const menuDimensions = contextSelectors.dimensions;
const width = state => state.Window.width;
const height = state => state.Window.height;
const xTo = state => state.Graph.xTo;
const yTo = state => state.Graph.yTo;
const xFrom = state => state.Graph.xFrom;
const yFrom = state => state.Graph.yFrom;
const hoveredNode = state => state.Graph.hoveredNode;
const hoverOption = state => state.Settings.hoverOption;
const maxNodesOnScreen = state => state.Settings.maxNodesOnScreen;
export const rectangles = graphSelectors.rectangles;


function getDimensions(width, height, menuDimensions, settingsDimensions) {
    const HEADER = constants.HEADER_SIZE;
    const bottomHeight = (menuDimensions.bottom + menuDimensions.height);
    return {
        width: width - (settingsDimensions.width + settingsDimensions.right),
        height: height - HEADER - bottomHeight,
        top: HEADER,
        left: 0,
    };
}
export const chartDimensions = createSelector([width, height, menuDimensions, settingsDimensions], getDimensions);

export const extent = createSelector([rectangles, chartDimensions], functions.getZoomedOutScales);


function getXScale(xTo, xFrom) {
    return d3.scaleLinear().domain(xFrom).range(xTo);
}
export const xScale = createSelector([xTo, xFrom], getXScale);

function getYScale(yTo, yFrom) {
    return d3.scaleLinear().domain(yFrom).range(yTo);
}
export const yScale = createSelector([yTo, yFrom], getYScale);

function getIfZoomedOut(extent, xScale, yScale) {
    const eq = (a, b) => a[0] === b[0] && a[1] === b[1];
    if (!eq(extent.x.domain(), xScale.domain())) return false;
    if (!eq(extent.y.domain(), yScale.domain())) return false;
    if (!eq(extent.x.range(), xScale.range())) return false;
    if (!eq(extent.y.range(), yScale.range())) return false;
    return true;
}
export const isZoomedOut = createSelector([extent, xScale, yScale], getIfZoomedOut);

function getZoom(chartDimensions) {
    return callback => d3.zoom()
        .extent([[0, 0], [chartDimensions.width, chartDimensions.height]])
        .on("zoom", callback)
}
export const zoom = createSelector([chartDimensions], getZoom);

function getHighlightedNodes(hoveredNode, hoverOption) {
    if (!hoveredNode) return new Set();
    const dependencies = hoveredNode.getDependencies();
    const dependents = hoveredNode.getDependents();
    switch(hoverOption) {
        case settingsConstants.NEITHER:
            return new Set();
        case settingsConstants.DEPENDANCIES:
            return new Set(dependencies.map(d => d.id));
        case settingsConstants.DEPENDANTS:
            return new Set(dependents.map(d => d.id));
        case settingsConstants.BOTH:
            return new Set([...dependents, ...dependencies].map(d => d.id));
        default:
            return new Set();
    }
}
export const highlightedNodes = createSelector([hoveredNode, hoverOption], getHighlightedNodes);


function getRectangesInPixelSpace(rectangles, xScale, yScale) {
    const results = rectangles.map((rect) => {
        const x1 = xScale(rect.x);
        const y1 = yScale(rect.y);
        const x2 = xScale(rect.x + rect.width);
        const y2 = yScale(rect.y + rect.height);
        return {
            node: rect.node,
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            scale: (x2 - x1) / rect.width,
        };
    });
    return results;
}
export const pxlRects = createSelector([rectangles, xScale, yScale], getRectangesInPixelSpace);

function getRectanglesOnScreen(pxlRects, chartDimensions) {
    const minX = 0
    const maxX = chartDimensions.width;
    const minY = 0
    const maxY = chartDimensions.height;
    return pxlRects.filter((rect) => {
        if (rect.x + rect.width < minX) return false;
        if (rect.x > maxX) return false;
        if (rect.y + rect.height < minY) return false;
        if (rect.y > maxY) return false;
        return true;
    });
}
export const onScreenRectangles = createSelector([pxlRects, chartDimensions], getRectanglesOnScreen);

function removeRectsForPerformance(rectangles, maxNodesOnScreen) {
    if (rectangles.length <= maxNodesOnScreen) return rectangles;
    return rectangles.slice(0, maxNodesOnScreen);
}
export const performanceRectangles = createSelector([onScreenRectangles, maxNodesOnScreen], removeRectsForPerformance);

function getArrows(rectangles, onScreenRectangles) {
    const indexed = _.indexBy(rectangles, d => d.node.id);
    const arrows = [];
    for (const rectangle of onScreenRectangles) {
        for (const id of rectangle.node.data.dependencies) {
            const target = indexed[id];
            const start = functions.getArrowStart(rectangle);
            const end = functions.getArrowEnd(target);
            const arrow = {
                x1: start.x,
                y1: start.y,
                x2: end.x,
                y2: end.y,
                id: rectangle.node.data.id + '>' + target.node.data.id,
            };
            arrows.push(arrow);
        }
    }
    return arrows;
}
export const arrows = createSelector([pxlRects, performanceRectangles], getArrows);

