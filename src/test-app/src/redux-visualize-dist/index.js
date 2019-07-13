"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var injection_1 = require("./injection");
function openWindow() {
    window.blah = "yeah";
    var child = window.open(window.location.origin);
    if (!child)
        return;
    child.document.open();
    child.document.write("\n    <html>\n        <script>\n            " + injection_1.CODE_TO_INJECT + "\n        </script>\n        <body>\n            wow omg huh\n        </body>\n    </html>\n    ");
    child.document.close();
}
exports.openWindow = openWindow;
