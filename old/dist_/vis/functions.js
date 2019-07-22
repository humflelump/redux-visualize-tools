'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getType = getType;
exports.getFunctionType = getFunctionType;
exports.isSelector = isSelector;
exports.id = id;
exports.getPathsToVariable = getPathsToVariable;
exports.pathToString = pathToString;

var _constants = require('./constants');

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getType(f) {
    try {
        if (f().name === 'wrapWithConnect') {
            return constants.CONNECT;
        }
    } catch (e) {}

    try {
        if ('resultFunc' in f()) {
            return constants.RESELECT_SELECTOR;
        }
    } catch (e) {}

    try {
        var sel = f({ async: function async() {
                return null;
            }, sync: function sync() {
                return null;
            } });

        if ('forceUpdate' in sel) {
            return constants.ASYNC_SELECTOR;
        }
    } catch (e) {}

    return constants.UNKNOWN;
}

function getFunctionType(f) {
    try {
        if (f.name === 'wrapWithConnect') {
            return constants.CONNECT;
        }
    } catch (e) {}

    try {
        if ('resultFunc' in f) {
            return constants.RESELECT_SELECTOR;
        }
    } catch (e) {}

    try {
        if ('forceUpdate' in f) {
            return constants.ASYNC_SELECTOR;
        }
    } catch (e) {}

    return constants.UNKNOWN;
}

function isSelector(f) {
    var type = getFunctionType(f);
    return type === constants.RESELECT_SELECTOR || type === constants.ASYNC_SELECTOR;
}

function id() {
    id.counter = (id.counter || 0) + 1;
    return id.counter;
}

function getPathsToVariable(state, variable) {
    var maxDepth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

    var solutions = [];
    helper(state, variable, maxDepth, solutions);
    return solutions;
}

function pathToString(solution) {
    return ['state'].concat(_toConsumableArray(solution)).join('.');
}

function helper(state, variable, maxDepth, solutions) {
    var depth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var history = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

    if (state === variable) {
        return solutions.push([].concat(_toConsumableArray(history)));
    } else if (depth > maxDepth) {
        return;
    } else if (state === null || (typeof state === 'undefined' ? 'undefined' : _typeof(state)) !== 'object') {
        return;
    } else {
        var keys = Object.keys(state);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            history.push(key);
            helper(state[key], variable, maxDepth, solutions, depth + 1, history);
            history.pop();
        }
    }
}