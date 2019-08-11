import React from 'react';
import { IState } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Button } from '@material-ui/core';
import { isZoomedOut } from '../core/zoom-selectors';
import { resetZoom } from '../core/actions';

const mapStateToProps = (state: IState) => {
  return {
    visible: !isZoomedOut(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    resetZoom,
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
        style={{ display: props.visible ? null : 'none' }}
        onClick={e => e.stopPropagation()}
      >
        <Button variant="outlined" color="primary" onClick={props.resetZoom}>
          Reset Zoom
        </Button>
      </div>
    );
  }
}

export const ZoomOutButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as any;
