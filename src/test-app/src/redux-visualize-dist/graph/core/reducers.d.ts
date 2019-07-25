import { AnyAction } from "redux";
import { UINode } from "../types";
export declare const initialState: {
    xTo: number[];
    xFrom: number[];
    yTo: number[];
    yFrom: number[];
    mousePosition: any;
    clickedNode: any;
};
export interface GraphState {
    xTo: number[];
    xFrom: number[];
    yTo: number[];
    yFrom: number[];
    mousePosition: number[] | null;
    clickedNode: UINode | null;
}
export declare function GraphReducer(state: GraphState, action: AnyAction): GraphState;
