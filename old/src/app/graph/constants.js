
export const WIDTH = 150;
export const HEIGHT = 100;
export const PADDING = 50;

export const STRING = 'string';

export const RESELECT_SELECTOR = 'RESELECT_SELECTOR';
export const ASYNC_SELECTOR = 'ASYNC_SELECTOR';
export const CONNECT = 'CONNECT';
export const STATE_VARIABLE = 'STATE_VARIABLE';
export const FUNCTION = 'FUNCTION';
export const UNKNOWN = 'UNKNOWN';
export const SELECTOR = 'SELECTOR';
export const REACT_COMPONENT = 'REACT_COMPONENT';

export const DEFAULT_NAME = 'Anonymous';

export const FUNC_KEY = '__VIS_ID__';
export const FUNC_TYPE = '__VIS_TYPE__';

export function getColorForType(type) {
    switch(type) {
        case STATE_VARIABLE:
            return 'rgb(255, 241, 140)';
        case RESELECT_SELECTOR:
            return 'rgb(175, 255, 197)';
        case ASYNC_SELECTOR:
            return 'rgb(255, 132, 157)';
        case CONNECT:
            return 'rgb(248, 188, 255)';
        case REACT_COMPONENT:
            return 'rgb(147, 237, 255)';
        case FUNCTION:
            return 'rgb(255, 215, 147)';
        default:
            return 'gray';
    }
}

export const HEADER_SIZE = 48;

export const TRANSITION_MS = 200;

export const SETTINGS_WIDTH = 300;
