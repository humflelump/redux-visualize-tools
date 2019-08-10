import { Store } from 'redux';

export function listenForResizeEvents(store: Store) {
  window.addEventListener('resize', () => {
    store.dispatch({
      type: 'SET_WINDOW_DIMENSIONS',
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });
}
