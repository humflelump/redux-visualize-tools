import React from 'react';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Paper } from '@material-ui/core';
import { LEFT_PANEL_WIDTH } from './constants';
import { IState } from '../../../store';
import { Dispatch } from 'redux';
import { ActionsList } from '../../actions/ui';
import { StateAnalysisComponent } from '../../state/ui';
import {
  bottomHalfDimensions,
  topHalfDimensions,
} from '../../state/core/selectors';
import { LEFT_PANEL_TABS } from '../../drag-region/types';
import { DragRegion } from '../../drag-region/ui';
import { StateDiff } from '../../diff/index';
import { ActionJsonTree } from '../../actions/ui/action-json-tree';
import { HeaderTabs } from '../../../header/ui/tabs';
import { HEADER_TABS } from '../../../header/types';
import { FilterComponent } from '../../filters/ui';
import { leftPanelEffectiveWidth } from '../core/selectors';

const mapStateToProps = (state: IState) => {
  return {
    isOpen: state.LeftPanel.isLeftSidePanelOpen,
    bottomDimensions: bottomHalfDimensions(state),
    topDimensions: topHalfDimensions(state),
    middleTab: state.DragRegion.selectedTab,
    headerTab: state.Header.headerTab,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
      left: 0,
      width: LEFT_PANEL_WIDTH,
      bottom: 0,
      top: 0,
      transition: 'all 0.3s',
      zIndex: 0,
    },
    topSection: {
      position: 'absolute',
      display: 'grid',
      gridTemplateColumns: '100%',
      gridTemplateRows: '48px auto',
    },
    bottomSection: {
      position: 'absolute',
      display: 'grid',
      gridTemplateColumns: '100%',
      gridTemplateRows: '48px auto',
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
      <Paper
        id="left-panel"
        elevation={10}
        className={props.classes.container}
        style={{ left: props.isOpen ? 0 : -LEFT_PANEL_WIDTH }}
      >
        <div className={props.classes.topSection} style={props.topDimensions}>
          {props.isOpen && (
            <React.Fragment>
              <HeaderTabs />
              {props.headerTab === HEADER_TABS.ACTIONS && <ActionsList />}
              {props.headerTab === HEADER_TABS.FILTERS && <FilterComponent />}
            </React.Fragment>
          )}
        </div>
        <div
          className={props.classes.bottomSection}
          style={props.bottomDimensions}
        >
          {props.isOpen && (
            <React.Fragment>
              <DragRegion />
              <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                {props.middleTab === LEFT_PANEL_TABS.STATE && (
                  <StateAnalysisComponent />
                )}
                {props.middleTab === LEFT_PANEL_TABS.DIFF && <StateDiff />}
                {props.middleTab === LEFT_PANEL_TABS.ACTION && (
                  <ActionJsonTree />
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </Paper>
    );
  }
}

export const LeftPanelComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
