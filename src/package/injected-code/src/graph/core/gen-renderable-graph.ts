
import dagre from 'dagre';
import { Node, UINode } from '../types';
import { keyBy } from 'lodash';

export function createUiNodes(nodes: Node[]) {
    var g = new dagre.graphlib.Graph({multigraph: true});
    g.setGraph({rankdir: 'BT', ranksep: 80, ranker: 'longest-path'});
    g.setDefaultEdgeLabel(function() { return {}; });
    for (const node of nodes) {
        const obj = {
            label: node.name,
            width: 200,
            height: 100,
            data: node,
            parents: [],
            children: [],
        }
        g.setNode(node.id, obj);
        for (const dependency of node.dependencies) {
            g.setEdge(dependency.id, node.id);
        }
    }


    dagre.layout(g)
    const result = g.nodes().map((id: string) => g.node(id));
    giveNodeLinks(result);
    console.log({result});
    return result as UINode[];
}

function giveNodeLinks(data: any) {
    const dict = keyBy(data, d => d.data.id);
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const parents = node.data.dependencies;
        for (let j = 0; j < parents.length; j++) {
            const parent = dict[parents[j].id];
            node.parents.push(parent);
            parent.children.push(node);
        }
    }
}