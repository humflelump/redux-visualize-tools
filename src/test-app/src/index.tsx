import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { openWindow } from './redux-visualize-dist/index';
import { configureStore } from './store';
import { Provider } from 'react-redux';
import { graph } from './redux-visualize-dist/index';

console.log(graph);

const store = configureStore();
(window as any).store = store;

ReactDOM.render(
    <Provider store={store}>
        <button onClick={openWindow} >click me</button>
        <App />
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
