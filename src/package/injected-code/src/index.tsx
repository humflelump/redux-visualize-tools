import { divide } from "./other";
import React from 'react';
import ReactDOM from 'react-dom';

function add(x: number) {
    return x + 6
}

setTimeout(() => {
    ReactDOM.render(<button>{add(7)}</button>, document.getElementById('root'));
}, 0)



console.log(window.opener);