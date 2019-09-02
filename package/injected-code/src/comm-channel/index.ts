import { store } from '../store';
import { throttle } from 'lodash';
import { triggerResetZoomWhenGraphIsFinishedCalculating } from '../graph/core/selectors';
import { CommChannelActions } from './reducers';

export class MultiWindowCommChannel {
  private lastPing: number;
  constructor() {
    this.lastPing = Date.now();
  }

  public sendGraph(data: any) {
    const dispatch = () =>
      store.dispatch(
        CommChannelActions.setGraph({
          ...data,
          nodes: { ...data.nodes },
          actions: [...data.actions],
        })
      );
    const throttled = throttle(dispatch, 250);
    data.store.subscribe(() => setTimeout(throttled));
    dispatch();
    triggerResetZoomWhenGraphIsFinishedCalculating();
  }

  public ping() {
    this.lastPing = Date.now();
  }

  public isClientConnected() {
    return Date.now() - this.lastPing < 1500;
  }
}
export const commChannel = new MultiWindowCommChannel();

let showedAlert = false;

// When a user replaces the old dev-tool window with a new one
// the old interval isn't cleared so this will clear that interval
// if it exists
window.clearInterval((window as any).interval);

(window as any).interval = setInterval(() => {
  const connected = commChannel.isClientConnected();
  if (!connected && !showedAlert && !window.closed) {
    window.alert('No longer connected to app');
    showedAlert = true;
  }
}, 500);

window.onunload = () => {
  // When the user closes the window, turn off automatic reloads.
  window.localStorage.setItem('_DEV_TOOLS_AUTO_LOAD_ENABLED_', 'false');
};
