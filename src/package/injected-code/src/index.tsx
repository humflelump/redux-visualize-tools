import React from 'react';
import ReactDOM from 'react-dom';
import { attachCommChannelToWindow } from './comm-channel/inject-to-window'
import { Provider } from "react-redux";
import { store } from "./store";
import { GraphComponent } from "./graph/ui";
import { SidePanelComponent } from "./side-panel/ui";
import { HeaderComponent } from "./header/ui";

setTimeout(() => {
    ReactDOM.render(
        <Provider store={store}>
            <GraphComponent />
            <SidePanelComponent />
            <HeaderComponent />
        </Provider>, 
        document.getElementById('root')
    );
}, 0);

attachCommChannelToWindow();
console.log(window.opener);