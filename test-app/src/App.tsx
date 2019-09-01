import React from "react";
import logo from "./logo.svg";
import { Component1 } from "./component1/component";
import { Component2 } from "./component2/component";
import "./App.css";
import { graph } from "redux-visualize-tools";
import { Hook } from "./component1/hook";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Component1 />
        <Component2 />
        <Hook />
      </div>
    );
  }
}

export default graph.add(App);
