import { divide } from "./other";
import React from 'react';
import ReactDOM from 'react-dom';
import { attachCommChannelToWindow } from './comm-channel/inject-to-window'
import { Provider } from "react-redux";
import { store } from "./store";

function add(x: number) {
    return x + 6
}

setTimeout(() => {
    ReactDOM.render(
        <Provider store={store}>
            <button>omg</button>
        </Provider>, 
        document.getElementById('root')
    );
}, 0);


attachCommChannelToWindow();
console.log(window.opener);