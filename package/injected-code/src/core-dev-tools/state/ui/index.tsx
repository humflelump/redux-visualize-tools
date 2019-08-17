import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme } from '@material-ui/core';
import { IState } from '../../../store';
import { selectedAction, currentState } from '../core/selectors';
import JSONTree from 'react-json-tree';
import { theme } from '../../json-tree-theme';

const mapStateToProps = (state: IState) => {
  return {
    action: selectedAction(state),
    currentState: currentState(state),
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
      <div className={props.classes.container}>
        <JSONTree
          theme={theme}
          invertTheme={true}
          data={props.action ? props.action.nextState : props.currentState}
        />
      </div>
    );
  }
}

export const StateAnalysisComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
