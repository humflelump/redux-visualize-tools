import React from 'react';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Paper } from '@material-ui/core';
import { LEFT_PANEL_WIDTH } from './constants';
import { IState } from '../../../store';
import { Dispatch } from 'redux';
import { ActionsList } from '../../actions/ui';
import { StateAnalysisComponent } from '../../state/ui';

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
      transition: 'all 0.2s',
      zIndex: 0,
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
        style={{ left: props.isOpen ? 0 : -LEFT_PANEL_WIDTH }}
      >
        {props.isOpen ? <ActionsList /> : null}
        {props.isOpen ? <StateAnalysisComponent /> : null}
      </Paper>
    );
  }
}

export const LeftPanelComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
