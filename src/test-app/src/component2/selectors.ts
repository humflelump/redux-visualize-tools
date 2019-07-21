import { State } from '../store';
import { createSelector } from 'reselect';
import { graph } from '../redux-visualize-dist/index';

const test_ = (state: State) => state.Component2;

export const test = graph.add(createSelector)(
    [test_], t => {
        console.log('ugh called', t);
        return t.text;
    }
);
