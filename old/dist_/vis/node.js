'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = require('./functions');

var functions = _interopRequireWildcard(_functions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
    function Node(name, id, type, selector) {
        _classCallCheck(this, Node);

        this.name = name;
        this.id = id;
        this.type = type;
        this.selector = selector;
        this.dependencies = [];
    }

    _createClass(Node, [{
        key: 'addDependency',
        value: function addDependency(id) {
            if (this.dependencies.indexOf(id) < 0) {
                this.dependencies.push(id);
            }
        }
    }, {
        key: 'serializeWithDerivedState',
        value: function serializeWithDerivedState(state) {
            var self = _extends({}, this);
            delete self.selector;
            try {
                self.value = this.selector(state);
                self.pathsToState = functions.getPathsToVariable(state, self.value).map(functions.pathToString);
            } catch (e) {
                self.value = 'ERROR: ' + e.toString();
            }
            try {
                self.stringifiedResult = JSON.stringify(self.value);
            } catch (e) {
                self.stringifiedResult = 'Failed to Serialize';
            }
            return self;
        }
    }]);

    return Node;
}();

exports.default = Node;