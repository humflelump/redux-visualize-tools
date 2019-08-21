"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var functions_1 = require("./functions");
var immutable_1 = __importDefault(require("immutable"));
var react_1 = __importDefault(require("react"));
var ctxKey = "__VIS_PARENT_ID__";
var emptyAction = {
    action: null,
    prevState: undefined,
    nextState: undefined,
    actionNumber: -1,
    startTime: -1,
    endTime: -1
};
var Node = /** @class */ (function () {
    function Node(id, name, type, metadata) {
        if (metadata === void 0) { metadata = {}; }
        this.id = id;
        this.metadata = metadata;
        this.type = type;
        this.name = name;
        this.dependencies = [];
        this.value = undefined;
        this.duration = undefined;
        this.action = undefined;
        this.function = undefined;
        this.componentInfo = {};
    }
    Node.prototype.setReactComponent = function (component, props) {
        this.componentInfo.component = component;
        this.componentInfo.props = props;
    };
    Node.prototype.setActionThatCausedCall = function (action) {
        this.action = action;
    };
    Node.prototype.setDuration = function (duration) {
        this.duration = duration;
    };
    Node.prototype.setValue = function (value) {
        this.value = value;
    };
    Node.prototype.setFunction = function (f) {
        this.function = f;
    };
    Node.prototype.addDependency = function (node) {
        if (!this.dependencies.find(function (d) { return d.id === node.id; })) {
            this.dependencies.push(node);
        }
    };
    Node.prototype.removeDependency = function (id) {
        this.dependencies = this.dependencies.filter(function (d) { return d.id !== id; });
    };
    return Node;
}());
exports.Node = Node;
var Graph = /** @class */ (function () {
    function Graph() {
        this.getterCache = [];
        this.stack = [];
        this.nodes = {};
        this.lastAction = emptyAction;
        this.stateInjectorCache = new Map();
        this.actions = [];
    }
    Graph.prototype.addNode = function (node) {
        this.nodes[node.id] = node;
    };
    Graph.prototype.getNodeById = function (id) {
        return this.nodes[id];
    };
    Graph.prototype.watch = function (f, name, type, metadata) {
        var stack = this.stack;
        var id = functions_1.makeId(name);
        var newNode = new Node(id, name, type, metadata);
        this.addNode(newNode);
        var func = function () {
            var d = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                d[_i] = arguments[_i];
            }
            stack.push(newNode);
            var result = f.apply(void 0, d);
            newNode.setValue(result);
            var currNode = stack.pop();
            if (!currNode) {
                throw new Error("Empty stack was popped");
            }
            if (stack.length > 0) {
                stack[stack.length - 1].addDependency(currNode);
            }
            return result;
        };
        return { func: func, newNode: newNode };
    };
    Graph.prototype.injectObject = function (d, history, cache, depth) {
        var _this = this;
        if (depth === void 0) { depth = 0; }
        if (cache.has(d)) {
            return cache.get(d);
        }
        if (depth > 6) {
            return d;
        }
        var newObj = {};
        var keys = Object.keys(d);
        var _loop_1 = function (key) {
            var newKeys = history.concat([key]);
            var nodeId = functions_1.getStateVariableName(newKeys);
            var node = this_1.getNodeById(nodeId);
            if (!node) {
                var type = constants_1.NODE_TYPES.STATE_VARIABLE;
                node = new Node(nodeId, nodeId, type);
                node.setValue(d[key]);
                this_1.addNode(node);
            }
            var child;
            if (functions_1.isObject(d[key])) {
                child = this_1.injectObject(d[key], newKeys, cache, depth + 1);
            }
            else if (functions_1.isImmutableMap(d[key])) {
                child = this_1.injectImmutable(d[key], newKeys, cache, depth + 1);
            }
            else {
                child = d[key];
            }
            var self_1 = this_1;
            Object.defineProperty(newObj, key, {
                get: function () {
                    var newHistory = history.concat([key]);
                    // only mark the root it accesses as a dependency
                    if (_this.getterCache.length === history.length) {
                        if (self_1.stack.length > 0) {
                            var id = functions_1.getStateVariableName(history);
                            self_1.stack[self_1.stack.length - 1].removeDependency(id);
                        }
                    }
                    _this.getterCache = newHistory;
                    var nodeId = functions_1.getStateVariableName(newKeys);
                    var node = self_1.getNodeById(nodeId);
                    if (!node)
                        return child;
                    if (self_1.stack.length > 0) {
                        self_1.stack[self_1.stack.length - 1].addDependency(node);
                    }
                    if (node.value !== d[key]) {
                        node.setValue(d[key]);
                        node.setActionThatCausedCall(self_1.lastAction);
                    }
                    return child;
                },
                enumerable: true
            });
        };
        var this_1 = this;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            _loop_1(key);
        }
        cache.set(d, newObj);
        return newObj;
    };
    Graph.prototype.injectImmutable = function (d, history, cache, depth) {
        var _this = this;
        if (depth === void 0) { depth = 0; }
        if (cache.has(d)) {
            return cache.get(d);
        }
        if (depth > 6) {
            return d;
        }
        var newObj = immutable_1.default.fromJS({});
        for (var _i = 0, _a = d.keySeq().toJS(); _i < _a.length; _i++) {
            var key = _a[_i];
            var newKeys = history.concat([key]);
            var nodeId = functions_1.getStateVariableName(newKeys);
            var node = this.getNodeById(nodeId);
            if (!node) {
                var type = constants_1.NODE_TYPES.STATE_VARIABLE;
                node = new Node(nodeId, nodeId, type);
                this.addNode(node);
            }
            node.setValue(d.get(key));
            var child = void 0;
            var got = d.get(key);
            if (functions_1.isObject(got)) {
                child = this.injectObject(got, newKeys, cache, depth + 1);
            }
            else if (functions_1.isImmutableMap(got)) {
                child = this.injectImmutable(got, newKeys, cache, depth + 1);
            }
            else {
                child = got;
            }
            newObj = newObj.set(key, child);
        }
        var get = newObj.__proto__.get.bind(newObj);
        var getIn = newObj.__proto__.getIn.bind(newObj);
        newObj.get = function (key) {
            var newKeys = history.concat([key]);
            if (_this.getterCache.length === history.length) {
                if (_this.stack.length > 0) {
                    var id = functions_1.getStateVariableName(history);
                    _this.stack[_this.stack.length - 1].removeDependency(id);
                }
            }
            _this.getterCache = newKeys;
            var nodeId = functions_1.getStateVariableName(newKeys);
            var node = _this.getNodeById(nodeId);
            var result = get(key);
            if (!node) {
                return result;
            }
            if (_this.stack.length > 0) {
                _this.stack[_this.stack.length - 1].addDependency(node);
            }
            if (node.value !== result) {
                node.setValue(result);
                node.setActionThatCausedCall(_this.lastAction);
            }
            return result;
        };
        newObj.getIn = function (arr) {
            var result = newObj;
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var key = arr_1[_i];
                result = result.get(key);
            }
            return result;
        };
        cache.set(d, newObj);
        return newObj;
    };
    Graph.prototype.injectState = function (state) {
        var history = [];
        var cache = this.stateInjectorCache;
        if (cache.has(state)) {
            return cache.get(state);
        }
        var result;
        if (functions_1.isImmutableMap(state)) {
            result = this.injectImmutable(state, history, cache);
        }
        else if (functions_1.isObject(state)) {
            result = this.injectObject(state, history, cache);
        }
        else {
            result = state;
        }
        cache.set(state, result);
        cache.set(result, result); // the second cache is a trick so that selector calls will hit this cache.
        return result;
    };
    // Main function that enhances create store
    Graph.prototype.enhance = function (createStore) {
        var _this = this;
        var result = function (reducer) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var newReducer = function (state, action) {
                if (action.type === "DEV_TOOLS_SET_STATE") {
                    return action.state;
                }
                return reducer(state, action);
            };
            var store = createStore.apply(void 0, [newReducer].concat(params));
            _this.store = store;
            var dispatch = function (action) {
                var prev = store.getState();
                var startTime = functions_1.currentTime();
                // This object was created before "const result = store.dispatch(action);"
                // was called so all the functions that are triggered after the dispatch
                // have a reference to this object. More data is added later
                _this.lastAction = {
                    action: action,
                    prevState: prev,
                    nextState: null,
                    actionNumber: _this.lastAction.actionNumber + 1,
                    startTime: startTime,
                    endTime: -1
                };
                var result = store.dispatch(action);
                var endTime = functions_1.currentTime();
                var next = store.getState();
                _this.lastAction.nextState = next;
                _this.lastAction.endTime = endTime;
                _this.actions.push(_this.lastAction);
                return result;
            };
            return __assign({}, store, { dispatch: dispatch });
        };
        return result;
    };
    Graph.prototype.add = function (f, metadata) {
        if (metadata === void 0) { metadata = {}; }
        var type = functions_1.getType(f);
        if (type === "UNKNOWN") {
            throw new Error("Function is not a known type");
        }
        switch (type) {
            case constants_1.NODE_TYPES.FUNCTION:
                return this.addFunction(f, metadata);
            case constants_1.NODE_TYPES.RESELECT_SELECTOR:
                return this.addReselectSelector(f, metadata);
            case constants_1.NODE_TYPES.CONNECT:
                return this.addConnect(f, metadata);
            default:
                return f;
        }
    };
    Graph.prototype.addConnect = function (f, metadata) {
        var _this = this;
        if (metadata === void 0) { metadata = {}; }
        var prevResult = null;
        var result = function (mapState_, mapDispatch) {
            var params = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                params[_i - 2] = arguments[_i];
            }
            return function (DumbComponent) {
                var name = functions_1.getNameFromComponent(DumbComponent, metadata.name);
                var id = functions_1.makeId(name);
                var type = constants_1.NODE_TYPES.CONNECT;
                var node = new Node(id, name, type, metadata);
                _this.addNode(node);
                var self = _this;
                var mapState = mapState_ || (function () { return ({}); });
                node.setFunction(mapState);
                var newMapState = function (state) {
                    var params = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        params[_i - 1] = arguments[_i];
                    }
                    _this.stack.push(node);
                    var now = functions_1.currentTime();
                    // Turn the store into a listener if it isn't already
                    var injectedState = _this.injectState(state);
                    var result = mapState.apply(void 0, [injectedState].concat(params));
                    if (!functions_1.shallowEqual(prevResult, result)) {
                        node.setActionThatCausedCall(_this.lastAction);
                        node.setDuration(functions_1.currentTime() - now);
                        node.setValue(result);
                        prevResult = result;
                    }
                    _this.stack.pop();
                    return result;
                };
                var Parent = /** @class */ (function (_super) {
                    __extends(Parent, _super);
                    function Parent() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Parent.prototype.render = function () {
                        if (this.context[ctxKey]) {
                            var parentNode = self.getNodeById(this.context[ctxKey]);
                            parentNode.addDependency(node);
                        }
                        node.setReactComponent(DumbComponent, this.props);
                        return react_1.default.createElement(DumbComponent, __assign({}, this.props));
                    };
                    return Parent;
                }(react_1.default.Component));
                return f.apply(void 0, [newMapState, mapDispatch].concat(params))(Parent);
            };
        };
        return result;
    };
    Graph.prototype.addFunction = function (f, metadata) {
        var _this = this;
        if (metadata === void 0) { metadata = {}; }
        var name = functions_1.getFunctionName(f, metadata.name);
        var type = constants_1.NODE_TYPES.FUNCTION;
        var _a = this.watch(f, name, type, metadata), func = _a.func, newNode = _a.newNode;
        newNode.setFunction(f);
        var returnFunc = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var t = functions_1.currentTime();
            var result = func.apply(void 0, params);
            newNode.setDuration(functions_1.currentTime() - t);
            newNode.setActionThatCausedCall(_this.lastAction);
            return result;
        };
        return returnFunc;
    };
    Graph.prototype.addReselectSelector = function (f, metadata) {
        var _this = this;
        if (metadata === void 0) { metadata = {}; }
        var type = constants_1.NODE_TYPES.RESELECT_SELECTOR;
        var node;
        var newFunction = function () {
            var funcs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                funcs[_i] = arguments[_i];
            }
            var mainFunction = funcs.pop();
            var name = functions_1.getFunctionName(mainFunction, metadata.name);
            if (typeof mainFunction !== "function") {
                throw new Error("Last argument of a reselect selector must be a function");
            }
            var newMainFunc = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                var t = functions_1.currentTime();
                var result = mainFunction.apply(void 0, params);
                if (!node) {
                    throw new Error("Node unexpectedly undefined");
                }
                node.setDuration(functions_1.currentTime() - t);
                node.setActionThatCausedCall(_this.lastAction);
                return result;
            };
            funcs.push(newMainFunc);
            var selector = f.apply(void 0, funcs);
            var newSelector = function (state) {
                var params = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    params[_i - 1] = arguments[_i];
                }
                // Turn the store into a listener if it isn't already
                var injected = _this.injectState(state);
                return selector.apply(void 0, [injected].concat(params));
            };
            var _a = _this.watch(newSelector, name, type, metadata), func = _a.func, newNode = _a.newNode;
            node = newNode;
            node.setFunction(mainFunction);
            return func;
        };
        return newFunction;
    };
    return Graph;
}());
exports.Graph = Graph;
exports.graph = new Graph();
