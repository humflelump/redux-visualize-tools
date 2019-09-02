import { Store } from 'redux';
import { WindowActions } from './reducers';

export function listenForResizeEvents(store: Store) {
  window.addEventListener('resize', () => {
    store.dispatch(
      WindowActions.setDimensions(window.innerWidth, window.innerHeight)
    );
  });
}
