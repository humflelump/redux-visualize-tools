import React from 'react';
import { State } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Paper, Divider } from '@material-ui/core';
import { WIDTH } from './constants';
import { showPanelOnRight, isVisible } from '../core/selectors';
import { hoveredNode, selectedNode } from '../../graph/core/selectors';

const mapStateToProps = (state: State) => {
    return {
        node: selectedNode(state),
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {

    }
};

const styles = (theme: Theme) => createStyles({
    container: {

    },
    title: {
        fontSize: 18,
        fontFamily: '"Roboto", sans-serif',
        textAlign: 'center',
        padding: 5,
        fontWeight: 600,
    },
    label: {
        fontSize: 15,
        fontFamily: '"Roboto", sans-serif',
        textAlign: 'left',
        margin: 5,
        color: 'rgb(100,100,100',
    },
    functionArea: {
        margin: 10,
        width: 'calc(100% - 20px)',
    },
});

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps =  ReturnType<typeof mapDispatchToProps>
interface StyleProps extends WithStyles<typeof styles> {} 
export interface PassedProps {}
type Props = StateProps & DispatchProps & StyleProps & PassedProps

class Component extends React.Component<Props> {
    render() {
        const props = this.props;
        if (!props.node) return null;
        return <div className={props.classes.container}>
            <div className={props.classes.title}> 
                {props.node.label}
            </div>
            <Divider />
            <div className={props.classes.functionArea}>
                <div className={props.classes.label}> 
                    Content
                </div>
                <textarea 
                    rows={8} 
                    cols={80} 
                    value={String(props.node.data.function || 'No Content')}
                />
            </div>
        </div>
    }
}

export const PanelContents = connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Component)) as React.ComponentClass<PassedProps>;