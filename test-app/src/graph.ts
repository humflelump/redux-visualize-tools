const isProduction = true;

export const graph = isProduction
  ? (() => {
      const tools = require("redux-visualize-tools");
      tools.windowManager.appendIcon(() => {
        tools.windowManager.autoReloadDevToolsUntilClosed();
      });
      return tools.graph;
    })()
  : { add: f => f, enhance: f => f };
