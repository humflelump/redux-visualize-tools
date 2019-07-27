import React from 'react';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Paper } from '@material-ui/core';
import { LEFT_PANEL_WIDTH } from './constants';
import { IState } from '../../../store';
import { Dispatch } from 'redux';

const mapStateToProps = (state: IState) => {
  return {
    isOpen: state.LeftPanel.isLeftSidePanelOpen,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
      left: 0,
      width: LEFT_PANEL_WIDTH,
      bottom: 0,
      top: 0,
      backgroundColor: 'rgb(255, 255, 255, 0.7)',
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
      <Paper elevation={10} className={props.classes.container}>
        <div />
      </Paper>
    );
  }
}

export const HeaderComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
