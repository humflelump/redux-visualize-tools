import { State } from '../store';
import { createSelector } from 'reselect';
import { graph } from '../redux-visualize-dist/index';

const text = (state: State) => state.Component1.text;

export const appendedText = graph.add(createSelector)(
    [text], t => t + '_wow'
);

export const isLong = graph.add(createSelector)(
    [appendedText], t => t.length > 10
);

console.log('wowoowow', graph);