import React from 'react';
import { IState } from '../../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import {
  WithStyles,
  Theme,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

const mapStateToProps = (state: IState) => {
  return {
    filterOldActions: state.Filters.filterNodesAffectedByOldActions,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setIfFilteringOldActions: (bool: boolean) => {
      dispatch({
        type: 'SET_filterNodesAffectedByOldActions',
        bool,
      });
    },
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: 10,
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
      <div className={props.classes.container}>
        <FormControlLabel
          control={
            <Checkbox
              checked={props.filterOldActions}
              onChange={e => props.setIfFilteringOldActions(e.target.checked)}
              color="primary"
            />
          }
          label="Only show nodes called during last action"
        />
      </div>
    );
  }
}

export const FilterComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
