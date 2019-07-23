import { UINode } from "../core/gen-renderable-graph";
import * as d3 from 'd3';
import { Dictionary } from "lodash";
export declare function renderRectangles(ctx: CanvasRenderingContext2D, nodes: UINode[]): void;
export declare function renderLines(ctx: CanvasRenderingContext2D, nodes: UINode[], indexedNodes: Dictionary<UINode>): void;
export declare type Scale = d3.ScaleLinear<number, number>;
export interface ZoomData {
    canvas: HTMLCanvasElement;
    xScale: Scale;
    yScale: Scale;
    dimensions: {
        width: number;
        height: number;
    };
    callback: (xScale: Scale, yScale: Scale) => void;
}
export declare function listenForResize(data: ZoomData): void;
