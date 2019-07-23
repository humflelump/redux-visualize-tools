import React from 'react';
import { State } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { scaledUiNodes, dimensions, xScale, yScale, indexedUiNodes } from '../core/selectors';
import Button from '@material-ui/core/Button';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme } from '@material-ui/core';
import { renderRectangles, listenForResize, Scale, ZoomData, renderLines } from './renderers';

const mapStateToProps = (state: State) => {
    return {
        nodes: scaledUiNodes(state),
        indexedNodes: indexedUiNodes(state),
        dimensions: dimensions(state),
        xScale: xScale(state),
        yScale: yScale(state),

    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setScales: (xScale: Scale, yScale: Scale) => {
            dispatch({
                type: 'SET_SCALES',
                xFrom: xScale.domain(),
                yFrom: yScale.domain(),
                xTo: xScale.range(),
                yTo: yScale.range(),
            });
        },
    }
};

const styles = (theme: Theme) => createStyles({
    container: {
        position: 'absolute',
        backgroundColor: 'red',
    },
});

type Props1 = ReturnType<typeof mapStateToProps>
type Props2 =  ReturnType<typeof mapDispatchToProps>
interface Props3 extends WithStyles<typeof styles> {} 
type Props = Props1 & Props2 & Props3

class Component extends React.Component<Props> {
    private zoomData: ZoomData | object;
    constructor(props: Props) {
        super(props);
        this.zoomData = {};
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update() {
        const canvas = document.getElementById('graph-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dim = this.props.dimensions;
        ctx.clearRect(0, 0, dim.width, dim.height);
        renderLines(ctx, this.props.nodes, this.props.indexedNodes);
        renderRectangles(ctx, this.props.nodes);
        

        // in order for closures within to work, the data passed in must be mutated
        const data = this.zoomData as ZoomData;
        data.canvas = canvas;
        data.xScale = this.props.xScale;
        data.yScale = this.props.yScale;
        data.dimensions = this.props.dimensions;
        data.callback = (xScale, yScale) => {
            this.props.setScales(xScale, yScale);
        };
        listenForResize(data);
    }

    render() {
        const {
            classes,
            nodes,
            dimensions,
        } = this.props;
        console.log({nodes});
        return <div className={classes.container} style={dimensions}>
            <canvas id="graph-canvas" width={dimensions.width} height={dimensions.height} />
        </div>
    }
}

export const GraphComponent = connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Component)) as any;