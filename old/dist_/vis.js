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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var time = function time() {
    return performance.now();
};

var Node = function () {
    function Node(id, name, type) {
        _classCallCheck(this, Node);

        this.id = id;
        this.name = name;
        this.type = type;
        this.indexedDependencies = {};
        this.dispatchId = -1;
        this.value = undefined;
        this.description = null;
        this.duration = null;

        this.changed = false;
        this.cached = false;
    }

    _createClass(Node, [{
        key: 'addDependency',
        value: function addDependency(node) {
            if (!(node.id in this.indexedDependencies)) {
                this.indexedDependencies[node.id] = node;
            }
        }
    }, {
        key: 'setDuration',
        value: function setDuration(time) {
            this.duration = time;
        }
    }, {
        key: 'setDescription',
        value: function setDescription(str) {
            this.description = str;
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            this.value = value;
            this.changed = true;
        }
    }, {
        key: 'setDispatchId',
        value: function setDispatchId(id) {
            this.dispatchId = id;
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            if (!this.changed && this.cached && this.value !== undefined) {
                return {
                    id: this.id,
                    useCache: true
                };
            }
            this.changed = false;
            this.cached = true;
            var result = _extends({}, this);
            delete result.changed;
            delete result.cached;
            delete result.indexedDependencies;
            result.dependencies = Object.keys(this.indexedDependencies);
            result.value = functions.tryMakeValueSerializable(result.value);

            return result;
        }
    }]);

    return Node;
}();

var ctxKey = '__VIS_PARENT_ID__';

var Graph = function () {
    function Graph() {
        var _this = this;

        _classCallCheck(this, Graph);

        this.stack = [];
        this.indexedNodes = {};
        this.store = null;
        this.dispatchId = 0;
        this.ctx = _react2.default.createContext(null);
        this.isTurnedOff = false;
        this.initialState = {};

        window.addEventListener('message', function (event) {
            if (_this.isTurnedOff === true) return;
            if (event.data && event.data.type === 'GRAPH_REQUESTED') {
                _this.displayGraphInExtension();
            }
        });

        window.addEventListener('message', function (event) {
            if (_this.isTurnedOff === true) return;
            if (event.data && event.data.type === 'GRAPH_REQUESTED_INITIAL') {
                _this.getAllNodes().forEach(function (n) {
                    n.cached = false;
                });
                _this.displayGraphInExtension();
            }
        });

        window.addEventListener('message', function (event) {
            if (event.data && event.data.type === 'CONSOLE_LOG') {
                var node = _this.indexedNodes[event.data.id];
                if (!node) return console.log('Failed to log node');
                console.log('-----Logged From Extension-----');
                console.log(node.value);
            }
        });
    }

    _createClass(Graph, [{
        key: 'doNothing',
        value: function doNothing() {
            this.isTurnedOff = true;
        }
    }, {
        key: 'getNodeById',
        value: function getNodeById(id) {
            return this.indexedNodes[id];
        }
    }, {
        key: 'getAllNodes',
        value: function getAllNodes() {
            var _this2 = this;

            var ids = Object.keys(this.indexedNodes);
            return ids.map(function (id) {
                return _this2.indexedNodes[id];
            });
        }
    }, {
        key: 'displayGraphInExtension',
        value: function displayGraphInExtension() {
            if (this.isTurnedOff === true) return;
            var nodes = this.serializeGraph();
            var firstMessage = {
                type: 'STARTED_SENDING',
                dispatchId: this.dispatchId
            };
            window.postMessage(firstMessage, '*');

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var node = _step.value;

                    try {
                        var message = {
                            type: 'NODE_SENT',
                            node: node
                        };
                        window.postMessage(message, '*');
                    } catch (e) {
                        var _message = {
                            type: 'NODE_SENT',
                            node: _extends({}, node, { value: '-Failed to Serialize-' })
                        };
                        window.postMessage(_message, '*');
                    }
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

            var finalMessage = {
                type: 'FINISHED_SENDING'
            };
            window.postMessage(finalMessage, '*');
        }
    }, {
        key: 'serializeGraph',
        value: function serializeGraph() {
            var _this3 = this;

            var result = Object.keys(this.indexedNodes).map(function (key) {
                return _this3.indexedNodes[key];
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
        value: function makeStateWatchableMemoized(obj, state) {
            if (this.cachedState === obj) return this.cachedWatchableState;
            var result = this.makeStateWatchable(obj, state);
            this.cachedState = obj;
            this.cachedWatchableState = result;
            return result;
        }
    }, {
        key: 'makeStateWatchable',
        value: function makeStateWatchable(obj, state) {
            return this.makeStateWatchableHelper(obj, state, 0, []);
        }
    }, {
        key: 'makeStateWatchableHelper',
        value: function makeStateWatchableHelper(obj, state, depth, historyKeys) {
            var _this4 = this;

            var newObj = {};
            var keys = Object.keys(obj);
            var stack = this.stack;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                var _loop = function _loop() {
                    var key = _step2.value;

                    var newKeys = [].concat(_toConsumableArray(historyKeys), [key]);
                    var name = functions.getStateVariableName(newKeys);
                    var node = _this4.getNodeById(name);
                    if (!node) {
                        var type = constants.STATE_VARIABLE;
                        node = new Node(name, name, type);
                        node.id = name;
                        _this4.addNode(node);
                    }

                    var child = _typeof(state[key]) === 'object' && state[key] !== null && !Array.isArray(state[key]) && _typeof(obj[key]) === 'object' && obj[key] !== null && !Array.isArray(obj[key]) ? _this4.makeStateWatchableHelper(obj[key], state[key], depth + 1, newKeys) : obj[key];

                    var getterFunc = function getterFunc() {
                        return child;
                    };

                    Object.defineProperty(newObj, key, {
                        get: function get() {
                            var result = getterFunc();

                            stack.push(node);
                            var currNode = stack.pop();
                            if (stack.length > 0) {
                                stack[stack.length - 1].addDependency(currNode);
                            }
                            if (node.value !== result) {
                                node.setValue(result);
                                node.setDispatchId(_this4.dispatchId);
                            }
                            return result;
                        },
                        enumerable: true
                    });
                };

                for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    _loop();
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

            return newObj;
        }
    }, {
        key: 'watchReduxStore',
        value: function watchReduxStore(store) {
            var _this5 = this;

            var ignoredActions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            var ignoredActionsSet = new Set(ignoredActions);
            console.log('woo', store, store.getState());
            this.initialState = store.getState();

            var disp = store.dispatch;
            store.dispatch = function () {
                var action = arguments.length <= 0 ? undefined : arguments[0];
                if (action && !ignoredActionsSet.has(action.type)) {
                    _this5.dispatchId += 1;
                }
                var result = disp.apply(undefined, arguments);
                return result;
            };
            this.store = store;
            return store;
        }
    }, {
        key: 'inject',
        value: function inject(f, name, type, description) {
            var ref = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

            var stack = this.stack;
            var id = functions.make_id(name);
            var node = new Node(id, name, type);
            node.setDescription(description);
            ref.node = node;
            this.addNode(node);
            return function () {
                stack.push(node);
                var result = f.apply(undefined, arguments);
                node.setValue(result);
                var currNode = stack.pop();
                if (stack.length > 0) {
                    stack[stack.length - 1].addDependency(currNode);
                }
                return result;
            };
        }
    }, {
        key: 'add',
        value: function add(f) {
            var _this6 = this;

            var defaultName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            if (this.isTurnedOff === true) return f;
            var type = functions.getType(f);
            if (type === constants.RESELECT_SELECTOR) {
                return function () {
                    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
                        funcs[_key] = arguments[_key];
                    }

                    var node = null;
                    var mainFunction = funcs.pop();
                    var newMainFunction = function newMainFunction() {
                        var now = time();
                        var result = mainFunction.apply(undefined, arguments);
                        var duration = time() - now;
                        if (node !== null) {
                            node.setDispatchId(_this6.dispatchId);
                            node.setDuration(duration);
                        }
                        return result;
                    };
                    funcs.push(newMainFunction);
                    var selector = f.apply(undefined, funcs);
                    var name = functions.getFunctionName(mainFunction, defaultName);
                    var ref = {};
                    var newFunc = _this6.inject(selector, name, type, description, ref);
                    node = ref.node;
                    return newFunc;
                };
            } else if (type === constants.ASYNC_SELECTOR) {
                return function (obj) {
                    for (var _len2 = arguments.length, funcs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                        funcs[_key2 - 1] = arguments[_key2];
                    }

                    var node = void 0;
                    var mainFunction = obj.async;

                    var setDispatchIdAfterCallback = function setDispatchIdAfterCallback(key) {
                        if (typeof obj[key] !== 'function') return;
                        var f = obj[key];
                        obj[key] = function () {
                            var curr = _this6.dispatchId;
                            f.apply(undefined, arguments);
                            var next = _this6.dispatchId;
                            if (next > curr) node.setDispatchId(_this6.dispatchId);
                        };
                    };
                    setDispatchIdAfterCallback('onResolve');
                    setDispatchIdAfterCallback('onReject');

                    var newAsync = function newAsync() {
                        var promise = mainFunction.apply(undefined, arguments);

                        return new Promise(function (resolve, reject) {
                            var now = time();
                            return promise.then(function () {
                                var duration = time() - now;
                                node.setDispatchId(_this6.dispatchId);
                                node.setDuration(duration);
                                resolve.apply(undefined, arguments);
                            }).catch(function () {
                                var duration = time() - now;
                                node.setDispatchId(_this6.dispatchId);
                                node.setDuration(duration);
                                reject.apply(undefined, arguments);
                            });
                        });
                    };
                    obj.async = newAsync;
                    var selector = f.apply(undefined, [obj].concat(funcs));
                    var name = functions.getFunctionName(mainFunction, defaultName);
                    var ref = {};
                    var newFunc = _this6.inject(selector, name, type, description, ref);
                    node = ref.node;
                    return newFunc;
                };
            } else if (type === constants.CONNECT) {
                var _ctxKey = '__VIS_PARENT_ID__';
                return function (mapState_, mapDispatch) {
                    for (var _len3 = arguments.length, params = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                        params[_key3 - 2] = arguments[_key3];
                    }

                    return function (Component) {
                        var mapState = mapState_ || function () {
                            return {};
                        };
                        var self = _this6;
                        var stack = _this6.stack;
                        var name = functions.getNameFromComponent(Component, defaultName);
                        var id = functions.make_id(name);
                        var node = new Node(id, name, type);
                        node.setDescription(description);
                        self.addNode(node);

                        var Parent = function (_React$Component) {
                            _inherits(Parent, _React$Component);

                            function Parent() {
                                _classCallCheck(this, Parent);

                                return _possibleConstructorReturn(this, (Parent.__proto__ || Object.getPrototypeOf(Parent)).apply(this, arguments));
                            }

                            _createClass(Parent, [{
                                key: 'getChildContext',
                                value: function getChildContext() {
                                    return _defineProperty({}, _ctxKey, id);
                                }
                            }, {
                                key: 'render',
                                value: function render() {
                                    if (self.store) {
                                        var state_ = self.store.getState();
                                        var state = self.makeStateWatchableMemoized(state_, self.initialState);
                                        stack.push(node);
                                        var now = time();
                                        node.setValue(mapState(state, this.props));
                                        node.setDuration(time() - now);
                                        node.setDispatchId(self.dispatchId);
                                        var currNode = stack.pop();
                                        if (stack.length > 0) {
                                            stack[stack.length - 1].addDependency(currNode);
                                        }
                                    } else {
                                        console.warn('watchReduxStore method was never called');
                                    }

                                    if (this.context[_ctxKey]) {
                                        var parentNode = self.getNodeById(this.context[_ctxKey]);
                                        parentNode.addDependency(node);
                                    }
                                    return _react2.default.createElement(Component, this.props);
                                }
                            }]);

                            return Parent;
                        }(_react2.default.Component);

                        Parent.childContextTypes = _defineProperty({}, _ctxKey, _propTypes2.default.string);
                        Parent.contextTypes = _defineProperty({}, _ctxKey, _propTypes2.default.string);

                        return f.apply(undefined, [mapState_, mapDispatch].concat(params))(Parent);
                    };
                };
            } else if (type === constants.REACT_COMPONENT) {
                var Component = f;
                var self = this;
                var _name = functions.getNameFromComponent(Component, defaultName);
                var id = functions.make_id(_name);
                var _node = new Node(id, _name, type);
                _node.setDescription(description);
                self.addNode(_node);

                var Parent = function (_React$Component2) {
                    _inherits(Parent, _React$Component2);

                    function Parent() {
                        _classCallCheck(this, Parent);

                        return _possibleConstructorReturn(this, (Parent.__proto__ || Object.getPrototypeOf(Parent)).apply(this, arguments));
                    }

                    _createClass(Parent, [{
                        key: 'getChildContext',
                        value: function getChildContext() {
                            return _defineProperty({}, ctxKey, id);
                        }
                    }, {
                        key: 'render',
                        value: function render() {
                            if (this.context[ctxKey]) {
                                var parentNode = self.getNodeById(this.context[ctxKey]);
                                parentNode.addDependency(_node);
                            }
                            return _react2.default.createElement(Component, this.props);
                        }
                    }]);

                    return Parent;
                }(_react2.default.Component);

                Parent.childContextTypes = _defineProperty({}, ctxKey, _propTypes2.default.string);
                Parent.contextTypes = _defineProperty({}, ctxKey, _propTypes2.default.string);

                return Parent;
            } else if (type === constants.FUNCTION) {
                var _node2 = void 0;
                var _name2 = functions.getFunctionName(f, defaultName);
                var newFunc = function newFunc() {
                    var now = time();
                    var result = f.apply(undefined, arguments);
                    if (_node2) {
                        _node2.setDuration(time() - now);
                        _node2.setDispatchId(_this6.dispatchId);
                    }
                    return result;
                };
                var ref = {};
                var returnFunc = this.inject(newFunc, _name2, type, description, ref);
                _node2 = ref.node;
                return returnFunc;
            }
        }
    }]);

    return Graph;
}();

/*
return (
    <ParentContext.Consumer>
        {
            (parentId) => {
                if (parentId !== null) {
                    const parentNode = self.getNodeById(parentId);
                    parentNode.addDependency(node);
                }
                return <ParentContext.Provider value={node.id}>
                    <Component {...props} />
                </ParentContext.Provider>
            }
        }
    </ParentContext.Consumer>
);*/

var graph = new Graph();
//setInterval(() => console.log(graph), 2000);

exports.default = graph;