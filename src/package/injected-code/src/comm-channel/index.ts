import { store } from '../store';
console.log('omh');
export class MultiWindowCommChannel {
  public sendGraph(data: any) {
    const dispatch = () =>
      store.dispatch({
        type: 'SET_GRAPH',
        graph: { ...data, nodes: { ...data.nodes } },
      });
    data.store.subscribe(dispatch);
    dispatch();
  }
}
export const commChannel = new MultiWindowCommChannel();
