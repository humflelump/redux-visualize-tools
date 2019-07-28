import React from 'react';
import { IState } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Paper } from '@material-ui/core';
import { WIDTH } from './constants';
import { isRightSidePanelOpen } from '../core/selectors';
import { PanelContents } from './panel-content';

const mapStateToProps = (state: IState) => {
  return {
    isVisible: isRightSidePanelOpen(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: WIDTH,
      zIndex: 1,
      transition: 'right 0.14s, left 0.14s',
      backgroundColor: 'white',
      pointerEvents: 'auto',
    },
  });

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface IStyleProps extends WithStyles<typeof styles> {}
export interface IPassedProps {}
type Props = StateProps & DispatchProps & IStyleProps & IPassedProps;

class Component extends React.Component<Props> {
  public render() {
    const props = this.props;

    return (
      <Paper
        elevation={10}
        className={props.classes.container}
        style={{ right: props.isVisible ? 0 : -WIDTH }}
      >
        {props.isVisible ? <PanelContents /> : null}
      </Paper>
    );
  }
}

export const Panel = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
