"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var injection_1 = require("./injection");
function openWindow() {
    window.blah = "yeah";
    var child = window.open(window.location.origin, 'dev-tools', "width=500, height=500");
    if (!child)
        return;
    child.document.open();
    child.document.write("\n    <html>\n        <head>\n            <script id=\"injected-react-code\">\n            " + injection_1.CODE_TO_INJECT.code + " \n            </script>\n        </head>\n        <body>\n            <div id=\"root\" />\n        </body>\n    </html>\n    ");
    child.document.close();
}
exports.openWindow = openWindow;
