import { State } from '../../store';
import { UINode } from '../../graph/types';
export declare const showPanelOnRight: import("reselect").OutputSelector<State, boolean, (res1: UINode, res2: number, res3: number) => boolean>;
export declare const isVisible: import("reselect").OutputSelector<State, boolean, (res: UINode) => boolean>;
