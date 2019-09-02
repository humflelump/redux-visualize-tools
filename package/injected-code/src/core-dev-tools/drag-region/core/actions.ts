import { IState } from '../../../store';
import { Dispatch } from 'redux';
import { windowHeight } from '../../../window-dimensions/selectors';
import { DragRegionActions } from './reducers';

const state = () => (window as any).store.getState() as IState;
const dispatch = () => (window as any).store.dispatch as Dispatch;

export function drag(top: number) {
  const height = windowHeight(state());
  dispatch()(DragRegionActions.setDragFraction((top - 24) / height));
}
