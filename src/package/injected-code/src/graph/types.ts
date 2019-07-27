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
  userAction: any;
  actionNumber: number;
}

export enum NODE_TYPES {
  RESELECT_SELECTOR = 'RESELECT_SELECTOR',
  ASYNC_SELECTOR = 'ASYNC_SELECTOR',
  CONNECT = 'CONNECT',
  REACT_COMPONENT = 'REACT_COMPONENT',
  STATE_VARIABLE = 'STATE_VARIABLE',
  FUNCTION = 'FUNCTION',
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
