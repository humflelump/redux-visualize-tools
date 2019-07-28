import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, ListItem, ListItemText } from '@material-ui/core';
import { IState } from '../../../store';
import { actions, actionsListDimensions } from '../core/selectors';
import { jumpToState } from '../core/actions';
import { FixedSizeList } from 'react-window';
import { LEFT_PANEL_WIDTH } from '../../left-side-panel/ui/constants';
import { IAction } from '../../../graph/types';

const mapStateToProps = (state: IState) => {
  return {
    actions: actions(state),
    dimensions: actionsListDimensions(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    jumpToState,
    setAction: (action: IAction) => {
      dispatch({
        type: 'SET_SELECTED_ACTION',
        action,
      });
    },
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {},
    topPanel: {
      width: '100%',
      height: 48,
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
        <div className={props.classes.topPanel} />
        <FixedSizeList
          itemSize={45}
          height={props.dimensions.height}
          width={props.dimensions.width}
          itemData={props.actions}
          itemCount={props.actions.length}
        >
          {({ index, style }) => {
            const action = props.actions[index];
            return (
              <ListItem
                button
                style={style}
                key={index}
                onClick={() => {
                  props.jumpToState(action.nextState);
                  props.setAction(action);
                }}
              >
                <ListItemText
                  primary={action.action.type}
                  secondary={`${action.actionNumber}: ${(
                    action.endTime - action.startTime
                  ).toFixed(2)} ms`}
                />
              </ListItem>
            );
          }}
        </FixedSizeList>
      </div>
    );
  }
}

export const ActionsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
