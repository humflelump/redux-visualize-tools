"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graph_1 = require("./vis/graph");
exports.graph = graph_1.graph;
var windowManager = __importStar(require("./window-manager"));
exports.windowManager = windowManager;
exports.default = graph_1.graph;
