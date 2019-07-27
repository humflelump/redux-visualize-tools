import { store } from "../store";

export class MultiWindowCommChannel {
    constructor() {

    }

    sendGraph(data: any) {

        const dispatch = () => store.dispatch({
            type: 'SET_GRAPH',
            graph: { ...data, nodes: { ...data.nodes } },
        });
        data.store.subscribe(dispatch);
        dispatch();
        console.log('huh14');
    }
}
export const commChannel = new MultiWindowCommChannel();
