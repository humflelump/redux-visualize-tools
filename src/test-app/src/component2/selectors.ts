import { State } from '../store';
import { createSelector } from 'reselect';
import { graph } from 'redux-visualize-tools';

const test_ = (state: State) => state.Component2.text;

const wow = graph.add(function grr() {
    console.log('this is my func');
});


export const test = graph.add(createSelector)(
    [test_], function wowtest(t) {
        wow();
        console.log('ugh called', t);
        return t;
    }
);
