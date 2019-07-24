import { NODE_TYPES } from "../types";

export const COLORS = {
    [NODE_TYPES.RESELECT_SELECTOR]: 'blue',
    [NODE_TYPES.ASYNC_SELECTOR]: 'purple',
    [NODE_TYPES.CONNECT]: 'red',
    [NODE_TYPES.REACT_COMPONENT]: 'pink',
    [NODE_TYPES.STATE_VARIABLE]: 'green',
    [NODE_TYPES.FUNCTION]: 'lightblue',
};