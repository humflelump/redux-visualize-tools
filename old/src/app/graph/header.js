import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as actions from './actions';
import * as constants from './constants';
import * as settingsSelectors from '../settings/selectors';
import * as graphSelectors from './create-graph-selectors';
import * as contextSelectors from '../context-menu/selectors';
import * as d3 from 'd3';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Search from '../search/container';

import IconButton from 'material-ui/IconButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import CloseSettings from 'material-ui/svg-icons/navigation/close';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

function getStyles(settingsDimensions) {
    return {
        container: {
            top: 0,
            left: 0,
            right: 0,
            height: constants.HEADER_SIZE,
            position: 'absolute',
            backgroundColor: 'rgb(86, 0, 147)',
            display: 'flex',
            borderRadius: 0,
        },
        settingsContainer: {
            position: 'absolute',
            right: settingsDimensions.leftEdge,
            top: 0,
            bottom: 0,
            width: constants.HEADER_SIZE,
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: 'column',
            transition: 'all 0.15s',
        },
        flex: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-around',
        },
    };
}

const Header = (props) => {
    const styles = getStyles(props.settingsDimensions);
    return <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <Paper zDepth={3} style={styles.container}>
            <Search />
            <div style={styles.settingsContainer}>
                <IconButton onClick={props.toggleSettings} tooltip="">
                    {
                        props.settingsOpen
                            ? <CloseSettings color="white" />
                            : <ActionSettings color="white"/>
                    }
                </IconButton>
            </div>
            <div style={styles.flex}>
                <FlatButton
                    label="Show Everything" 
                    onClick={props.showEverything}
                    disabled={props.nodeToFilterOn === null}
                />
            </div>
            <div style={styles.flex}>
                <FlatButton
                    label="Reset Zoom" 
                    onClick={actions.resetZoom}
                    disabled={props.isZoomedOut}
                />
            </div>
        </Paper>
    </MuiThemeProvider>
}

const mapStateToProps = (state, ownProps) => {
  return {
    isZoomedOut: selectors.isZoomedOut(state),
    nodeToFilterOn: contextSelectors.nodeToFilterOn(state),
    settingsDimensions: settingsSelectors.dimensions(state),
    settingsOpen: state.Graph.settingsOpen
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    showEverything: () => {
        dispatch({
            type: 'REMOVE_NODE_TO_FILTER_ON',
        });
        actions.resetZoom();
    },
    toggleSettings: () => {
        dispatch({
            type: 'TOGGLE_SETTINGS_OPEN_STATE',
        });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);