import React from 'react';
import { State } from '../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as selectors from './selectors';
import { graph } from 'redux-visualize-tools';

const mapStateToProps = (state: State) => {
    return {
        test: selectors.test(state),
        text: state.Component1.text,
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {

    }
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

const Component_: React.FC<Props> = (props) => {
    return (<div style={{width: 200, height: 100, backgroundColor: 'green'}}>
        {props.test}
    </div>);
}

export const Component2 = graph.add(connect, {name: 'Component2'})(
    mapStateToProps,
    mapDispatchToProps
  )(Component_);