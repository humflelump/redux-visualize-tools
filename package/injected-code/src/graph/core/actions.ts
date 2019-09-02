import { IState } from '../../store';
import { hoveredNode, filteredNodeData } from './selectors';
import { Dispatch } from 'redux';
import { zoomedOutScales } from './zoom-selectors';
import { asyncGraphRender } from '../../gen-graph-layout';
import { GraphActions } from './reducers';

const state = () => (window as any).store.getState() as IState;
const dispatch = () => (window as any).store.dispatch as Dispatch;

export function onClick() {
  const node = hoveredNode(state());
  if (node) {
    dispatch()(GraphActions.clickNode(node.data.id));
  }
}

export function resetZoom() {
  const { x, y } = zoomedOutScales({ ...state() });
  dispatch()(
    GraphActions.setScales(y.range(), y.domain(), x.range(), x.domain())
  );
}
(window as any).resetZoom = resetZoom;
