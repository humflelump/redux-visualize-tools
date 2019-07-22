'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getType = getType;
exports.convert = convert;
exports.make_id = make_id;
exports.getFunctionName = getFunctionName;
exports.getNameFromComponent = getNameFromComponent;
exports.getStateVariableName = getStateVariableName;
exports.getStateVariableValue = getStateVariableValue;
exports.areEqual = areEqual;
exports.tryMakeValueSerializable = tryMakeValueSerializable;

var _constants = require('./constants');

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

    if (isReactComponent(f)) {
        return constants.REACT_COMPONENT;
    }

    if (typeof f === 'function') {
        return constants.FUNCTION;
    }

    return constants.UNKNOWN;
}

function convert(obj) {
    var newObj = {};
    var keys = Object.keys(obj);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var key = _step.value;

            var child = _typeof(obj[key]) === 'object' && obj[key] !== null ? convert(obj[key]) : obj[key];
            Object.defineProperty(newObj, key, {
                get: function get() {
                    return child;
                },
                enumerable: true
            });
        };

        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return newObj;
}

function make_id(name) {
    make_id[name] = (make_id[name] || 0) + 1;
    return name + '_' + make_id[name].toString();
}

function getFunctionName(func) {
    var defaultName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (typeof defaultName === 'string') return defaultName;
    console.log(func, func.name);
    if (func && func.name && func.name !== '') return func.name;
    return constants.DEFAULT_NAME;
}

function getNameFromComponent(comp) {
    var defaultName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (typeof defaultName === 'string') return defaultName;
    if (comp && comp.constructor && comp.constructor.name !== 'Function') return comp.constructor.name;
    if (comp && comp.name !== '') return comp.name;
    return constants.DEFAULT_NAME;
}

function getStateVariableName(keys) {
    return 'state.' + keys.join('.');
}

function getStateVariableValue(state, keys) {
    var value = state;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            value = value[key];
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return value;
}

function isClassComponent(component) {
    return typeof component === 'function' && !!component.prototype.isReactComponent ? true : false;
}

function isFunctionComponent(component) {

    return typeof component === 'function' && String(component).includes('createElement') ? true : false;
}

function isReactComponent(component) {
    return isClassComponent(component) || isFunctionComponent(component) ? true : false;
}

function areEqual(a, b) {
    if (a === b) return true;
    if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object' || a === null || Array.isArray(a)) return false;
    if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object' || b === null || Array.isArray(b)) return false;
    var keys = Object.keys(a);
    var bKeys = Object.keys(b);
    if (keys.length !== bKeys.length) return false;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var key = _step3.value;

            if (a[key] !== b[key]) {
                return false;
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return true;
}

function tryMakeValueSerializable(value) {
    if (typeof value === 'function') {
        return '-Function-';
    }
    if (!value || Array.isArray(value) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
        return value;
    }
    var newObj = {};
    for (var key in value) {
        if (typeof value[key] === 'function') {
            newObj[key] = '-Function-';
        } else {
            newObj[key] = value[key];
        }
    }
    return newObj;
}