import _ from 'underscore';
import * as functions from '../graph/functions';

export default class Graph {
    constructor(nodes) {
        this.nodes = nodes;
        this.indexedNodes = this.getIndexedNodesById();
        this.giveGraphParentsAndChildren(this.nodes);
        this.roots = this.getRoots();
        this.giveNodesMaxDepth();
        this.giveNodesMinDepth();
        this.indexedByDepth = this.getIndexedNodesByMaxDepth();
        this.giveNodesDirectParents();
        this.giveNodesDirectChildren();
        this.giveNodesWidth();
        this.giveNodesAllowedExtents();
        const MAX_ITERATIONS = 2;
        for (let i = 0; i < MAX_ITERATIONS; i++) {
            this.giveNodesAllowedPositions();
            this.solveForX();
        }
    }

    solveForX() {
        for (const root of this.roots) {
            root.x = _.last(root.allowedPositions);
            giveSolution(root);
        }
    }

    giveNodesAllowedPositions() {
        for (const node of this.nodes) {
            node.allowedPositions = giveNodeAllowedPositions(node);
        }
    }

    getIndexedNodesById() {
        return _.indexBy(this.nodes, 'id');
    }

    getIndexedNodesByMaxDepth() {
        return _.groupBy(this.nodes, 'depth');
    }

    giveGraphParentsAndChildren() {
        for (const node of this.nodes) {
            for (const id of node.data.dependencies) {
                const child = this.indexedNodes[id];
                node.addChild(child);
                child.addParent(node);
            }
        }
    }

    giveNodesDirectParents() {
        for (const node of this.nodes) {
            let deepest = null;
            for (const parent of node.parents) {
                if (deepest === null || parent.depth > deepest.depth) {
                    deepest = parent;
                }
            }
            node.directParent = deepest;
        }
    }

    giveNodesDirectChildren() {
        for (const node of this.nodes) {
            node.directChildren = node.children.filter((child) => {
                return child.directParent === node;
            });
        }
    }

    giveNodesAllowedExtents() {
        let x = 0;
        for (const root of this.roots) {
            root.minX = x;
            giveNodeMinX(root);
            x += root.width;
        }
    }

    giveNodesWidth() {
        for (const root of this.roots) {
            giveNodeWidth(root);
        }
    }

    getRoots() {
        return this.nodes.filter(d => d.parents.length === 0);
    }

    giveNodesMaxDepth() {
        for (const root of this.roots) {
            giveNodeDepth(root);
        }
    }

    giveNodesMinDepth() {
        for (const root of this.roots) {
            giveNodeMinDepth(root);
        }
    }
}

export function giveNodeDepth(node) {
    giveNodeDepthHelper(node, 0, node);
}

function giveNodeDepthHelper(node, depth, root) {
    if (typeof node.depth !== 'number' || depth > node.depth) {
        node.depth = depth;
        node.root = root;
    }
    for (const child of node.children) {
        giveNodeDepthHelper(child, depth + 1, root);
    }
}

export function giveNodeMinDepth(node) {
    giveNodeMinDepthHelper(node, 0, node)
}

function giveNodeMinDepthHelper(node, depth, root) {
    if (node.root === root) {
        if (typeof node.minDepth !== 'number' || node.minDepth > depth) {
            node.minDepth = depth;
        }
    }
    for (const child of node.children) {
        giveNodeMinDepthHelper(child, depth + 1, root);
    }
}

export function giveNodeWidth(node) {
    if (node.directChildren.length === 0) {
        node.width = 1;
        return 1;
    }
    let width = 0;
    for (const child of node.directChildren) {
        width += giveNodeWidth(child);
    }
    node.width = width;
    return width;
}

export function giveNodeMinX(node) {
    let x = node.minX;
    for (const child of node.directChildren) {
        child.minX = x;
        x += child.width;
        giveNodeMinX(child);
    }
}

function giveSolution(node) {
    giveNodeAllowedPositions(node)
    const children = node.directChildren;
    const sorted = _.sortBy(children, d => d.allowedPositions.length);
    getSolution.count = 0;
    const solution = getSolution(sorted, 0, []);
    sorted.forEach((child, i) => {
        child.x = solution[i];
        giveSolution(child);
    });
}
//122668
const MAX_CALLS = 500; // give up finding a solution
function getSolution(nodes, index, previouslySeen) {
    getSolution.count += 1;
    if (index >= nodes.length) return [];
    const node = nodes[index];
    const previousSet = new Set(previouslySeen);
    for (const n of node.allowedPositions) {
        if (!previousSet.has(n) || getSolution.count > MAX_CALLS) {
            const newAr = [...previouslySeen, n];
            return [n, ...getSolution(nodes, index+1, newAr)];
        }
    }
    const default_ = _.last(node.allowedPositions);
    const newAr = [...previouslySeen, default_];
    return [default_, ...getSolution(nodes, index+1, newAr)];
}

function positionNodes(nodes, index=0, set) {
    const node = nodes[i];
    for (const n of node.allowedPositions) {
        const copy = new Set(set);
        copy.add(n);
        node.x = n
    }
}

function giveNodeAllowedPositions(node) {
    let start = Math.floor((node.minX + node.minX + node.width) / 2);
    if (node.directParent === null) return [start];
    const parent = node.directParent;
    const extent = [parent.minX, parent.minX + parent.width];
    let n = 0;
    let positions = [];
    if (canBePlaced(node, start)) positions.push(start);
    let x = start;
    while (true) {
        n += 1;
        x += n;
        let done = true;
        if (x < extent[1]) {
            done = false;
            if (canBePlaced(node, x))
                positions.push(x);
        }
        n += 1;
        x -= n;
        if (x >= extent[0]) {
            done = false;
            if (canBePlaced(node, x))
                positions.push(x);
        }
        if (done) {
            positions.push(start);
            return positions;
        }
    }
}

function canBePlaced(node, x) {
    for (const parent of node.parents) {
        if (parent.x === x && parent.depth < node.depth - 1) {
            return false;
        }
    } 
    return true;
}