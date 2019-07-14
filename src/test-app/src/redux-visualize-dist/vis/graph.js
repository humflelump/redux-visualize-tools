"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var functions_1 = require("./functions");
;
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
    }
    Node.prototype.setActionThatCausedCall = function (action) {
        this.action = action;
    };
    Node.prototype.setDuration = function (duration) {
        this.duration = duration;
    };
    Node.prototype.setValue = function (value) {
        this.value = value;
    };
    Node.prototype.addDependency = function (node) {
        if (!this.dependencies.find(function (d) { return d.id === node.id; })) {
            this.dependencies.push(node);
        }
    };
    return Node;
}());
exports.Node = Node;
var Graph = /** @class */ (function () {
    function Graph() {
        this.stack = [];
        this.nodes = {};
        this.lastAction = {
            userAction: null,
            actionNumber: 0,
        };
    }
    Graph.prototype.setCurrentAction = function (action) {
        this.lastAction = {
            userAction: action,
            actionNumber: this.lastAction.actionNumber + 1,
        };
    };
    Graph.prototype.addNode = function (node) {
        this.nodes[node.id] = node;
    };
    Graph.prototype.watch = function (f, name, type, metadata) {
        var _this = this;
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
            newNode.setActionThatCausedCall(_this.lastAction);
            var currNode = stack.pop();
            if (!currNode) {
                throw new Error('Empty stack was popped');
            }
            if (stack.length > 0) {
                stack[stack.length - 1].addDependency(currNode);
            }
            return result;
        };
        return { func: func, newNode: newNode };
    };
    Graph.prototype.add = function (f, metadata) {
        if (metadata === void 0) { metadata = {}; }
        var type = functions_1.getType(f);
        if (type === 'UNKNOWN') {
            throw new Error('Function is not a know type');
        }
        switch (type) {
            case constants_1.NODE_TYPES.FUNCTION:
                return this.addFunction(f, metadata);
            case constants_1.NODE_TYPES.RESELECT_SELECTOR:
                return this.addReselectSelector(f, metadata);
            default:
                return f;
        }
    };
    Graph.prototype.addFunction = function (f, metadata) {
        if (metadata === void 0) { metadata = {}; }
        var name = functions_1.getFunctionName(f, metadata.name);
        var type = constants_1.NODE_TYPES.FUNCTION;
        var _a = this.watch(f, name, type, metadata), func = _a.func, newNode = _a.newNode;
        var returnFunc = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var t = functions_1.currentTime();
            var result = func.apply(void 0, params);
            newNode.setDuration(functions_1.currentTime() - t);
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
            if (typeof mainFunction !== 'function') {
                throw new Error('Last argument of a reselect selector must be a function');
            }
            var newMainFunc = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                var t = functions_1.currentTime();
                var result = mainFunction.apply(void 0, params);
                if (!node) {
                    throw new Error('Node unexpectedly undefined');
                }
                node.setDuration(functions_1.currentTime() - t);
                return result;
            };
            funcs.push(newMainFunc);
            var selector = f.apply(void 0, funcs);
            var _a = _this.watch(selector, name, type, metadata), func = _a.func, newNode = _a.newNode;
            node = newNode;
            return func;
        };
        return newFunction;
    };
    return Graph;
}());
exports.Graph = Graph;
// const g = new Graph();
// function f2_() {
//     return 5;
// }
// const f2 = g.addFunction(f2_, {});
// function f3_() {
//     return 3;
// }
// const f3 = g.addFunction(f3_, {description: 'wowowo', file: "file/fff"});
// function f1_() {
//     f2()
//     f3();
// }
// const f1 = g.addFunction(f1_, {});
// f1();
// console.log(g);
