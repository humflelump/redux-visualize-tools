'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getColorForType = getColorForType;
var STRING = exports.STRING = 'string';

var RESELECT_SELECTOR = exports.RESELECT_SELECTOR = 'RESELECT_SELECTOR';
var ASYNC_SELECTOR = exports.ASYNC_SELECTOR = 'ASYNC_SELECTOR';
var CONNECT = exports.CONNECT = 'CONNECT';
var STATE_VARIABLE = exports.STATE_VARIABLE = 'STATE_VARIABLE';
var FUNCTION = exports.FUNCTION = 'FUNCTION';
var UNKNOWN = exports.UNKNOWN = 'UNKNOWN';
var SELECTOR = exports.SELECTOR = 'SELECTOR';

var DEFAULT_NAME = exports.DEFAULT_NAME = 'Anonymous';

var FUNC_KEY = exports.FUNC_KEY = '__VIS_ID__';
var FUNC_TYPE = exports.FUNC_TYPE = '__VIS_TYPE__';

function getColorForType(type) {
    switch (type) {
        case STATE_VARIABLE:
            return 'rgb(175, 206, 255)';
        case RESELECT_SELECTOR:
            return 'rgb(175, 255, 197)';
        case ASYNC_SELECTOR:
            return 'rgb(135, 196, 152)';
        case CONNECT:
            return 'rgb(178, 163, 255)';
        default:
            return 'gray';
    }
}