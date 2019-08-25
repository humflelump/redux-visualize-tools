import { INode, IUINode } from '../types';
import * as d3 from 'd3';
import { keyBy, Dictionary, isEqual, cloneDeep } from 'lodash';

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
  return [
    ...withoutExtraDependencies.filter(d => d.id !== node.id),
    ...dependencies,
  ];
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
      d3.min(rectangles.map(d => d.x)) || 0,
      d3.max(rectangles.map(d => d.x + d.width)) || 0,
    ]),
    y: pad([
      d3.min(rectangles.map(d => d.y)) || 0,
      d3.max(rectangles.map(d => d.y + d.height)) || 0,
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

// Takes UI Nodes and updates there data with their most recent data
export function updateNodeData(nodes: INode[], uiNodes: IUINode[]): IUINode[] {
  const indexedNodes = keyBy(nodes, d => d.id);
  const result = uiNodes.map(uiNode => {
    const node = indexedNodes[uiNode.data.id];
    if (!node) {
      return uiNode;
    }
    return {
      ...uiNode,
      data: {
        ...node,
        dependencies: uiNode.data.dependencies,
      },
    };
  });
  return result;
}

export function isGraphShapeDifferent(nodes: INode[], uiNodes: IUINode[]) {
  if (nodes.length !== uiNodes.length) {
    return true;
  }
  const indexedNodes = keyBy(nodes, d => d.id);
  for (let i = 0; i < uiNodes.length; i++) {
    const node = uiNodes[i];
    const otherNode = indexedNodes[node.data.id];
    if (!otherNode) {
      return true;
    }
    const parents1 = node.parents.map(d => d.data.id);
    const parents2 = otherNode.dependencies.map(d => d.id);
    if (!isEqual(parents1, parents2)) {
      return true;
    }
  }
  return false;
}

function clone(nodes: INode[]) {
  nodes = nodes.map(d => ({ ...d }));
  const map = keyBy(nodes, 'id');
  nodes.forEach(node => {
    node.dependencies = node.dependencies.map(d => map[d.id]);
  });
  return nodes;
}

function getChildToParentMapping(nodes: INode[]): Map<string, INode[]> {
  const map = new Map<string, INode[]>();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    for (const child of node.dependencies) {
      const childId = child.id;
      if (map.has(childId)) {
        (map.get(childId) as INode[]).push(node);
      } else {
        map.set(childId, [node]);
      }
    }
  }
  return map;
}


export function filterNodes(nodes: INode[], f: (node: INode) => boolean) {
  nodes = clone(nodes);
  const map = getChildToParentMapping(nodes);
  nodes = nodes.filter(node => {
    if (f(node)) {
      return true;
    }
    const parents = map.get(node.id) || [];
    const children = node.dependencies;

    for (const parent of parents) {
      const set = new Set(parent.dependencies);
      set.delete(node);
      for (const child of children) {
        set.add(child);
        map.set(child.id, (map.get(child.id) as INode[]).filter(d => d !== node));
        (map.get(child.id) as INode[]).push(parent);
      }
      parent.dependencies = Array.from(set);
    }
    return false;
  });
  return nodes;
}
