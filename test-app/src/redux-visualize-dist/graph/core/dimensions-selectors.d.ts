import { State } from '../../store';
export declare const dimensions: import("reselect").OutputSelector<State, {
    left: number;
    top: number;
    width: number;
    height: number;
}, (res1: number, res2: number, res3: 0 | 400) => {
    left: number;
    top: number;
    width: number;
    height: number;
}>;
