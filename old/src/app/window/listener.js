

export default function connectWindowToStore() {
    window.addEventListener('resize', () => {
      window.store.dispatch({
        type: 'SET_WINDOW_DIMENSIONS',
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });

    window.store.dispatch({
      type: 'SET_WINDOW_DIMENSIONS',
      width: window.innerWidth,
      height: window.innerHeight,
    });
}