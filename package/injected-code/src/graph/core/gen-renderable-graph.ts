import dagre from 'dagre';
import { INode, IUINode } from '../types';
import { keyBy } from 'lodash';

export function createUiNodes(nodes: INode[]) {
  const g = new dagre.graphlib.Graph({ multigraph: true });
  g.setGraph({ rankdir: 'BT', ranksep: 80, ranker: 'longest-path' });
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
      children: [],
    };
    g.setNode(node.id, obj);
    for (const dependency of node.dependencies) {
      g.setEdge(dependency.id, node.id);
    }
  }
  const t = performance.now();
  dagre.layout(g);
  console.log('it took', performance.now() - t);
  const result = g.nodes().map((id: string) => g.node(id));
  giveNodeLinks(result);
  console.log({ result });

  return result as IUINode[];
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