'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.update = undefined;
exports.vis = vis;
exports.createStateGetter = createStateGetter;

var _functions = require('./functions');

var functions = _interopRequireWildcard(_functions);

var _constants = require('./constants');

var constants = _interopRequireWildcard(_constants);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _extensionInterface = require('./extension-interface');

var extension = _interopRequireWildcard(_extensionInterface);

var messager = _interopRequireWildcard(_extensionInterface);

var _node3 = require('./node');

var _node4 = _interopRequireDefault(_node3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function vis(f) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var type = functions.getType(f);
    switch (type) {
        case constants.RESELECT_SELECTOR:
            return newReselect(f, name);
        case constants.CONNECT:
            return newConnect(f, name);
        case constants.ASYNC_SELECTOR:
            return newAsyncSelector(f, name);
        default:
            return f;
    }
}

function getFunctionName(func) {
    var defaultName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (typeof defaultName === 'string') return defaultName;
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

function handleDependency(currentNode, func) {
    if (constants.FUNC_KEY in func) {
        currentNode.addDependency(func[constants.FUNC_KEY]);
    } else {
        var leafType = functions.getFunctionType(func);
        var id = func[constants.FUNC_KEY] || functions.id();
        func[constants.FUNC_KEY] = id;
        if (leafType === constants.RESELECT_SELECTOR) {
            var node = new _node4.default(constants.DEFAULT_NAME, id, constants.RESELECT_SELECTOR, func);
            currentNode.addDependency(node.id);
            _store2.default.addNode(node);
        } else if (leafType === constants.ASYNC_SELECTOR) {
            var _node = new _node4.default(constants.DEFAULT_NAME, id, constants.ASYNC_SELECTOR, func);
            currentNode.addDependency(_node.id);
            _store2.default.addNode(_node);
        } else {
            var _node2 = new _node4.default(constants.DEFAULT_NAME, id, constants.STATE_VARIABLE, func);
            currentNode.addDependency(_node2.id);
            _store2.default.addNode(_node2);
        }
    }
    return currentNode;
}

function getDependencies(funcs) {
    var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;
    return dependencies;
}

function newReselect(create) {
    var defaultName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var id = functions.id();
    var result = function result() {
        for (var _len = arguments.length, f = Array(_len), _key = 0; _key < _len; _key++) {
            f[_key] = arguments[_key];
        }

        var selector = create.apply(undefined, f);
        selector[constants.FUNC_KEY] = id;
        var func = f.pop();
        var dependencies = getDependencies(f);
        var registeredDependencies = dependencies.filter(function (f) {
            return f[constants.FUNC_TYPE] === constants.SELECTOR;
        });
        var name = getFunctionName(func, defaultName);
        var node = new _node4.default(name, id, constants.RESELECT_SELECTOR, selector);
        _store2.default.addNode(node);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _f = _step.value;

                handleDependency(node, _f);
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

        var newSelector = function newSelector(state, props) {
            _store2.default.logId(id);
            var result = selector(state, props);
            //store.popIds(registeredDependencies.length);
            return result;
        };
        newSelector[constants.FUNC_KEY] = id;
        newSelector[constants.FUNC_TYPE] = constants.SELECTOR;
        return newSelector;
    };
    result[constants.FUNC_KEY] = id;
    return result;
}

function newConnect(connect) {
    var defaultName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var id = functions.id();
    return function (mapState, mapDispatch) {
        return function (Component) {
            var name = getNameFromComponent(Component, defaultName);
            setTimeout(function () {
                var state = _store2.default.getState();
                _store2.default.beginLogging();
                mapState(state);
                _store2.default.stopLogging();
                var node = new _node4.default(name, id, constants.CONNECT, mapState);
                _store2.default.loggedIds.forEach(function (id) {
                    return node.addDependency(id);
                });
                _store2.default.addNode(node);
            });
            return connect(mapState, mapDispatch)(Component);
        };
    };
}

function newAsyncSelector(create) {
    var defaultName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var id = functions.id();
    var result = function result(obj) {
        for (var _len2 = arguments.length, f = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            f[_key2 - 1] = arguments[_key2];
        }

        var selector = create.apply(undefined, [obj].concat(f));
        selector[constants.FUNC_KEY] = id;
        var func = obj.async;
        var dependencies = getDependencies(f);
        var registeredDependencies = dependencies.filter(function (f) {
            return f[constants.FUNC_TYPE] === constants.SELECTOR;
        });
        var name = getFunctionName(func, defaultName);
        var node = new _node4.default(name, id, constants.ASYNC_SELECTOR, selector);
        _store2.default.addNode(node);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _f2 = _step2.value;

                handleDependency(node, _f2);
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

        var newSelector = function newSelector(state, props) {
            _store2.default.logId(id);
            var result = selector(state, props);
            //store.popIds(registeredDependencies.length);
            return result;
        };
        newSelector[constants.FUNC_KEY] = id;
        newSelector[constants.FUNC_TYPE] = constants.SELECTOR;
        return newSelector;
    };
    result[constants.FUNC_KEY] = id;
    return result;
}

function createStateGetter(f) {
    _store2.default.setStateGetter(f);
}

var update = exports.update = messager.update;