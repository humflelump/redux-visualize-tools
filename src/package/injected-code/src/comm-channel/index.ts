import { store } from "../store";

export class MultiWindowCommChannel {
    constructor() {

    }

    sendGraph(data: any) {
        store.dispatch({
            type: 'SET_GRAPH',
            graph: { ...data },
        });
    }
}
export const commChannel = new MultiWindowCommChannel();
