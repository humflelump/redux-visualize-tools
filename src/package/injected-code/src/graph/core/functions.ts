import { INode } from '../types';

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
