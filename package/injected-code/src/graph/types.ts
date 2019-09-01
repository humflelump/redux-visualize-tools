import { ScaleLinear } from 'd3';

export type Scale = d3.ScaleLinear<number, number>;
export type Ctx = CanvasRenderingContext2D;

export interface IZoomData {
  canvas: HTMLCanvasElement;
  xScale: Scale;
  yScale: Scale;
  dimensions: { width: number; height: number };
  callback: (xScale: Scale, yScale: Scale) => void;
}

export interface INodeMetadata {
  description?: string;
  file?: string;
}

export interface IAction {
  action: any;
  prevState: any;
  nextState: any;
  actionNumber: number;
  startTime: number;
  endTime: number;
}

export enum NODE_TYPES {
  RESELECT_SELECTOR = 'Selector',
  ASYNC_SELECTOR = 'Async Selector',
  CONNECT = 'Connected Component',
  CLASS_COMPONENT = 'Class Component',
  FUNCTION_COMPONENT = 'Function Component',
  STATE_VARIABLE = 'State Variable',
  FUNCTION = 'Function',
}

const ALL_NODE_TYPES = [
  NODE_TYPES.FUNCTION,
  NODE_TYPES.STATE_VARIABLE,
  NODE_TYPES.RESELECT_SELECTOR,
  NODE_TYPES.CONNECT,
  NODE_TYPES.CLASS_COMPONENT,
  NODE_TYPES.FUNCTION_COMPONENT,
  NODE_TYPES.ASYNC_SELECTOR,
];

export function initialNodeTypeFilters() {
  const obj = {};
  ALL_NODE_TYPES.forEach(type => (obj[type] = false));
  return obj;
}

export enum NODE_FILTER_TYPE {
  NO_FILTER = 'No Filter',
  DEPENDENTS = 'Only Show Dependents',
  DEPENENCIES = 'Only Show Dependencies',
  DEPENDENTS_AND_DEPENENCIES = 'Only Show Relatives',
}

export interface INode {
  id: string;
  metadata: INodeMetadata;
  dependencies: INode[];
  value: any;
  duration?: number;
  type: NODE_TYPES;
  name: string;
  action?: IAction;
  function?: (...d: any[]) => any;
  componentInfo: {
    component?: (params: any[]) => any;
    props?: object;
  };
}

export interface IUINode {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: INode;
  parents: IUINode[];
  children: IUINode[];
}

export interface IRectangleBodyData {
  returnType: string;
  duration: string;
  lastCall: string;
}
