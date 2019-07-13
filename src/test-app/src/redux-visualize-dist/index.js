"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var injection_1 = require("./injection");
function openWindow() {
    window.blah = "yeah";
    var child = window.open(window.location.origin);
    if (!child) return;
        console.log({ child: child });
        child.document.open();
        child.document.write("\n        <html>\n            <script>\n                " + injection_1.code + "\n            </script>\n            <body>\n            wow im so smart\n            </body>\n        </html>\n        ");
        child.document.close();
    
}
exports.openWindow = openWindow;
