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
import { triggerResetZoomWhenGraphIsFinishedCalculating } from '../../../graph/core/selectors';

const mapStateToProps = (state: IState) => {
  return {
    filterOldActions: state.Filters.filterNodesAffectedByOldActions,
    shouldFilterIsolatedNodes: state.Filters.filterIsolatedNodes,
    nodeTypeFilters: state.Filters.nodeTypeFilters,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setIfFilteringOldActions: (bool: boolean) => {
      dispatch({
        type: 'SET_filterNodesAffectedByOldActions',
        bool,
      });
      triggerResetZoomWhenGraphIsFinishedCalculating();
    },
    setIfFilteringIsolatedNodes: (bool: boolean) => {
      dispatch({
        type: 'SET_filterIsolatedNodes',
        bool,
      });
      triggerResetZoomWhenGraphIsFinishedCalculating();
    },
    applyNodeTypeFilter: (key: string, bool: boolean) => {
      dispatch({
        type: 'APPLY_NODE_TYPE_FILTER',
        bool,
        nodeType: key,
      });
      triggerResetZoomWhenGraphIsFinishedCalculating();
    },
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: 10,
      overflow: 'auto',
    },
  });

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface IStyleProps extends WithStyles<typeof styles> { }
export interface IPassedProps { }
type Props = StateProps & DispatchProps & IStyleProps & IPassedProps;

const CustomCheckbox = ({ label, checked, onChange }) => {
  return <div>
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          color="primary"
        />
      }
      label={label}
    />
  </div>
}

class Component extends React.Component<Props> {
  public render() {
    const props = this.props;

    return (
      <div className={props.classes.container}>
        <CustomCheckbox
          checked={props.filterOldActions}
          onChange={e => props.setIfFilteringOldActions(e.target.checked)}
          label="Only show nodes called during last action"
        />
        <CustomCheckbox
          checked={props.shouldFilterIsolatedNodes}
          onChange={e => props.setIfFilteringIsolatedNodes(e.target.checked)}
          label="Filter isolated nodes"
        />
        {
          Object.keys(props.nodeTypeFilters).map((key) => {
            const bool = props.nodeTypeFilters[key];
            return <CustomCheckbox
              checked={bool}
              onChange={e => props.applyNodeTypeFilter(key, e.target.checked)}
              label={`Filter out ${key}s`}
            />
          })
        }
      </div>
    );
  }
}

export const FilterComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
