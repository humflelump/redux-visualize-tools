import { INode, IUINode } from '../types';
import * as d3 from 'd3';

function getDependenciesHelper(node: INode, set: Set<INode>) {
  if (set.has(node)) {
    return;
  }
  set.add(node);
  for (const dependency of node.dependencies) {
    getDependenciesHelper(dependency, set);
  }
}

export function getDependencies(nodes: INode[], id: string) {
  const node = nodes.find(d => d.id === id);
  if (!node) {
    return [];
  }
  const set = new Set<INode>();
  getDependenciesHelper(node, set);
  return Array.from(set);
}

function getDependendentsHelper(node: INode, dict: Map<INode, boolean>) {
  if (dict.has(node)) {
    return dict.get(node);
  }
  for (const dependency of node.dependencies) {
    if (getDependendentsHelper(dependency, dict)) {
      dict.set(node, true);
      return true;
    }
  }
  return false;
}

function getDependentsWithoutFiltering(nodes: INode[], id: string) {
  const node = nodes.find(d => d.id === id);
  const dict = new Map<INode, boolean>();
  if (!node) {
    return { result: [], dict };
  }
  dict.set(node, true);
  for (let i = 0; i < nodes.length; i++) {
    getDependendentsHelper(nodes[i], dict);
  }
  const result: INode[] = [];
  dict.forEach((bool, dictNode) => {
    if (bool) {
      result.push(dictNode);
    }
  });
  return { result, dict };
}

export function getDependents(nodes: INode[], id: string) {
  const { result, dict } = getDependentsWithoutFiltering(nodes, id);
  const withoutExtraDependencies = result.map(node => {
    return {
      ...node,
      dependencies: node.dependencies.filter(d => {
        return dict.get(d) === true;
      }),
    };
  }) as INode[];
  return withoutExtraDependencies;
}

export function getRelatives(nodes: INode[], id: string) {
  const node = nodes.find(d => d.id === id);
  if (!node) {
    return [];
  }
  const dependencies = getDependencies(nodes, id);
  const set = new Set(dependencies);
  const { result, dict } = getDependentsWithoutFiltering(nodes, id);
  const withoutExtraDependencies = result.map(nodeM => {
    return {
      ...nodeM,
      dependencies: nodeM.dependencies.filter(d => {
        return dict.get(d) === true || set.has(d);
      }),
    };
  });
  return [...withoutExtraDependencies.filter(d => d !== node), ...dependencies];
}

export function filterOutIsolatedNodes(nodes: INode[]) {
  const dependencies = new Set<INode>();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    for (const dependency of node.dependencies) {
      dependencies.add(dependency);
    }
  }
  const result = nodes.filter(node => {
    return node.dependencies.length > 0 || dependencies.has(node);
  });
  return result;
}

export function getZoomedOutScales(
  rectangles: IUINode[],
  chartDimensions: { width: number; height: number }
) {
  const windowAspectRatio = chartDimensions.width / chartDimensions.height;
  const pad = (extent: number[]) => {
    const size = extent[1] - extent[0];
    const FRACTION = 1 / 12;
    return [extent[0] - size * FRACTION, extent[1] + size * FRACTION];
  };
  const result = {
    x: pad([
      d3.min(rectangles.map(d => d.x)),
      d3.max(rectangles.map(d => d.x + d.width)),
    ]),
    y: pad([
      d3.min(rectangles.map(d => d.y)),
      d3.max(rectangles.map(d => d.y + d.height)),
    ]),
  };

  const rectsAspectRatio =
    (result.x[1] - result.x[0]) / (result.y[1] - result.y[0]);
  if (rectsAspectRatio >= windowAspectRatio) {
    const heightFraction = windowAspectRatio / rectsAspectRatio;
    const topFraction = (1 - heightFraction) / 2;
    const xExtent = [0, chartDimensions.width];
    const yExtent = [
      chartDimensions.height * topFraction,
      chartDimensions.height * (topFraction + heightFraction),
    ];
    return {
      x: d3
        .scaleLinear()
        .domain(result.x)
        .range(xExtent),
      y: d3
        .scaleLinear()
        .domain(result.y)
        .range(yExtent),
    };
  }
  const widthFraction = rectsAspectRatio / windowAspectRatio;
  const leftFraction = (1 - widthFraction) / 2;
  const yExtent = [0, chartDimensions.height];
  const xExtent = [
    chartDimensions.width * leftFraction,
    chartDimensions.width * (leftFraction + widthFraction),
  ];
  return {
    x: d3
      .scaleLinear()
      .domain(result.x)
      .range(xExtent),
    y: d3
      .scaleLinear()
      .domain(result.y)
      .range(yExtent),
  };
}
