import React from 'react';
import { State } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Paper } from '@material-ui/core';
import { WIDTH } from './constants';
import { showPanelOnRight, isVisible } from '../core/selectors';
import { PanelContents } from './panel-content';
import { clickedNode } from '../../graph/core/selectors';

const mapStateToProps = (state: State) => {
    return {
        isVisible: isVisible(state),
        dockedRight: showPanelOnRight(state),
        isPermanentMode: Boolean(clickedNode(state)),
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {

    }
};

const styles = (theme: Theme) => createStyles({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: WIDTH,
        zIndex: 1,
        transition: 'right 0.14s, left 0.14s',
        backgroundColor: 'white',
        pointerEvents: 'none',
    },
});

function getContainerStyle(
    isVisible: boolean, 
    dockedRight: boolean,
    isPermanentMode: boolean,
) {
    if (dockedRight) {
        return { 
            right: isVisible ? 0 : -WIDTH,
            pointerEvents: isPermanentMode ? 'auto' : 'none',
        };
    } else {
        return { 
            left: isVisible ? 0 : -WIDTH,
            pointerEvents: isPermanentMode ? 'auto' : 'none',
        };
    }
}

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps =  ReturnType<typeof mapDispatchToProps>
interface StyleProps extends WithStyles<typeof styles> {} 
export interface PassedProps { isRightPanel: boolean }
type Props = StateProps & DispatchProps & StyleProps & PassedProps

class Component extends React.Component<Props> {
    render() {
        const props = this.props;
        const visible = props.isVisible && props.dockedRight === props.isRightPanel;
        return <Paper
            elevation={10}
            className={props.classes.container}
            style={getContainerStyle(
                visible, 
                props.isRightPanel,
                props.isPermanentMode,
            ) as any}
        >
        {
            visible ? <PanelContents /> : null
        }
        </Paper>
    }
}

export const Panel = connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Component)) as React.ComponentClass<PassedProps>;