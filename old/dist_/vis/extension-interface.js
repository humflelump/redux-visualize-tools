'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.update = update;

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.addEventListener('message', function (event) {
    if (event.data === 'GRAPH_REQUESTED') {
        update();
    }
    return true;
});

function update() {
    var state = _store2.default.getState();
    var message = {
        type: 'GRAPH_SENT',
        graph: _store2.default.getSerializableNodes(state)
    };
    window.postMessage(message, '*');
}