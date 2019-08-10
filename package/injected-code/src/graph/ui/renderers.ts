import * as d3 from 'd3';
import { Dictionary } from 'lodash';
import { Scale, IZoomData, IUINode, Ctx, IRectangleBodyData } from '../types';
import { COLORS } from './constants';

function renderRoundedRect(
  ctx: Ctx,
  radius: number,
  x: number,
  y: number,
  width: number,
  height: number
) {
  if (width < 2 * radius) {
    radius = width / 2;
  }
  if (height < 2 * radius) {
    radius = height / 2;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

export function renderRectangleContents(
  nodes: IUINode[],
  ctx: Ctx,
  getRectangleData: (node: IUINode) => IRectangleBodyData,
  scale: number
) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const data = getRectangleData(node);
    ctx.fillStyle = 'rgb(80,80,80)';
    ctx.textAlign = 'left';
    const size = 13 * scale;
    ctx.font = `${size}px "Roboto", sans-serif`;
    let y = node.y + 48 * scale;
    let label = 'Return Type: ' + data.returnType;
    ctx.fillText(label, node.x + node.width / 30, y);
    y += size + 5 * scale;
    label = 'Last Call: ' + data.lastCall;
    ctx.fillText(label, node.x + node.width / 30, y);
    y += size + 5 * scale;
    label = 'Computation: ' + data.duration;
    ctx.fillText(label, node.x + node.width / 30, y);
  }
}

export function renderRectangles(
  ctx: Ctx,
  nodes: IUINode[],
  hoveredNode: IUINode | null,
  scale: number
) {
  ctx.shadowColor = 'rgba(200, 200, 200, 1)';
  ctx.shadowBlur = 6 * scale;
  ctx.shadowOffsetX = 6 * scale;
  ctx.shadowOffsetY = 6 * scale;
  const NORMAL = 'rgba(240, 240, 240, 1)';
  const HOVERED = 'rgba(220, 220, 220, 1)';
  ctx.lineWidth = 1;
  const radius = 10 * scale;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const color = COLORS[node.data.type];
    ctx.strokeStyle = color;
    const isHovered = hoveredNode === node;
    renderRoundedRect(ctx, radius, node.x, node.y, node.width, node.height);
    ctx.fillStyle = isHovered ? HOVERED : NORMAL;
    ctx.fill();
    ctx.moveTo(node.x, node.y + 28 * scale);
    ctx.lineTo(node.x + node.width, node.y + 28 * scale);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

export function renderLines(
  ctx: Ctx,
  nodes: IUINode[],
  indexedNodes: Dictionary<IUINode>
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

export function renderText(ctx: Ctx, nodes: IUINode[], scale: number) {
  ctx.fillStyle = 'rgb(80,80,80)';
  ctx.textAlign = 'left';
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const size = 15 * scale;
    ctx.font = `${size}px "Roboto", sans-serif`;
    ctx.fillText(
      node.label,
      node.x + node.width / 30,
      node.y + node.height / 5
    );
  }
}

export function listenForResize(data: IZoomData) {
  const container = d3.select(data.canvas);

  let stopRecursion = false;
  const zoom = d3
    .zoom()
    .extent([[0, 0], [data.dimensions.width, data.dimensions.height]])
    .on('zoom', zoomed);

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
