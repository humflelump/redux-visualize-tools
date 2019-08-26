import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { graph, windowManager } from "redux-visualize-tools";
import { connect } from "react-redux";
graph.enableViewingComponentsInDevTools(ReactDOM, Provider);

windowManager.appendIcon(() => {
  const child = windowManager.autoReloadDevToolsUntilClosed();
});

const initial = {
  wow: true,
  text: ""
};

const reducer = (state = initial, action) => {
  if (action.type === "type") {
    return {
      ...state,
      text: action.text
    };
  }
};

console.log({ graph });

const store = graph.enhance(createStore)(reducer);

store.dispatch({
  type: "type",
  text: "wow"
});

const Field = graph.add(connect)(
  state => ({ text: state.text }),
  dispatch => ({ set: text => dispatch({ type: "type", text }) })
)(({ text, set }) => (
  <input value={text} onChange={e => set(e.target.value)} />
));

const App2 = graph.add(() => {
  return (
    <div>
      <App />
      <Field />
    </div>
  );
});

window.store = store;

ReactDOM.render(
  <Provider store={store}>
    <div>
      <App2 />
    </div>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
