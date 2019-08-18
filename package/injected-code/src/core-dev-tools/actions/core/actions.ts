import { IState } from '../../../store';
import { Dispatch } from 'redux';
import { parentStore } from '../../../comm-channel/selectors';

const state = () => (window as any).store.getState() as IState;
const dispatch = () => (window as any).store.dispatch as Dispatch;

export function jumpToState(nextState: any) {
  const store = parentStore(state());
  if (store) {
    store.dispatch({
      type: 'DEV_TOOLS_SET_STATE',
      state: nextState,
    });
  }

  dispatch()({
    type: 'SET_STATE',
    state: nextState,
  });
}
