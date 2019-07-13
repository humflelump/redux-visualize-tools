import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as actions from './actions';
import * as graphConstants from '../graph/constants';
import * as constants from './constants';
import * as graphActions from '../graph/actions';

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


function getStyles(open, results) {
    const height = graphConstants.HEADER_SIZE;
    return {
        container: {
            position: 'absolute',
            top: 0,
            right: 0,
            height: !open ? 0 : Math.min(300, constants.LISTITEM_HEIGHT * results.length + 10),
            width: constants.DROPDOWN_WIDTH,
            transition: 'all 0.3s',
            zIndex: 3,
            backgroundColor: 'rgb(64, 0, 124)',
            overflow: 'auto',
        },
        containerContainer: {
            position: 'absolute',
            top: height,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 2,
            backgroundColor: 'rgba(0,0,0,0.12)',
            display: !open ? 'none' : null,
        },
    };
}

const SearchDropdown = (props) => {
    const styles = getStyles(props.open, props.results);
    return <div style={styles.containerContainer}>
        <Paper zDepth={2} style={styles.container}>
            <List>
            {
                props.results.map((node) => {
                    return <ListItem 
                        onClick={() => {
                            actions.searchItemClicked(node);
                        }}
                        primaryText={node.data.name}
                        key={node.data.id}
                    />
                })
            }
            </List>
        </Paper>
    </div>
}

const mapStateToProps = (state) => {
  return {
    open: selectors.isDropdownVisible(state),
    results: selectors.searchResults(state),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => {
        dispatch({
            type: 'TOGGLE_SEARCH_EXPANDED_STATE',
        });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchDropdown);