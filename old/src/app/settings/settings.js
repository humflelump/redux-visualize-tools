import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as constants from './constants';
import * as graphConstants from '../graph/constants';
import * as d3 from 'd3';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import Checkbox from 'material-ui/Checkbox';

import {Tabs, Tab} from 'material-ui/Tabs';

function getStyles(chartDimensions) {
    return {
        container: {
            position: 'absolute',
            top: graphConstants.HEADER_SIZE,
            right: 0,
            bottom: 0,
            left: 0,
            overflowY: 'auto',
        },
    };
}

const SettingsContainer = (props) => {
    const styles = getStyles();
    return <div id="settings_" style={styles.container}>
    <List>
            <Checkbox 
                style={{margin: '5px 0px 5px 15px'}}
                label="Remove Unconnected Nodes"
                checked={props.shouldFilterUnconnectedNodes}
                onCheck={props.toggleFilterUnconnectedNodes}
            />
            <Checkbox 
                style={{margin: '5px 0px 5px 15px'}}
                label="Remove Inactive Nodes"
                checked={props.shouldRemoveInactiveNodes}
                onCheck={props.toggleRemoveInactiveNodes}
            />
            <Subheader>Hightlight When Hovering:</Subheader>
            <DropDownMenu 
                value={props.hoverOption} 
                onChange={(e, key, str) => props.setHoverOption(str)}
            >
            {
                constants.FILTER_OPTIONS.map((str) => {
                    return <MenuItem value={str} primaryText={str} key={str} />
                })
            }
            </DropDownMenu>
            <Subheader>Max Nodes on Screen:</Subheader>
            <DropDownMenu 
                value={props.maxNodesOnScreen} 
                onChange={(e, key, num) => props.setMaxNodes(num)}
            >
            {
                constants.MAX_NODES_OPTIONS.map((n) => {
                    return <MenuItem value={n} primaryText={n} key={n} />
                })
            }
            </DropDownMenu>
        </List>
        </div>
}

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.Graph.settingsOpen,
    hoverOption: state.Settings.hoverOption,
    maxNodesOnScreen: state.Settings.maxNodesOnScreen,
    shouldFilterUnconnectedNodes: state.Settings.shouldFilterUnconnectedNodes,
    shouldRemoveInactiveNodes: state.Settings.shouldRemoveInactiveNodes,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleRemoveInactiveNodes: () => {
        dispatch({
            type: 'TOGGLE_shouldRemoveInactiveNodes',
        });
    },
    toggleFilterUnconnectedNodes: () => {
        dispatch({
            type: 'TOGGLE_shouldFilterUnconnectedNodes',
        });
    },
    setMaxNodes: (n) => {
        dispatch({
            type: 'SET_MAX_NODES_ON_SCREEN',
            count: n,
        });
    },
    setHoverOption: (option) => {
        dispatch({
            type: 'SET_HOVER_OPTION',
            option,
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
)(SettingsContainer);