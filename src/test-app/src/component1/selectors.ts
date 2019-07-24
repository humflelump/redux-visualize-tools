import { State } from '../store';
import { createSelector } from 'reselect';
import { graph } from 'redux-visualize-tools';

const text = (state: State) => state.Component1.text;
const wow = (state: State) => state.Component1.immutableYay.get('wow');

export const appendedText = graph.add(createSelector)(
    [text, wow], t => {
        for (let i = 0; i < 10000000; i++ ){
            
        }
        return t + '_wow'
    }   
);

export const isLong = graph.add(createSelector, {name: 'wow', file: __filename})(
    [appendedText], t => t.length > 10
);

console.log('wowoowow', graph);