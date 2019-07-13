import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import connectWindowToStore from '../../app/window/listener';


chrome.storage.local.get('state', (obj) => {
  const { state } = obj;
  const initialState = JSON.parse('{}');

  const createStore = require('../../app/store/configureStore');
  const store = createStore(initialState);
  window.store = store;
  
  store.subscribe(() => {
    console.log(window.store.getState());
  });


  connectWindowToStore();

  ReactDOM.render(
    <Root store={store} />,
    document.querySelector('#root')
  );
});
