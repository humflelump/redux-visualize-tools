import * as d3 from 'd3';

export type Scale = d3.ScaleLinear<number, number>;
export type Ctx = CanvasRenderingContext2D;

export interface ZoomData {
    canvas: HTMLCanvasElement, 
    xScale: Scale,
    yScale: Scale,
    dimensions: {width: number, height: number},
    callback: (xScale: Scale, yScale: Scale) => void
}

export interface NodeMetadata {
    description?: string,
    file?: string,
}

export interface Action {
    userAction: any,
    actionNumber: number,
};

export enum NODE_TYPES {
    RESELECT_SELECTOR = 'RESELECT_SELECTOR',
    ASYNC_SELECTOR = 'ASYNC_SELECTOR',
    CONNECT = 'CONNECT',
    REACT_COMPONENT = 'REACT_COMPONENT',
    STATE_VARIABLE = 'STATE_VARIABLE',
    FUNCTION = 'FUNCTION',
}

export interface Node {
    id: string,
    metadata: NodeMetadata,
    dependencies: Node[],
    value: any,
    duration?: number,
    type: NODE_TYPES,
    name: string,
    action?: Action,
}

export interface UINode {
    label: string,
    x: number,
    y: number,
    width: number,
    height: number,
    data: Node,
}

export interface RectangleBodyData {
    returnType: string,
    duration: string,
    lastCall: string,
}