import { AnyAction } from "redux";
export declare const initialState: {
    width: number;
    height: number;
};
export declare type WindowState = typeof initialState;
export declare function WindowReducer(state: WindowState, action: AnyAction): WindowState;
