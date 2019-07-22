import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { openWindow, graph } from 'redux-visualize-tools';
import { configureStore } from './store';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import dagre from 'dagre';


// // Create a new directed graph 
// var g = new dagre.graphlib.Graph();

// // Set an object for the graph label
// g.setGraph({});

// // Default to assigning a new object as a label for each new edge.
// g.setDefaultEdgeLabel(function() { return {}; });

// // Add nodes to the graph. The first argument is the node id. The second is
// // metadata about the node. In this case we're going to add labels to each of
// // our nodes.
// g.setNode("kspacey",    { label: "Kevin Spacey",  width: 144, height: 100 });
// g.setNode("swilliams",  { label: "Saul Williams", width: 160, height: 100 });
// g.setNode("bpitt",      { label: "Brad Pitt",     width: 108, height: 100 });
// g.setNode("hford",      { label: "Harrison Ford", width: 168, height: 100 });
// g.setNode("lwilson",    { label: "Luke Wilson",   width: 144, height: 100 });
// g.setNode("kbacon",     { label: "Kevin Bacon",   width: 121, height: 100 });

// // Add edges to the graph.
// g.setEdge("kspacey",   "swilliams");
// g.setEdge("swilliams", "kbacon");
// g.setEdge("bpitt",     "kbacon");
// g.setEdge("hford",     "lwilson");
// g.setEdge("lwilson",   "kbacon");

// dagre.layout(g);

// g.nodes().forEach(function(v) {
//     console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
// });
// g.edges().forEach(function(e) {
//    console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
// });


console.log(graph);

const store = configureStore();
(window as any).store = store;

ReactDOM.render(
    <Provider store={store}>
        <button onClick={() => {
            openWindow();
            
        }} >click me</button>
        <App />
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
