import { Node } from "../types";

function getDependenciesHelper(node: Node, set: Set<Node>) {
    if (set.has(node)) {
        return;
    }
    set.add(node);
    for (const dependency of node.dependencies) {
        getDependenciesHelper(dependency, set);
    }
}

export function getDependencies(nodes: Node[], id: string) {
    const node = nodes.find(d => d.id === id);
    if (!node) return [];
    const set = new Set<Node>();
    getDependenciesHelper(node, set);
    return Array.from(set);
}

function getDependendentsHelper(node: Node, dict: Map<Node, boolean>) {
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

function getDependentsWithoutFiltering(nodes: Node[], id: string) {
    const node = nodes.find(d => d.id === id);
    const dict = new Map<Node, boolean>();
    if (!node) return { result: [], dict };
    dict.set(node, true);
    for (let i = 0; i < nodes.length; i++) {
        getDependendentsHelper(nodes[i], dict);
    }
    let result: Node[] = [];
    dict.forEach((bool, node) => {
        if (bool) {
            result.push(node);
        }
    });
    return { result, dict };
}

export function getDependents(nodes: Node[], id: string) {
    let { result, dict } = getDependentsWithoutFiltering(nodes, id);
    result = result.map(node => {
        return {
            ...node,
            dependencies: node.dependencies.filter(d => {
                return dict.get(d) === true;
            }),
        };
    }) 
    return result;
}

export function getRelatives(nodes: Node[], id: string) {
    const node = nodes.find(d => d.id === id);
    if (!node) return [];
    const dependencies = getDependencies(nodes, id);
    const set = new Set(dependencies);
    let { result, dict } = getDependentsWithoutFiltering(nodes, id);
    result = result.map(node => {
        return {
            ...node,
            dependencies: node.dependencies.filter(d => {
                return dict.get(d) === true || set.has(d);
            }),
        };
    });
    return [
        ...result.filter(d => d !== node),
        ...dependencies,
    ];
}