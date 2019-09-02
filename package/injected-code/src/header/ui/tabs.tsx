import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Button, Tabs, Tab } from '@material-ui/core';
import { IState } from '../../store';
import { HEADER_TABS, HEADER_TAB_OPTIONS } from '../types';
import { HeaderActions } from '../core/reducers';

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
    value: state.Header.headerTab,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setTab: (tab: HEADER_TABS) => {
      dispatch(HeaderActions.setHeaderTab(tab));
    },
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: 48,
      display: 'flex',
      borderBottom: '1px solid #e8e8e8',
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
        <Tabs
          value={props.value}
          onChange={(e, val) => props.setTab(val)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          scrollButtons="off"
        >
          {HEADER_TAB_OPTIONS.map(option => {
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

export const HeaderTabs = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
