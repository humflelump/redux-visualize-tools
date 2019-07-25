"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants = __importStar(require("./constants"));
function getFunctionName(func, defaultName) {
    if (typeof defaultName === 'string')
        return defaultName;
    if (func && func.name && func.name !== '')
        return func.name;
    return 'Anonymous Function';
}
exports.getFunctionName = getFunctionName;
function getNameFromComponent(comp, defaultName) {
    if (typeof defaultName === 'string')
        return defaultName;
    if (comp && comp.constructor && comp.constructor.name !== 'Function')
        return comp.constructor.name;
    if (comp && comp.name !== '')
        return comp.name;
    return 'Anonymous Component';
}
exports.getNameFromComponent = getNameFromComponent;
function makeId(name) {
    makeId[name] = (makeId[name] || 0) + 1;
    return name + "_" + makeId[name].toString();
}
exports.makeId = makeId;
function currentTime() {
    return performance.now();
}
exports.currentTime = currentTime;
function isClassComponent(component) {
    return (typeof component === 'function'
        && component.prototype
        && !!component.prototype.isReactComponent) ? true : false;
}
function isFunctionComponent(component) {
    return (typeof component === 'function' &&
        String(component).includes('createElement')) ? true : false;
}
function isReactComponent(component) {
    return (isClassComponent(component) ||
        isFunctionComponent(component)) ? true : false;
}
function getType(f) {
    try {
        if (f().name === 'wrapWithConnect') {
            return constants.NODE_TYPES.CONNECT;
        }
    }
    catch (e) { }
    try {
        if ('resultFunc' in f()) {
            return constants.NODE_TYPES.RESELECT_SELECTOR;
        }
    }
    catch (e) { }
    try {
        var sel = f({ async: function () { return null; }, sync: function () { return null; } });
        if ('forceUpdate' in sel) {
            return constants.NODE_TYPES.ASYNC_SELECTOR;
        }
    }
    catch (e) { }
    if (isReactComponent(f)) {
        return constants.NODE_TYPES.REACT_COMPONENT;
    }
    if (typeof f === 'function') {
        return constants.NODE_TYPES.FUNCTION;
    }
    return 'UNKNOWN';
}
exports.getType = getType;
function isImmutableMap(d) {
    return d && typeof d === 'object' && 'get' in d && 'keySeq' in d;
}
exports.isImmutableMap = isImmutableMap;
function isObject(d) {
    return d && typeof d === 'object' && !('get' in d) && !Array.isArray(d);
}
exports.isObject = isObject;
function getStateVariableName(keys) {
    return "state." + keys.join('.');
}
exports.getStateVariableName = getStateVariableName;
function shallowEqual(o1, o2) {
    if (!isObject(o1) || !isObject(o2)) {
        return false;
    }
    var keys1 = Object.keys(o1);
    var keys2 = Object.keys(o2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (var i = 0; i < keys1.length; i++) {
        if (o1[keys1[i]] !== o2[keys2[i]]) {
            return false;
        }
    }
    return true;
}
exports.shallowEqual = shallowEqual;
