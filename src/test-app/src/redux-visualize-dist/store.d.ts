import { CommChannelState } from "./comm-channel/reducers";
import { Store } from 'redux';
export interface State {
    CommChannel: CommChannelState;
}
export declare const store: Store;
