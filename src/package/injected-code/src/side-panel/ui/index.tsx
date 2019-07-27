import React from 'react';
import { IState } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme } from '@material-ui/core';
import { Panel } from './panel';

const mapStateToProps = (state: IState) => {
  return {};
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
type Props = StateProps & DispatchProps & IStyleProps;

class Component extends React.Component<Props> {
  public render() {
    const props = this.props;

    return (
      <div className={props.classes.container}>
        <Panel />
      </div>
    );
  }
}

export const SidePanelComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as any;
