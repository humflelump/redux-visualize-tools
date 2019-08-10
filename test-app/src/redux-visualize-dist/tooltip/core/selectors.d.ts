import { State } from '../../store';
import { UINode } from "../../graph/types";
export declare const tooltipPosition: import("reselect").OutputSelector<State, {
    left: number;
    top: number;
    width: number;
    height: number;
    showOnRight: boolean;
}, (res1: UINode, res2: {
    left: number;
    top: number;
    width: number;
    height: number;
}) => {
    left: number;
    top: number;
    width: number;
    height: number;
    showOnRight: boolean;
}>;
