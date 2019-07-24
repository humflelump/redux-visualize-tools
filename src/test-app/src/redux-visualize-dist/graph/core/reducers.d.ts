import { AnyAction } from "redux";
export declare const initialState: {
    xTo: number[];
    xFrom: number[];
    yTo: number[];
    yFrom: number[];
    mousePosition: number[];
};
export declare type GraphState = typeof initialState;
export declare function GraphReducer(state: GraphState, action: AnyAction): GraphState;
