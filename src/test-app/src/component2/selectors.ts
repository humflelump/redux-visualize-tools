import { State } from '../store';
import { createSelector } from 'reselect';
import { graph } from 'redux-visualize-tools';

const test_ = (state: State) => state.Component2.text;

export const test = graph.add(createSelector)(
    [test_], t => {
        console.log('ugh called', t);
        return t;
    }
);
