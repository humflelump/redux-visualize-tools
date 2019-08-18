"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var injection_1 = require("./injection");
var graph_1 = require("./vis/graph");
var injectedHtml = "\n<html>\n    <head>\n        <script id=\"injected-react-code\">\n        " + injection_1.CODE_TO_INJECT.code + " \n        </script>\n    </head>\n    <body>\n        <div id=\"root\" />\n    </body>\n</html>\n";
var DEFAULT_OPTIONS = "width=800, height=500";
var AUTO_LOAD_KEY = "_DEV_TOOLS_AUTO_LOAD_ENABLED_";
var AUTO_LOAD_OPTIONS_KEY = "_DEV_TOOLS_AUTO_LOAD_OPTIONS_";
var interval = null;
function openWindow(options) {
    if (options === void 0) { options = DEFAULT_OPTIONS; }
    window.clearInterval(interval);
    var child = window.open(window.location.origin, "dev-tools", options);
    setTimeout(function () {
        child.commChannel.sendGraph(graph_1.graph);
    });
    interval = setInterval(function () {
        if (!child || !child.commChannel) {
            return;
        }
        child.commChannel.ping();
    }, 200);
    if (!child)
        return;
    child.document.open();
    child.document.write(injectedHtml);
    child.document.close();
    return child;
}
exports.openWindow = openWindow;
function appendIcon(callback, buttonText, cssText) {
    if (callback === void 0) { callback = openWindow; }
    if (buttonText === void 0) { buttonText = "Dev Tools"; }
    if (cssText === void 0) { cssText = "position:fixed;right:10px;bottom:10px;z-index:100;"; }
    var button = document.createElement("button");
    button.style.cssText = cssText;
    button.innerText = buttonText;
    button.onclick = callback;
    document.body.appendChild(button);
}
exports.appendIcon = appendIcon;
function isAutoLoadOn() {
    var value = window.localStorage.getItem(AUTO_LOAD_KEY);
    return value === "true";
}
if (isAutoLoadOn()) {
    var options = window.localStorage.getItem(AUTO_LOAD_OPTIONS_KEY) || undefined;
    openWindow(options);
}
function forceClearAutoload() {
    window.localStorage.setItem(AUTO_LOAD_KEY, "false");
}
exports.forceClearAutoload = forceClearAutoload;
function autoReloadDevToolsUntilClosed(options) {
    if (options === void 0) { options = DEFAULT_OPTIONS; }
    if (typeof options !== "string") {
        throw Error("options must be a string");
    }
    window.localStorage.setItem(AUTO_LOAD_KEY, "true");
    window.localStorage.setItem(AUTO_LOAD_OPTIONS_KEY, options);
    openWindow(options);
}
exports.autoReloadDevToolsUntilClosed = autoReloadDevToolsUntilClosed;
