import { State } from '../../store';
import { UINode } from '../../graph/types';
export declare const isRightSidePanelOpen: import("reselect").OutputSelector<State, boolean, (res: UINode) => boolean>;
export declare const effectiveRightPanelWidth: import("reselect").OutputSelector<State, 400 | 0, (res: boolean) => 400 | 0>;
