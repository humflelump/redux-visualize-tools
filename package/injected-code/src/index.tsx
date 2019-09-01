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
import { SelectedComponentContainer } from './selected-component';
import { ErrorBoundary } from './error-boundary';

function clearChildren(id: string) {
  const node = document.getElementById(id);
  if (!node) {
    return;
  }
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

setTimeout(() => {
  clearChildren('root'); // Seems to fix a bug where it sometimes crashes on load.
  ReactDOM.render(
    <Provider store={store}>
      <ErrorBoundary>
        <GraphComponent />
        <SidePanelComponent />
        <HeaderComponent />
        <LeftPanelComponent />
        <SearchComponent />
        <SelectedComponentContainer />
      </ErrorBoundary>
    </Provider>,
    document.getElementById('root')
  );
}, 0);

attachCommChannelToWindow();
console.log(window.opener);
