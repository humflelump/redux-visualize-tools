"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var injection_1 = require("./injection");
var graph_1 = require("./vis/graph");
exports.default = graph_1.Graph;
exports.graph = new graph_1.Graph();
function openWindow(options) {
    if (options === void 0) { options = "width=800, height=500"; }
    var child = window.open(window.location.origin, "dev-tools", options);
    setTimeout(function () {
        child.commChannel.sendGraph(exports.graph);
    }, 1000);
    if (!child)
        return;
    child.document.open();
    child.document.write("\n    <html>\n        <head>\n            <script id=\"injected-react-code\">\n            " + injection_1.CODE_TO_INJECT.code + " \n            </script>\n        </head>\n        <body>\n            <div id=\"root\" />\n        </body>\n    </html>\n    ");
    child.document.close();
}
exports.openWindow = openWindow;
