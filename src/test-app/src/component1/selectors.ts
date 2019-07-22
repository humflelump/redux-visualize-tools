import { State } from '../store';
import { createSelector } from 'reselect';
import { graph } from 'redux-visualize-tools';

const text = (state: State) => state.Component1.text;
const wow = (state: State) => state.Component1.immutableYay.get('wow');

export const appendedText = graph.add(createSelector)(
    [text, wow], t => t + '_wow'
);

export const isLong = graph.add(createSelector)(
    [appendedText], t => t.length > 10
);

console.log('wowoowow', graph);