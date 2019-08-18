import { IState } from '../../../store';
import { Dispatch } from 'redux';
import { windowHeight } from '../../../window-dimensions/selectors';

const state = () => (window as any).store.getState() as IState;
const dispatch = () => (window as any).store.dispatch as Dispatch;

export function drag(top: number) {
  const height = windowHeight(state());
  dispatch()({
    type: 'SET_DRAG_HEIGHT_FRACTION',
    top: (top - 24) / height,
  });
}
