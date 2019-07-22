import { AnyAction } from "redux";
export interface CommChannelState {
    graph: any;
}
export declare function CommChannelReducer(state: CommChannelState | undefined, action: AnyAction): CommChannelState;
