import React from 'react';
import { IState } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  scale,
  scaledUiNodes,
  xScale,
  yScale,
  indexedUiNodes,
  hoveredNode,
  getRectangleData,
} from '../core/selectors';
import { Button, WithStyles, Theme } from '@material-ui/core';
import { withStyles, createStyles } from '@material-ui/styles';
import {
  renderRectangles,
  listenForResize,
  renderLines,
  renderText,
  renderRectangleContents,
} from './renderers';
import { Scale, IZoomData } from '../types';
import * as d3 from 'd3';
import { onClick } from '../core/actions';
import { NodeTooltip } from '../../tooltip/ui';
import { dimensions } from '../core/dimensions-selectors';
import { ActionButtons } from './buttons';
import { LoadingIndicator } from './loading';
import { GraphActions } from '../core/reducers';

const mapStateToProps = (state: IState) => {
  return {
    nodes: scaledUiNodes(state),
    indexedNodes: indexedUiNodes(state),
    dimensions: dimensions(state),
    xScale: xScale(state),
    yScale: yScale(state),
    scale: scale(state),
    hoveredNode: hoveredNode(state),
    getRectangleData: getRectangleData(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    canvasClicked: onClick,
    setScales: (xScale: Scale, yScale: Scale) => {
      dispatch(
        GraphActions.setScales(
          yScale.range(),
          yScale.domain(),
          xScale.range(),
          xScale.domain()
        )
      );
    },
    setMouse: (x: number, y: number) => {
      dispatch(GraphActions.setMousePosition([x, y]));
    },
    resetMouse: () => {
      dispatch(GraphActions.resetMousePosition());
    },
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
    },
  });

type Props1 = ReturnType<typeof mapStateToProps>;
type Props2 = ReturnType<typeof mapDispatchToProps>;
interface IProps3 extends WithStyles<typeof styles> {}
type Props = Props1 & Props2 & IProps3;

class Component extends React.Component<Props> {
  private zoomData: IZoomData | object;
  constructor(props: Props) {
    super(props);
    this.zoomData = {};
  }

  public componentDidMount() {
    this.update();
    this.addListeners();
  }

  public componentDidUpdate() {
    this.update();
  }

  public render() {
    const props = this.props;
    return (
      <div
        className={props.classes.container}
        style={{
          ...props.dimensions,
          cursor: props.hoveredNode ? 'pointer' : 'default',
        }}
        onClick={props.canvasClicked}
      >
        <NodeTooltip />
        <ActionButtons />
        <LoadingIndicator />
        <canvas
          id="graph-canvas"
          width={props.dimensions.width}
          height={props.dimensions.height}
        />
      </div>
    );
  }

  private addListeners() {
    const canvas = document.getElementById('graph-canvas') as HTMLCanvasElement;
    d3.select('canvas')
      .on('mousemove', () => {
        const [x, y] = d3.mouse(canvas);
        this.props.setMouse(x, y);
      })
      .on('mouseleave', () => {
        this.props.resetMouse();
      });
  }

  private update() {
    const canvas = document.getElementById('graph-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const dim = this.props.dimensions;
    ctx.clearRect(0, 0, dim.width, dim.height);
    renderLines(ctx, this.props.nodes, this.props.indexedNodes);
    renderRectangles(
      ctx,
      this.props.nodes,
      this.props.hoveredNode,
      this.props.scale
    );
    renderText(ctx, this.props.nodes, this.props.scale);
    renderRectangleContents(
      this.props.nodes,
      ctx,
      this.props.getRectangleData,
      this.props.scale
    );
    // in order for closures within to work, the data passed in must be mutated
    const data = this.zoomData as IZoomData;
    data.canvas = canvas;
    data.xScale = this.props.xScale;
    data.yScale = this.props.yScale;
    data.dimensions = this.props.dimensions;
    data.callback = (xScale, yScale) => {
      this.props.setScales(xScale, yScale);
    };
    listenForResize(data);
  }
}

export const GraphComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as any;
