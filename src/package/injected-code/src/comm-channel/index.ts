import { store } from '../store';
import { throttle } from 'lodash';

export class MultiWindowCommChannel {
  public sendGraph(data: any) {
    const dispatch = () =>
      store.dispatch({
        type: 'SET_GRAPH',
        graph: { ...data, nodes: { ...data.nodes } },
      });

    data.store.subscribe(() => setTimeout(throttle(dispatch, 500)));
    dispatch();
  }
}
export const commChannel = new MultiWindowCommChannel();
