import { State } from '../../store';
import { UINode } from './gen-renderable-graph';
import * as d3 from 'd3';
import { Dictionary } from 'lodash';
export interface NodeMetadata {
    description?: string;
    file?: string;
}
export interface Action {
    userAction: any;
    actionNumber: number;
}
export declare enum NODE_TYPES {
    RESELECT_SELECTOR = "RESELECT_SELECTOR",
    ASYNC_SELECTOR = "ASYNC_SELECTOR",
    CONNECT = "CONNECT",
    REACT_COMPONENT = "REACT_COMPONENT",
    STATE_VARIABLE = "STATE_VARIABLE",
    FUNCTION = "FUNCTION"
}
export interface Node {
    id: string;
    metadata: NodeMetadata;
    dependencies: Node[];
    value: any;
    duration?: number;
    type: NODE_TYPES;
    name: string;
    action?: Action;
}
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
export declare const yScale: import("reselect").OutputSelector<State, d3.ScaleLinear<number, number>, (res1: number[], res2: number[]) => d3.ScaleLinear<number, number>>;
export declare const scaledUiNodes: import("reselect").OutputSelector<State, UINode[], (res1: UINode[], res2: d3.ScaleLinear<number, number>, res3: d3.ScaleLinear<number, number>) => UINode[]>;
export declare const indexedUiNodes: import("reselect").OutputSelector<State, Dictionary<UINode>, (res: UINode[]) => Dictionary<UINode>>;
