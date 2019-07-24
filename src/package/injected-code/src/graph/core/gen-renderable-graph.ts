
import dagre from 'dagre';
import { Node, UINode } from '../types';

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
        }
        g.setNode(node.id, obj);
        for (const dependency of node.dependencies) {
            g.setEdge(dependency.id, node.id);
        }
    }


    dagre.layout(g)
    const result = g.nodes().map((id: string) => g.node(id));
    console.log({result});
    return result as UINode[];
}

// // Create a new directed graph 
// var g = new dagre.graphlib.Graph();

// // Set an object for the graph label
// g.setGraph({});

// // Default to assigning a new object as a label for each new edge.
// g.setDefaultEdgeLabel(function() { return {}; });

// // Add nodes to the graph. The first argument is the node id. The second is
// // metadata about the node. In this case we're going to add labels to each of
// // our nodes.
// g.setNode("kspacey",    { label: "Kevin Spacey",  width: 144, height: 100 });
// g.setNode("swilliams",  { label: "Saul Williams", width: 160, height: 100 });
// g.setNode("bpitt",      { label: "Brad Pitt",     width: 108, height: 100 });
// g.setNode("hford",      { label: "Harrison Ford", width: 168, height: 100 });
// g.setNode("lwilson",    { label: "Luke Wilson",   width: 144, height: 100 });
// g.setNode("kbacon",     { label: "Kevin Bacon",   width: 121, height: 100 });

// // Add edges to the graph.
// g.setEdge("kspacey",   "swilliams");
// g.setEdge("swilliams", "kbacon");
// g.setEdge("bpitt",     "kbacon");
// g.setEdge("hford",     "lwilson");
// g.setEdge("lwilson",   "kbacon");

// dagre.layout(g);

// g.nodes().forEach(function(v) {
//     console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
// });
// g.edges().forEach(function(e) {
//    console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
// });