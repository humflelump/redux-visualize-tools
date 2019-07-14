import * as constants from './constants';
export declare function getFunctionName(func: Function, defaultName?: string): string;
export declare function getNameFromComponent(comp: any, defaultName?: string): any;
export declare function makeId(name: string): string;
export declare function currentTime(): number;
export declare function getType(f: any): constants.NODE_TYPES.RESELECT_SELECTOR | constants.NODE_TYPES.ASYNC_SELECTOR | constants.NODE_TYPES.CONNECT | constants.NODE_TYPES.REACT_COMPONENT | constants.NODE_TYPES.FUNCTION | "UNKNOWN";
