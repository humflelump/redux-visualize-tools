import { INode, IUINode } from '../graph/types';
// @ts-ignore
import workerTxt from './worker.txt.js';
import { keyBy, isEqual } from 'lodash';

function makeWorker() {
  const blob = new Blob([workerTxt], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const w = new Worker(url);
  return w;
}

export class AsyncGraphRender {
  private worker: Worker | null;
  private prevNodes: INode[] | null;
  private solution: IUINode[];
  private promise: Promise<IUINode[]> | null;
  private isPending: boolean;
  constructor() {
    this.worker = null;
    this.prevNodes = null;
    this.solution = [];
    this.promise = null;
    this.isPending = false;
  }

  public async compute(nodes: INode[]) {
    console.log({ nodes });
    if (
      this.prevNodes !== null &&
      !isGraphShapeDifferent(nodes, this.prevNodes)
    ) {
      if (this.isPending) {
        return this.promise;
      } else {
        return this.solution;
      }
    }
    this.prevNodes = nodes;
    if (this.worker) {
      this.worker.terminate();
    }
    this.promise = new Promise(resolve => {
      this.isPending = true;
      const worker = makeWorker();
      this.worker = worker;
      const serializableNodes = stripUnserializableData(nodes);
      worker.postMessage(serializableNodes);
      worker.onmessage = event => {
        this.solution = event.data as IUINode[];
        this.solution = reinsertUnserializableData(nodes, this.solution);
        resolve(this.solution);
        this.isPending = false;
      };
    });
    return this.promise;
  }
}

function isGraphShapeDifferent(nodes1: INode[], nodes2: INode[]) {
  if (nodes1.length !== nodes2.length) {
    return true;
  }
  const indexedNodes = keyBy(nodes1, d => d.id);
  for (let i = 0; i < nodes2.length; i++) {
    const node = nodes2[i];
    const otherNode = indexedNodes[node.id];
    if (!otherNode) {
      return true;
    }
    const parents1 = node.dependencies.map(d => d.id);
    const parents2 = otherNode.dependencies.map(d => d.id);
    if (!isEqual(parents1, parents2)) {
      return true;
    }
  }
  return false;
}

function stripUnserializableData(nodes: INode[]) {
  return nodes.map(node => {
    return {
      id: node.id,
      name: node.name,
      dependencies: node.dependencies.map(d => ({ id: d.id })),
    };
  });
}

function reinsertUnserializableData(nodes: INode[], resp: IUINode[]) {
  const indexed = keyBy(nodes, d => d.id);
  return resp.map(uiNode => {
    uiNode.data = indexed[uiNode.data.id];
    return uiNode;
  });
}

export const asyncGraphRender = new AsyncGraphRender();
