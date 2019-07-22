'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = require('./functions');

var functions = _interopRequireWildcard(_functions);

var _constants = require('./constants');

var constants = _interopRequireWildcard(_constants);

var _constants2 = require('../vis/constants');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
    function Node(id, name, type) {
        _classCallCheck(this, Node);

        this.id = id;
        this.name = name;
        this.type = type;
        this.indexedDependencies = {};
        this.dispatchId = -1;
        this.value = undefined;
    }

    _createClass(Node, [{
        key: 'addDependency',
        value: function addDependency(node) {
            if (!(node.id in this.indexedDependencies)) {
                this.indexedDependencies[node.id] = node;
            }
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            this.value = value;
        }
    }, {
        key: 'setDispatchId',
        value: function setDispatchId(id) {
            this.dispatchId = id;
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            var result = _extends({}, this);
            delete result.indexedDependencies;
            result.dependencies = Object.keys(this.indexedDependencies);
            try {
                JSON.stringify(result.value);
            } catch (e) {
                result.value = 'Failed to Serialize';
            }
            try {
                result.stringifiedResult = JSON.stringify(result.value);
            } catch (e) {
                result.stringifiedResult = 'Failed to Serialize';
            }
            return result;
        }
    }]);

    return Node;
}();

var Graph = function () {
    function Graph() {
        var _this = this;

        _classCallCheck(this, Graph);

        this.stack = [];
        this.indexedNodes = {};
        this.store = null;
        this.dispatchId = 0;
        this.ctx = _react2.default.createContext(null);

        window.addEventListener('message', function (event) {
            if (event.data === 'GRAPH_REQUESTED') {
                _this.displayGraphInExtension();
            }
            return true;
        });
    }

    _createClass(Graph, [{
        key: 'getNodeById',
        value: function getNodeById(id) {
            return this.indexedNodes[id];
        }
    }, {
        key: 'displayGraphInExtension',
        value: function displayGraphInExtension() {
            var message = {
                type: 'GRAPH_SENT',
                graph: this.serializeGraph()
            };
            window.postMessage(message, '*');
        }
    }, {
        key: 'serializeGraph',
        value: function serializeGraph() {
            var _this2 = this;

            var result = Object.keys(this.indexedNodes).map(function (key) {
                return _this2.indexedNodes[key];
            }).map(function (node) {
                return node.serialize();
            });

            return result;
        }
    }, {
        key: 'addNode',
        value: function addNode(node) {
            this.indexedNodes[node.id] = node;
        }
    }, {
        key: 'makeStateWatchableMemoized',
        value: function makeStateWatchableMemoized(obj) {
            if (this.cachedState === obj) return this.cachedWatchableState;
            var result = this.makeStateWatchable(obj);
            this.cachedState = obj;
            this.cachedWatchableState = result;
            return result;
        }
    }, {
        key: 'makeStateWatchable',
        value: function makeStateWatchable(obj) {
            return this.makeStateWatchableHelper(obj, 0, []);
        }
    }, {
        key: 'makeStateWatchableHelper',
        value: function makeStateWatchableHelper(obj, depth, historyKeys) {
            var _this3 = this;

            var newObj = {};
            var keys = Object.keys(obj);
            var stack = this.stack;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var key = _step.value;

                    var newKeys = [].concat(_toConsumableArray(historyKeys), [key]);
                    var name = functions.getStateVariableName(newKeys);
                    var type = constants.STATE_VARIABLE;
                    var node = new Node(name, name, type);

                    var child = _typeof(obj[key]) === 'object' && obj[key] !== null ? _this3.makeStateWatchableHelper(obj[key], depth + 1, newKeys) : obj[key];

                    var getterFunc = function getterFunc() {
                        return child;
                    };

                    Object.defineProperty(newObj, key, {
                        get: function get() {
                            _this3.addNode(node);
                            stack.push(node);
                            var result = getterFunc();
                            node.setValue(result);
                            node.setDispatchId(_this3.dispatchId);
                            var currNode = stack.pop();
                            if (stack.length > 0) {
                                stack[stack.length - 1].addDependency(currNode);
                            }
                            return result;
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
    }, {
        key: 'watchReduxStore',
        value: function watchReduxStore(store) {
            var _this4 = this;

            var get = store.getState;
            store.getState = function () {
                var state = get.apply(undefined, arguments);
                var watchable = _this4.makeStateWatchableMemoized(state);
                return watchable;
            };
            var disp = store.dispatch;
            store.dispatch = function () {
                _this4.dispatchId += 1;
                var result = disp.apply(undefined, arguments);
                return result;
            };
            this.store = store;
            return store;
        }
    }, {
        key: 'inject',
        value: function inject(f, name, type) {
            var _this5 = this;

            var stack = this.stack;
            var id = functions.make_id();
            var node = new Node(id, name, type);
            this.addNode(node);
            return function () {
                stack.push(node);
                var result = f.apply(undefined, arguments);
                node.setValue(result);
                node.setDispatchId(_this5.dispatchId);
                var currNode = stack.pop();
                if (stack.length > 0) {
                    stack[stack.length - 1].addDependency(currNode);
                }
                return result;
            };
        }
    }, {
        key: 'vis',
        value: function vis(f) {
            var _this6 = this;

            var defaultName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var type = functions.getType(f);
            if (type === constants.RESELECT_SELECTOR) {
                return function () {
                    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
                        funcs[_key] = arguments[_key];
                    }

                    var selector = f.apply(undefined, funcs);
                    var mainFunction = funcs.pop();
                    var name = functions.getFunctionName(mainFunction, defaultName);
                    return _this6.inject(selector, name, type);
                };
            } else if (type === constants.ASYNC_SELECTOR) {
                return function (obj) {
                    for (var _len2 = arguments.length, funcs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                        funcs[_key2 - 1] = arguments[_key2];
                    }

                    var selector = f.apply(undefined, [obj].concat(funcs));
                    var mainFunction = obj.async;
                    var name = functions.getFunctionName(mainFunction, defaultName);
                    return _this6.inject(selector, name, type);
                };
            } else if (type === constants.CONNECT) {

                /*
                
                        const stack = this.stack;
                        const id = functions.make_id();
                        const node = new Node(id, name, type);
                        this.addNode(node);
                        return (...d) => {
                            stack.push(node)
                            const result = f(...d);
                            node.setValue(result);
                            node.setDispatchId(this.dispatchId);
                            const currNode = stack.pop();
                            if (stack.length > 0) {
                                stack[stack.length - 1].addDependency(currNode);
                            }
                            return result;
                        }
                */
                return function (mapState_, mapDispatch) {
                    return function (Component) {
                        var mapState = mapState_ || function () {
                            return {};
                        };
                        var self = _this6;
                        var stack = _this6.stack;
                        var id = functions.make_id();
                        var name = functions.getNameFromComponent(Component, defaultName);
                        var node = new Node(id, name, type);
                        self.addNode(node);
                        var ParentContext = self.ctx;

                        var ComponentWithParent = function ComponentWithParent(props) {
                            var state = self.store.getState();
                            stack.push(node);
                            node.setValue(mapState(state), props);
                            node.setDispatchId(self.dispatchId);
                            var currNode = stack.pop();
                            if (stack.length > 0) {
                                stack[stack.length - 1].addDependency(currNode);
                            }
                            return _react2.default.createElement(
                                ParentContext.Consumer,
                                null,
                                function (parentId) {
                                    if (parentId !== null) {
                                        var parentNode = self.getNodeById(parentId);
                                        parentNode.addDependency(node);
                                    }
                                    return _react2.default.createElement(
                                        ParentContext.Provider,
                                        { value: node.id },
                                        _react2.default.createElement(Component, props)
                                    );
                                }
                            );
                        };

                        return f(mapState, mapDispatch)(ComponentWithParent);
                    };
                };
            } else if (type === constants.FUNCTION) {
                var name = functions.getFunctionName(f, defaultName);
                return this.inject(f, name, type);
            }
        }
    }]);

    return Graph;
}();

var graph = new Graph();
setInterval(function () {
    return console.log(graph);
}, 2000);

exports.default = graph;