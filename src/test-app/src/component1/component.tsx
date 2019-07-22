import React from 'react';
import { State } from '../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as selectors from './selectors';
import { graph } from 'redux-visualize-tools';

const mapStateToProps = (state: State) => {
    return {
        text: state.Component1.text,
        isLong: selectors.isLong(state),
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setText: (text: String) => {
            dispatch({
                type: 'SET_TEXT1',
                text,
            });
        },
    }
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

const Component_: React.FC<Props> = (props) => {
    return (<div style={{width: 200, height: 100, backgroundColor: 'green'}}>
        <input value={props.text} onChange={e => props.setText(e.target.value)}/>
        <div>{props.isLong ? 'long' : 'short'}</div>
    </div>);
}

export const Component1 = graph.add(connect, {name: 'Component1'})(
    mapStateToProps,
    mapDispatchToProps
  )(Component_);