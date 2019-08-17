import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { openWindow, graph, appendIcon } from "redux-visualize-tools";
import { configureStore } from "./store";
import { Provider } from "react-redux";
import Immutable from "immutable";
import { D3Test } from "./component1/test";
import diff from "deep-diff";

const a = {
  a: 5,
  b: 7
};

const b = {
  a: 8,
  b: 7,
  c: {
    a: 8,
    b: 7
  }
};

const c = {
  a: 9,
  b: 7,
  c: {
    a: 8,
    b: 7
  }
};

class Diff {
  forward: any;
  backward: any;
  constructor(a: any, b: any) {
    this.forward = diff.diff(a, b);
    this.backward = diff.diff(b, a);
  }

  next(a) {
    for (const change of this.forward) {
      diff.applyChange(a, null, change);
    }
    return a;
  }

  prev(b) {
    for (const change of this.backward) {
      diff.applyChange(a, null, change);
    }
    return b;
  }
}

const d1 = new Diff(a, b);
const d2 = new Diff(b, c);
let x1 = d1.next(a);
const x2 = d2.next(x1);
const x3 = d2.prev(x2);
const x4 = d1.prev(x3);
console.log(x4);
console.log(graph);

appendIcon();

const store = configureStore();
(window as any).store = store;

ReactDOM.render(
  <Provider store={store}>
    <App />
    <D3Test />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
