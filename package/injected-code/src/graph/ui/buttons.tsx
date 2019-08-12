import React from 'react';
import { IState } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Button } from '@material-ui/core';
import { isZoomedOut } from '../core/zoom-selectors';
import { resetZoom } from '../core/actions';
import { NODE_FILTER_TYPE } from '../types';
import { triggerResetZoomWhenGraphIsFinishedCalculating } from '../core/selectors';

const mapStateToProps = (state: IState) => {
  return {
    resetZoomVisible: !isZoomedOut(state),
    clearFilterVisible:
      state.Graph.nodeFilter.nodeId !== null &&
      state.Graph.nodeFilter.filterType !== NODE_FILTER_TYPE.NO_FILTER,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    resetZoom,
    clearFilter: () => {
      dispatch({ type: 'CLEAR_NODE_FILTER' });
      triggerResetZoomWhenGraphIsFinishedCalculating();
    },
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
      right: 10,
      top: 10,
      width: 200,
      height: 40,
      display: 'flex',
      flexDirection: 'row-reverse',
    },
    button: {
      height: 24,
      cursor: 'pointer',
    },
  });

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface IStyleProps extends WithStyles<typeof styles> {}
type Props = StateProps & DispatchProps & IStyleProps;

class Component extends React.Component<Props> {
  public render() {
    const props = this.props;

    return (
      <div
        className={props.classes.container}
        onClick={e => e.stopPropagation()}
      >
        {props.resetZoomVisible && (
          <button className={props.classes.button} onClick={props.resetZoom}>
            Reset Zoom
          </button>
        )}
        {props.clearFilterVisible && (
          <button className={props.classes.button} onClick={props.clearFilter}>
            Clear Filter
          </button>
        )}
      </div>
    );
  }
}

export const ActionButtons = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as any;
