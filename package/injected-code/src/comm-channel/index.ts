import { store } from '../store';
import { throttle } from 'lodash';
import { resetZoom } from '../graph/core/actions';

export class MultiWindowCommChannel {
  public sendGraph(data: any) {
    const dispatch = () =>
      store.dispatch({
        type: 'SET_GRAPH',
        graph: { ...data, nodes: { ...data.nodes } },
      });
    data.store.subscribe(() => setTimeout(throttle(dispatch, 500)));
    dispatch();
    setTimeout(resetZoom);
  }
}
export const commChannel = new MultiWindowCommChannel();
