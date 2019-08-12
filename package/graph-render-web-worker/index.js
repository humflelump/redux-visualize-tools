import dagre from "dagre";

console.log("wow");

function keyBy(L, f) {
  const obj = {};
  for (let i = 0; i < L.length; i++) {
    obj[f(L[i])] = L[i];
  }
  return obj;
}

function createUiNodes(nodes) {
  const t = performance.now();

  const g = new dagre.graphlib.Graph({ multigraph: true });
  g.setGraph({ rankdir: "BT", ranksep: 80, ranker: "longest-path" });
  g.setDefaultEdgeLabel(() => {
    return {};
  });
  for (const node of nodes) {
    const obj = {
      label: node.name,
      width: 200,
      height: 100,
      data: node,
      parents: [],
      children: []
    };
    g.setNode(node.id, obj);
    for (const dependency of node.dependencies) {
      g.setEdge(dependency.id, node.id);
    }
  }

  dagre.layout(g);
  console.log("it took", performance.now() - t, "to generate the graph");
  const result = g.nodes().map(id => g.node(id));
  giveNodeLinks(result);
  console.log({ result });

  return result;
}

function giveNodeLinks(data) {
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

self.onmessage = function(e) {
  const nodes = createUiNodes(e.data);
  console.log("tried");
  self.postMessage(nodes);
};
