import { AnyAction } from "redux";
import { NODE_FILTER_TYPE } from "../types";
export declare const initialState: {
    xTo: number[];
    xFrom: number[];
    yTo: number[];
    yFrom: number[];
    mousePosition: any;
    clickedNodeId: any;
    clickedNodeFilter: NODE_FILTER_TYPE;
};
export interface GraphState {
    xTo: number[];
    xFrom: number[];
    yTo: number[];
    yFrom: number[];
    mousePosition: number[] | null;
    clickedNodeId: string | null;
    clickedNodeFilter: NODE_FILTER_TYPE;
}
export declare function GraphReducer(state: GraphState, action: AnyAction): GraphState;
