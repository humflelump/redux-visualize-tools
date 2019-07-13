import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as constants from './constants';
import * as graphConstants from '../graph/constants';
import * as d3 from 'd3';

import SettingsContainer from './settings'
import ActionsContainer from '../actions-list/container';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';

import {Tabs, Tab} from 'material-ui/Tabs';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

function getStyles(dimensions) {
    return {
        container: {
            position: 'absolute',
            zIndex: 3,
            backgroundColor: 'white',
            transition: 'all 0.15s',
            ...dimensions,
        },
    };
}

const Hider = (props) => (props.visible ? props.children : null);

const Settings = (props) => {
    const styles = getStyles(props.dimensions);
    return <Paper style={styles.container}>
        <Tabs
            tabItemContainerStyle={{backgroundColor: 'rgb(86, 0, 147)'}}
            value={props.settingsTab}
            onChange={val => props.setTab(val)}
        >
            <Tab label={constants.SETTINGS_TAB} value={constants.SETTINGS_TAB}/>
            <Tab label={constants.ACTIONS_TAB} value={constants.ACTIONS_TAB}/>
        </Tabs>
        <Hider visible={props.settingsTab === constants.ACTIONS_TAB}>
            <ActionsContainer />
        </Hider>
        <Hider visible={props.settingsTab === constants.SETTINGS_TAB}>
            <SettingsContainer />
        </Hider>
    </Paper>
}

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.Graph.settingsOpen,
    settingsTab: state.Settings.settingsTab,
    dimensions: selectors.dimensions(state),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTab: (tab) => {
        dispatch({
            type: 'SET_SETTINGS_TAB',
            tab,
        });
    },
    close: () => {
        dispatch({
            type: 'TOGGLE_SETTINGS_OPEN_STATE',
        });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);