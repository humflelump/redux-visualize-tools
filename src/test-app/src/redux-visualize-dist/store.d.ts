import { CommChannelState } from "./comm-channel/reducers";
import { Store } from 'redux';
import { GraphState } from "./graph/core/reducers";
import { WindowState } from "./window-dimensions/reducers";
export interface State {
    CommChannel: CommChannelState;
    Graph: GraphState;
    Window: WindowState;
}
export declare const store: Store;
