import { IUINode, IRectangleBodyData } from '../types';

function getTypeName(d: any): string {
  if (!d || !d.constructor) {
    return typeof d;
  }
  return d.constructor.name;
}

export function extractRectangleBodyData(
  node: IUINode,
  graph: any
): IRectangleBodyData {
  const totalActions: number = graph.lastAction.actionNumber;
  const current = node.data.action && node.data.action.actionNumber;
  const diff = totalActions - (current || 0);
  let lastCall;
  if (!node.data.action) {
    lastCall = 'Never Called';
  } else if (diff === 0) {
    lastCall = 'Just Now';
  } else if (diff === 1) {
    lastCall = `1 Action Ago`;
  } else {
    lastCall = `${diff} Actions Ago`;
  }

  const duration =
    node.data.duration === undefined
      ? 'na'
      : `${node.data.duration.toFixed(1)} ms`;

  return {
    returnType: getTypeName(node.data.value),
    duration,
    lastCall,
  };
}
