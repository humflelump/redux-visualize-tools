import _ from 'underscore';
import * as d3 from 'd3';
import * as constants from './constants';

export function removesIds(nodes, ids) {
    const set = new Set(ids);
    return nodes.filter((d) => {
        return !set.has(d.id);
    }).map((d) => {
        return {
            ...d,
            dependencies: d.dependencies.filter(n => !set.has(n)),
        };
    });
}

export function getArrowStart(rectangle) {
    return {
        x: rectangle.x + rectangle.width / 2,
        y: rectangle.y + rectangle.height,
    };
}

export function getArrowEnd(rectangle) {
    return {
        x: rectangle.x + rectangle.width / 2,
        y: rectangle.y + rectangle.height / 2,
    };
}

function addBranch(node, list, index = 0) {
    if (index >= list.length) return;
    const str = list[index];
    if (!node[str]) node[str] = {};
    addBranch(node[str], list, index+1);
}

export function removeNonLeafStateVariables(nodes) {
    const stateNodes = nodes.filter(d => d.type === constants.STATE_VARIABLE);
    const names = [...new Set(stateNodes.map(d => d.name))];
    const tree = {};
    for (const name of names) {
        const split = name.split('.');
        addBranch(tree, split);
    }
    const idsToExclude = stateNodes.filter((node) => {
        const split = node.name.split('.');
        let obj = tree;
        for (const str of split) {
            obj = obj[str];
        }
        return !_.isEmpty(obj); // means its a root
    }).map(d => d.id);
    const idSet = new Set(idsToExclude);
    const result = nodes
        .filter(d => !idSet.has(d.id))
        .map(d => {
            return {
                ...d,
                dependencies: d.dependencies
                .filter(id => !idSet.has(id)),
            };
        });
    return result;
}


export function getZoomedOutScales(rectangles, chartDimensions) {
    const windowAspectRatio = chartDimensions.width / chartDimensions.height;
    const pad = (extent) => {
        const size = extent[1] - extent[0];
        const FRACTION = 1 / 12;
        return [extent[0] - size * FRACTION, extent[1] + size * FRACTION];
    }
    const result = {
        x: pad([d3.min(rectangles.map(d => d.x)), d3.max(rectangles.map(d => d.x + d.width))]),
        y: pad([d3.min(rectangles.map(d => d.y)), d3.max(rectangles.map(d => d.y + d.height))]),
    }

    const rectsAspectRatio = (result.x[1] - result.x[0]) / (result.y[1] - result.y[0]);
    if (rectsAspectRatio >= windowAspectRatio) {
        const heightFraction = windowAspectRatio / rectsAspectRatio;
        const topFraction = (1 - heightFraction) / 2;
        const xExtent = [0, chartDimensions.width];
        const yExtent = [
            chartDimensions.height * topFraction,
            chartDimensions.height * (topFraction + heightFraction)
        ]
        return {
            x: d3.scaleLinear().domain(result.x).range(xExtent),
            y: d3.scaleLinear().domain(result.y).range(yExtent),
        }
    }
    const widthFraction = rectsAspectRatio / windowAspectRatio;
    const leftFraction = (1 - widthFraction) / 2;
    const yExtent = [0, chartDimensions.height];
    const xExtent = [
        chartDimensions.width * leftFraction,
        chartDimensions.width * (leftFraction + widthFraction)
    ]
    return {
        x: d3.scaleLinear().domain(result.x).range(xExtent),
        y: d3.scaleLinear().domain(result.y).range(yExtent),
    }
}

export function removeUnconnectedNodes(nodes) {
    const ids = _.flatten(nodes.map(d => d.dependencies));
    const set = new Set(ids);
    return nodes.filter(d => set.has(d.id) || d.dependencies.length > 0);
}

export function removeUnupdatedNodes(nodes, dispatchId) {
    const ids = nodes
        .filter(d => d.dispatchId !== dispatchId)
        .map(d => d.id);
    return removesIds(nodes, ids)
}
