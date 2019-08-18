import React from 'react';
import { IState } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';
import { LEFT_PANEL_WIDTH } from '../../core-dev-tools/left-side-panel/ui/constants';

const mapStateToProps = (state: IState) => {
  return {
    width: LEFT_PANEL_WIDTH,
    isOpen: state.LeftPanel.isLeftSidePanelOpen,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    togglePanel: () => {
      dispatch({
        type: 'TOGGLE_IF_LEFT_PANEL_OPEN',
      });
    },
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
      width: 48,
      height: 48,
      top: 0,
      borderRadius: 24,
      backgroundColor: 'rgb(255, 255, 255, 0.7)',
      zIndex: 1,
      transition: 'all 0.3s',
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
      <div
        className={props.classes.container}
        style={{ left: props.isOpen ? props.width - 48 : 0 }}
      >
        <IconButton onClick={props.togglePanel}>
          {props.isOpen ? <BackIcon /> : <MenuIcon />}
        </IconButton>
      </div>
    );
  }
}

export const HeaderComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
