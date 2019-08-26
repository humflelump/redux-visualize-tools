import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { configureStore } from "./store";
import { Provider } from "react-redux";
import Immutable from "immutable";
import { D3Test } from "./component1/test";
import diff from "deep-diff";
import serialize from "serialize-javascript";
import { graph } from 'redux-visualize-tools';


graph.enableViewingComponentsInDevTools(ReactDOM, Provider);

// const isobj = o => typeof o === 'string' && o !== null && !Array.isArray(o);

// function subtractDiff(o1, o2) {
//   if (!isobj(o1) || !isobj(o2)) {

//   }
// }

// let t = performance.now();
// console.log((window as any).postMessage(L));
// console.log("took", performance.now() - t);

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
