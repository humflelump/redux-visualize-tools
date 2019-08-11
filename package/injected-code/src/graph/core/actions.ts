import { IState } from '../../store';
import { hoveredNode } from './selectors';
import { Dispatch } from 'redux';
import { zoomedOutScales } from './zoom-selectors';

const state = () => (window as any).store.getState() as IState;
const dispatch = () => (window as any).store.dispatch as Dispatch;

export function onClick() {
  const node = hoveredNode(state());
  if (node) {
    dispatch()({
      type: 'CLICK_NODE',
      nodeId: node.data.id,
    });
  } else {
    dispatch()({
      type: 'CLEAR_CLICKED_NODE',
    });
  }
}

export function resetZoom() {
  const { x, y } = zoomedOutScales(state());
  dispatch()({
    type: 'SET_SCALES',
    xTo: x.range(),
    xFrom: x.domain(),
    yTo: y.range(),
    yFrom: y.domain(),
  });
}
