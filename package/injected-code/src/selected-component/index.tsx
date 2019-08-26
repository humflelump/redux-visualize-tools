import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Paper, IconButton } from '@material-ui/core';
import { IState } from '../store';
import CloseIcon from '@material-ui/icons/Close';
import { InjectedComponent } from './Injected';
import { nodeToShowComponentFor } from './selectors';

const mapStateToProps = (state: IState) => {
  return {
    isOpen: nodeToShowComponentFor(state) !== null,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    close: () => {
      dispatch({
        type: 'SET_NODE_ID_TO_SHOW_COMPONENT_FOR',
        id: null,
      });
    },
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'fixed',
      transition: 'all 0.3s',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
    },
    innerContainer: {
      position: 'absolute',
      backgroundColor: 'white',
      transition: 'all 0.3s',
    },
    closeButton: {
      position: 'absolute',
      right: 0,
      top: 0,
    }
  });

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface IStyleProps extends WithStyles<typeof styles> { }
type Props = StateProps & DispatchProps & IStyleProps;

class Component extends React.Component<Props> {
  public render() {
    const props = this.props;
    return (
      <div
        id="SelectedComponent"
        className={props.classes.container}
        style={{
          backgroundColor: props.isOpen ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0)',
          pointerEvents: props.isOpen ? 'auto' : 'none',
        }}
        onClick={props.close}
      >
        {
          props.isOpen && <div className={props.classes.closeButton}>
            <IconButton aria-label="delete">
              <CloseIcon fontSize="large" />
            </IconButton>
          </div>
        }

        <Paper
          onClick={e => e.stopPropagation()}
          elevation={10}
          className={props.classes.innerContainer}
          style={{
            left: props.isOpen ? '10%' : '50%',
            top: props.isOpen ? '10%' : '50%',
            right: props.isOpen ? '10%' : '50%',
            bottom: props.isOpen ? '10%' : '50%',
          }}
        >
          {props.isOpen && < InjectedComponent />}
        </Paper>
      </div>
    );
  }
}

export const SelectedComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as any;
