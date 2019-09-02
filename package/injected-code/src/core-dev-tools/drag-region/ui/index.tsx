import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Button, Tabs, Tab } from '@material-ui/core';
import { IState } from '../../../store';
import { LEFT_PANEL_TABS, TAB_OPTIONS } from '../types';
import * as d3 from 'd3';
import { drag } from '../core/actions';
import { DragRegionActions } from '../core/reducers';

const SmallTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 72,
    },
  })
)(Tab);

const mapStateToProps = (state: IState) => {
  return {
    value: state.DragRegion.selectedTab,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setTab: (tab: LEFT_PANEL_TABS) => {
      dispatch(DragRegionActions.setLeftPanelTab(tab));
    },
    drag,
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: 48,
      display: 'flex',
      borderBottom: '1px solid #e8e8e8',
      cursor: 'row-resize',
    },
  });

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface IStyleProps extends WithStyles<typeof styles> {}
export interface IPassedProps {}
type Props = StateProps & DispatchProps & IStyleProps & IPassedProps;

class Component extends React.Component<Props> {
  public componentDidMount() {
    const dragArea = document.getElementById('drag-region');
    if (!dragArea) {
      return;
    }
    d3.select(dragArea).call(
      d3.drag().on('drag', () => {
        const root = document.getElementById('left-panel');
        if (!root) {
          return;
        }
        const [x, y] = d3.mouse(root);
        this.props.drag(y);
      })
    );
  }

  public render() {
    const props = this.props;

    return (
      <div id="drag-region" className={props.classes.container}>
        <Tabs
          value={props.value}
          onChange={(e, val) => props.setTab(val)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          scrollButtons="off"
        >
          {TAB_OPTIONS.map(option => {
            return (
              <SmallTab
                style={{ maxWidth: 40 }}
                fullWidth={true}
                value={option}
                label={option}
              />
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export const DragRegion = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
