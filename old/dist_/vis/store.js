'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
    function Store() {
        _classCallCheck(this, Store);

        this.nodes = [];
        this.indexedNodes = {};
        this.loggedIds = [];
        this.isLoggingOn = false;
        this.getState = function () {
            throw 'Add state getter function';
        };
        this.should;
    }

    _createClass(Store, [{
        key: 'getSerializableNodes',
        value: function getSerializableNodes(state) {
            return this.nodes.map(function (n) {
                return n.serializeWithDerivedState(state);
            });
        }
    }, {
        key: 'addNode',
        value: function addNode(node) {
            if (!(node.id in this.indexedNodes)) {
                this.nodes.push(node);
                this.indexedNodes[node.id] = node;
            }
        }
    }, {
        key: 'beginLogging',
        value: function beginLogging() {
            this.isLoggingOn = true;
            this.loggedIds = [];
        }
    }, {
        key: 'stopLogging',
        value: function stopLogging() {
            this.isLoggingOn = false;
        }
    }, {
        key: 'logId',
        value: function logId(id) {
            if (!this.isLoggingOn) return;
            this.loggedIds.push(id);
        }
    }, {
        key: 'popIds',
        value: function popIds(count) {
            if (!this.isLoggingOn) return;
            for (var i = 0; i < count; i++) {
                this.loggedIds.pop();
            }
        }
    }, {
        key: 'setStateGetter',
        value: function setStateGetter(f) {
            this.getState = f;
        }
    }]);

    return Store;
}();

var store = new Store();
exports.default = store;