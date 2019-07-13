import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as graphConstants from '../graph/constants';
import * as constants from './constants';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

import IconButton from 'material-ui/IconButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import SearchIcon from 'material-ui/svg-icons/action/search';


function getStyles(open) {
    const height = graphConstants.HEADER_SIZE;
    return {
        container: {

        },
        searchIcon: {
            position: 'absolute',
            right: open ? height + constants.SEARCH_WIDTH : height,
            top: 0,
            bottom: 0,
            width: height,
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: 'column',
            transition: 'all 0.3s',
        },
        inputContainer: {
            position: 'absolute',
            right: height,
            top: 0,
            bottom: 0,
            width: open ? constants.SEARCH_WIDTH : 0,
            transition: 'all 0.3s',
            overflow: 'hidden',
        }
    };
}

const Search = (props) => {
    const styles = getStyles(props.open);
    return <div style={styles.container}>
        <div style={styles.searchIcon}>
            <IconButton 
                onClick={() => {
                    props.toggle();
                    const el = document.getElementById('Search');
                    if (!el) return;
                    el.focus();
                }} 
                tooltip="Search"
            >
                <SearchIcon color="white"/>
            </IconButton>
        </div>
        <div style={styles.inputContainer}>
            <TextField
                id="Search"
                hintText="Search"
                fullWidth={true}
                value={props.searchText}
                onChange={(e, str) => props.setText(str)}
            />
        </div>
    </div>
}

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.Search.open,
    searchText: state.Search.searchText
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggle: () => {
        dispatch({
            type: 'TOGGLE_SEARCH_EXPANDED_STATE',
        });
    },
    setText: (str) => {
        dispatch({
            type: 'SET_SEARCH_TEXT',
            text: str,
        });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);