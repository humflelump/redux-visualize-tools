import React from 'react';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Paper } from '@material-ui/core';
import { stateDiff } from '../state/core/selectors';
import JSONDiff from './JSONDiff';
import { IState } from '../../store';
import { Dispatch } from 'redux';

const mapStateToProps = (state: IState) => {
  return {
    diff: stateDiff(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const styles = (theme: Theme) =>
  createStyles({
    container: {},
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
      <div id="JSONDiff" className={props.classes.container}>
        <JSONDiff delta={props.diff} />
      </div>
    );
  }
}

export const StateDiff = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
