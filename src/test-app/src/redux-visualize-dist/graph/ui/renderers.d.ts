import { Dictionary } from "lodash";
import { ZoomData, UINode, Ctx, RectangleBodyData } from "../types";
export declare function renderRectangleContents(nodes: UINode[], ctx: Ctx, getRectangleData: (node: UINode) => RectangleBodyData, scale: number): void;
export declare function renderRectangles(ctx: Ctx, nodes: UINode[], hoveredNode: UINode | null, scale: number): void;
export declare function renderLines(ctx: Ctx, nodes: UINode[], indexedNodes: Dictionary<UINode>): void;
export declare function renderText(ctx: Ctx, nodes: UINode[], scale: number): void;
export declare function listenForResize(data: ZoomData): void;
