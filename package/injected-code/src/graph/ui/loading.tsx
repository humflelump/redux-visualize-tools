import React from 'react';
import { IState } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Button, CircularProgress } from '@material-ui/core';
import { isGraphLoading } from '../core/selectors';

const mapStateToProps = (state: IState) => {
  return {
    loading: isGraphLoading(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
      left: `calc(50% - 25px)`,
      top: `calc(50% - 25px)`,
      width: 50,
      height: 50,
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
        style={{ display: props.loading ? null : 'none' }}
      >
        <CircularProgress disableShrink={true} />
      </div>
    );
  }
}

export const LoadingIndicator = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as any;
