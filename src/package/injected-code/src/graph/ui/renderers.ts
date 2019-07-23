import { UINode } from "../core/gen-renderable-graph";
import * as d3 from 'd3';
import { Dictionary } from "lodash";

export function renderRectangles(ctx: CanvasRenderingContext2D, nodes: UINode[]) {
    ctx.fillStyle = 'blue';
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        ctx.fillRect(node.x, node.y, node.width, node.height);
    }
}

export function renderLines(
    ctx: CanvasRenderingContext2D,
    nodes: UINode[],
    indexedNodes: Dictionary<UINode>
) {
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        for (let j = 0; j < node.data.dependencies.length; j++) {
            const parentData = node.data.dependencies[j];
            const parent = indexedNodes[parentData.id];
            ctx.moveTo(node.x + node.width / 2, node.y + node.height);
            ctx.lineTo(parent.x + parent.width / 2, parent.y);
            ctx.stroke();
        }

    }

}

export type Scale = d3.ScaleLinear<number, number>;
export interface ZoomData {
    canvas: HTMLCanvasElement, 
    xScale: Scale,
    yScale: Scale,
    dimensions: {width: number, height: number},
    callback: (xScale: Scale, yScale: Scale) => void
}

export function listenForResize(
    data: ZoomData,
) {
    const container = d3.select(data.canvas);

    let stopRecursion = false;
    const zoom = d3.zoom()
        .extent([[0, 0], [data.dimensions.width, data.dimensions.height]])
        .on("zoom", zoomed);

    function zoomed() {
        if (stopRecursion) {
            stopRecursion = false;
            return;
        }

        const newXScale = d3.event.transform.rescaleX(data.xScale);
        const newYScale = d3.event.transform.rescaleY(data.yScale);

        stopRecursion = true;
        container.call(zoom.transform as any, d3.zoomIdentity);
        data.callback(newXScale, newYScale);
    }

    container.call(zoom as any);
}