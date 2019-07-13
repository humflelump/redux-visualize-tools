import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as constants from './constants';
import * as graphActions from '../graph/actions';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

function getStyles(dimensions) {
    const HEIGHT = 20;
    return {
        container: {
            ...dimensions,
            position: 'absolute',
            backgroundColor: 'rgba(255,255,255,0.5)',
            zIndex: 1,
            transition: 'all 0.3s',
        },
        innerContainer: {
            position: 'absolute',
            left: 10,
            top: 2,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
        },
        removeLabel: {
            color: 'blue',
            cursor: 'pointer',
            marginRight: 10,
        },
        text: {
            cursor: 'pointer',
        },
    };
}

const FilterPopup = (props) => {
    const styles = getStyles(props.filterPopupDimensions);
    const node = props.nodeToFilterOn;
    const name = node ? node.data.name : ''
    return <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div style={styles.container}>
            <div style={styles.innerContainer}>
                <div onClick={() => props.setSelectedNode(node)}style={styles.text}>
                    {`Showing ${props.filterType} For `}
                    <b>{`${name}`}</b>
                </div>
                <div 
                    onClick={() => {
                        props.removeFilter();
                        graphActions.resetZoom();
                    }} 
                    style={styles.removeLabel}
                >
                    Remove Filter
                </div>
            </div>
        </div>
    </MuiThemeProvider>
}

const mapStateToProps = (state, ownProps) => {
  return {
    filterPopupDimensions: selectors.filterPopupDimensions(state),
    nodeToFilterOn: selectors.nodeToFilterOn(state),
    filterType: state.ContextMenu.filterType,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeFilter: () => {
        dispatch({
            type: 'REMOVE_NODE_TO_FILTER_ON',
        });
    },
    setSelectedNode: (node) => {
        dispatch({
            type: 'SET_SELECTED_NODE',
            node: node.id,
        });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPopup);