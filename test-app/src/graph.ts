import { graph, windowManager } from "redux-visualize-tools";

windowManager.appendIcon(() => {
  const child = windowManager.autoReloadDevToolsUntilClosed();
});

export { graph, windowManager };

// const isProduction = true;

// export const graph = isProduction
//   ? (() => {
//       const tools = require("redux-visualize-tools");
//       tools.windowManager.appendIcon(() => {
//         const child = tools.windowManager.autoReloadDevToolsUntilClosed();
//       });
//       return tools.graph;
//     })()
//   : { add: f => f, enhance: f => f };
