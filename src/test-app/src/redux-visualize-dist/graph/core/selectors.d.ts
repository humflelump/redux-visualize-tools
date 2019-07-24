import { State } from '../../store';
import * as d3 from 'd3';
import { Dictionary } from 'lodash';
import { UINode, RectangleBodyData } from '../types';
export declare const dimensions: import("reselect").OutputSelector<State, {
    left: number;
    top: number;
    width: number;
    height: number;
}, (res1: number, res2: number) => {
    left: number;
    top: number;
    width: number;
    height: number;
}>;
export declare const xScale: import("reselect").OutputSelector<State, d3.ScaleLinear<number, number>, (res1: number[], res2: number[]) => d3.ScaleLinear<number, number>>;
export declare const scale: import("reselect").OutputSelector<State, number, (res: d3.ScaleLinear<number, number>) => number>;
export declare const yScale: import("reselect").OutputSelector<State, d3.ScaleLinear<number, number>, (res1: number[], res2: number[]) => d3.ScaleLinear<number, number>>;
export declare const scaledUiNodes: import("reselect").OutputSelector<State, UINode[], (res1: UINode[], res2: d3.ScaleLinear<number, number>, res3: d3.ScaleLinear<number, number>) => UINode[]>;
export declare const getRectangleData: import("reselect").OutputSelector<State, (node: UINode) => RectangleBodyData, (res: any) => (node: UINode) => RectangleBodyData>;
export declare const hoveredNode: import("reselect").OutputSelector<State, UINode, (res1: UINode[], res2: number[]) => UINode>;
export declare const indexedUiNodes: import("reselect").OutputSelector<State, Dictionary<UINode>, (res: UINode[]) => Dictionary<UINode>>;
