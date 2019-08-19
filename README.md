![](dev-tools-video.gif)

Visualize the dependency graph, identify over-rendering and performance bottlenecks, and debug the entire flow of data from actions to state to selectors to components.

# Installation

```
yarn add redux-visualize-tools
```

# Getting Started

First, add a button that will launch the dev-tools. Launching can also be done programmatically.

```javascript
import { windowManager } from "redux-visualize-tools";

// Create a button that launches the tools in bottom-right of the screen
windowManager.appendIcon(() => {
  // dev-tool window will relaunch after every update to the app until you close the window
  windowManager.autoReloadDevToolsUntilClosed();
});
```

Second, enhance the redux store. This unlocks functionality like viewing actions and time travel debugging.

```javascript
import { graph } from "redux-visualize-tools";
import reducer from "./reducer";
import { createStore } from "redux";

export const store = graph.enhance(createStore)(reducer);
```

Finally add nodes to the dependency graph by enhancing functions, react components, reselect selectors, and react-redux connected components. In the example below, 3 nodes are added to the dependency graph; 1 component, 1 selector, and 1 state variable.

```javascript
import React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { graph } from "redux-visualize-tools";

const MyComponent = ({ text }) => <div>{text}</div>;

const getText = state => state.text;

const getDoubledText = graph.add(createSelector)(
  [getText],
  text => text + text
);

const mapState = state => ({
  text: getDoubledText(state)
});

export default graph.add(connect)(mapState, null)(MyComponent);
```

# Only Use in Development

The problem with the above code is that it is importing the library in production which will result in a large bundle. To avoid this, we need to set up a file that that only exports the dev-tool in production.

```javascript
/* Use this code if in development */

import { graph, windowManager } from "redux-visualize-tools";
windowManager.appendIcon(() => {
  windowManager.autoReloadDevToolsUntilClosed();
});
export { graph };

/* Use this code in production */

// This graph does nothing
export const graph = {
  add: f => f,
  enhance: f => f,
};
```

This requires manually editing this file before you make a build which isn't ideal. This can also be achieved automatically with a build script, a conditional import, or, in the future, a chrome extension.

# API

### graph.enhance(createStore: Function): Function

This enhances redux's createStore to enable core dev-tool functionality. This allows logging all actions, time travel debugging, and viewing the state.

### graph.add(func: Function, metadata?: object): Function

When applied to a function, it adds that function as node in the dependency graph. It can be applied to:

1. Vanilla functions
2. Vanilla React components
3. Connected components by passing in react-redux's "connect" function. You can also enhance the connect function once and just import it where it is used.
4. Selectors by passing in reselect's "createSelector". You can also enhance the createSelector function once and just import it where it is used.
5. Async selectors from async-selector.

The second parameter is any metadata you wish to attach to the node. It contains 3 optional values.

1. "name" - This is name of the node. This is important because it allows you to search for nodes in the dev-tools and to uniquely identify a node. If not passed in, the name will try to be inferred based on the name of the function passed in. For example, if you pass in a named function into createSelector, that function name will be the name of the node.
2. "file" - The file where the code came from. Webpack can give you access to the "\_\_filename" variable.
3. "description" - Any other documentation about the node you wish to provide.

### windowManager.openWindow(options?: string): window

This is the basic way of opening up a new dev-tool window. You may need to enable popups for this to work. You can pass in options which will be passed into the window.open() method. This way you can control things like the width and height of the dev-tools. It returns the child window.

### windowManager.autoReloadDevToolsUntilClosed(options?: string): window

Will open a window but will also automatically reload the window when the parent app updates or refreshes. It will keep reloading until you close the dev-tools. It returns the child window.

### windowManager.forceClearAutoload(): void

Will force the dev-tools to stop reloading.

### windowManager.appendIcon(callback?: () => void, buttonText?: string, cssText?: string): HTMLElement

A convenience function for placing a button on the screen. By default it places a button on the bottom right of the screen. When clicked, your callback is called. If no callback is passed in, it will open a new window.

# How It Works

Several methods are used to create the dependency graph at runtime. The basic idea is that it monitors the call stack to determine what the dependency graph is. To track when functions access state variables, the entire state tree is converted into a giant listener using Object.defineProperty. In the case of Immutable.js objects, it hacks into the prototype chain to the same effect. For react components, the dependency graph is obtained using React's context API.
