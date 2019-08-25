import React from 'react';
import ReactDOM from 'react-dom';
import { attachCommChannelToWindow } from './comm-channel/inject-to-window';
import { Provider } from 'react-redux';
import { store } from './store';
import { GraphComponent } from './graph/ui';
import { SidePanelComponent } from './side-panel/ui';
import { HeaderComponent } from './header/ui';
import { LeftPanelComponent } from './core-dev-tools/left-side-panel/ui';
import { SearchComponent } from './search/ui';

setTimeout(() => {
  ReactDOM.render(
    <Provider store={store}>
      <GraphComponent />
      <SidePanelComponent />
      <HeaderComponent />
      <LeftPanelComponent />
      <SearchComponent />
    </Provider>,
    document.getElementById('root')
  );
}, 0);

attachCommChannelToWindow();
console.log(window.opener);
