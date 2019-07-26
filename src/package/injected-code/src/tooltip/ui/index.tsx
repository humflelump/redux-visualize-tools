import React from 'react';
import { State } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, IconButton, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { tooltipPosition } from '../core/selectors';
import { hoveredNode, scale, getRectangleData } from '../../graph/core/selectors';

const mapStateToProps = (state: State) => {
    return {
        dimensions: tooltipPosition(state),
        node: hoveredNode(state),
        scale: scale(state),
        getRectangleData: getRectangleData(state),
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {

    }
};

const styles = (theme: Theme) => createStyles({
    container: {
        position: 'absolute',
        pointerEvents: 'none',
    },
    body: {
        position: 'absolute',
        top: 0,
        bottom: 0,
    },
    path: {
        fill: 'rgba(255,255,255,0.9)',
        stroke: 'gray',
        strokeWidth: 2,
        transformOrigin: '50% 50%',
    },
    title: {
        fontSize: 18,
        fontWeight: 600,
        textAlign: 'center',
        padding: 6,
    },
    label: {
        fontSize: 15,
        fontWeight: 500,
        textAlign: 'left',
        margin: '3px 0px 3px 10px',
    }
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps =  ReturnType<typeof mapDispatchToProps>;
interface StyleProps extends WithStyles<typeof styles> {};
export interface PassedProps {};
type Props = StateProps & DispatchProps & StyleProps & PassedProps

function makeBubble(dimensions: {width: number, height: number, showOnRight: boolean}) {
    const W = dimensions.width;
    const H = dimensions.height;
    return `M19,1 L${W - 10},1 a9,9 0 0,1 9,9 L${W-1},${H-10} a9,9 0 0,1 -9,9 L20,${H-1} a9,9 0 0,1 -9,-9 L10,${H/2+5} L0,${H/2} L10,${H/2-5} L10,10 a9,9 0 0,1 9,-9`;
}

class Component extends React.Component<Props> {
    render() {
        const props = this.props;
        if (!props.node) return null;
        // Hide if the node rect is already big
        if (props.scale > 1) return null;
        const onRight = props.dimensions.showOnRight;
        const rectData = props.getRectangleData(props.node);
        return <div 
            className={props.classes.container}
            style={props.dimensions}
        >
            <svg style={{width: '100%', height: '100%'}}>
                <path 
                    className={props.classes.path} 
                    d={makeBubble(props.dimensions)}
                    transform={`rotate(${onRight ? 0 : 180})`}
                />
            </svg>
            <div 
                className={props.classes.body}
                style={{left: onRight ? 10 : 0, width: props.dimensions.width - 10}}
            >
                <div className={props.classes.title}>
                    {props.node.data.name}
                </div>
                <Divider />
                <div className={props.classes.label}>
                    {'Computation Took: '} <b>{rectData.duration }</b>
                </div>
                <div className={props.classes.label}>
                    {'Last Call: '}  <b>{rectData.lastCall }</b>
                </div>
                <div className={props.classes.label}>
                    {'Return Type: '} <b>{rectData.returnType }</b>
                </div>
                <div className={props.classes.label}>
                    {'Dependencies: '} <b>{props.node.parents.length }</b>
                </div>
                <div className={props.classes.label}>
                    {'Dependents: '} <b>{props.node.children.length }</b>
                </div>
            </div>
        </div>
    }
}

export const NodeTooltip = connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Component)) as React.ComponentClass<PassedProps>;