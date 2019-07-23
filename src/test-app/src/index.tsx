import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { openWindow, graph } from 'redux-visualize-tools';
import { configureStore } from './store';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { D3Test } from './component1/test';





console.log(graph);

const store = configureStore();
(window as any).store = store;

ReactDOM.render(
    <Provider store={store}>
        <button onClick={() => {
            openWindow();

        }} >click me</button>
        <App />
        <D3Test />
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
