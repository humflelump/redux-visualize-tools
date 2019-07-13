

export default class Node {
    constructor(data, id) {
        this.data = data;
        this.id = id;

        this.children = [];
        this.parents = [];
        this.indexedChildren = {};
        this.indexedParents = {};

        this.depth = null;
        this.minDepth = null;
        this.rectangle = null;
    }

    addChild(node) {
        if (!(node.id in this.indexedChildren)) {
            this.children.push(node);
            this.indexedChildren[node.id] = node;
        }
    }

    addParent(node) {
        if (!(node.id in this.indexedParents)) {
            this.parents.push(node);
            this.indexedParents[node.id] = node;
        }
    }

    getDependencies() {
        const nodes = [];
        getDependencies(this, new Set(), nodes);
        return nodes;
    }

    getDependents() {
        const nodes = [];
        getDependents(this, new Set(), nodes);
        return nodes;
    }
}

function getDependents(node, set, nodes) {
    if (set.has(node.id)) {
        return;
    }
    set.add(node.id);
    nodes.push(node);
    for (const parent of node.parents) {
        getDependents(parent, set, nodes);
    }
}

function getDependencies(node, set, nodes) {
    if (set.has(node.id)) {
        return;
    }
    set.add(node.id);
    nodes.push(node);
    for (const child of node.children) {
        getDependencies(child, set, nodes);
    }
}