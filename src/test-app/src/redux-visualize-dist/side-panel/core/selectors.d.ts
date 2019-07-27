import { State } from '../../store';
import { UINode } from '../../graph/types';
export declare const isRightSidePanelOpen: import("reselect").OutputSelector<State, boolean, (res: UINode) => boolean>;
export declare const effectiveRightPanelWidth: import("reselect").OutputSelector<State, 0 | 400, (res: boolean) => 0 | 400>;
