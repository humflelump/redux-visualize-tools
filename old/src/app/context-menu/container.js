import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as constants from './constants';
import * as graphConstants from '../graph/constants';
import * as graphActions from '../graph/actions';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import JSONTree from 'react-json-tree'

function getStyles(dimensions) {
    const HEADER = 32;
    return {
        container: {
            ...dimensions,
            position: 'absolute',
            backgroundColor: 'white',
            zIndex: 2,
            transition: 'all 0.3s'

        },
        header: {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            height: HEADER,
            borderBottom: '1px solid rgb(209, 209, 209)',
        },
        closeButton: {
            position: 'absolute',
            top: 0,
            right: 7,
            width: HEADER,
            height: HEADER,
        },
        headerText: {
            fontSize: 20,
            fontFamily: '"Roboto", sans-serif',
            color: 'rgb(24, 24, 24)',
            textAlign: 'center',
            margin: '5px 0px 5px 15px',
        },
        dataArea: {
            position: 'absolute',
            left: 0,
            right: '50%',
            top: HEADER,
            bottom: 0,
            borderRight: '1px solid rgb(209, 209, 209)',
            overflow: 'auto',
        },
        listArea: {
            position: 'absolute',
            right: 0,
            left: '50%',
            top: HEADER,
            bottom: 0,
            overflow: 'auto',
        },
        jsonString: {
            fontSize: 10,
            marginLeft: 5,
            cursor: 'pointer',
        },
        filterHeaderText: {
            fontSize: 16,
            fontWeight: '600',
            fontFamily: '"Roboto", sans-serif',
            color: 'rgb(50, 50, 50)',
            textAlign: 'left',
            margin: 10,
        },
    };
}

const ContextMenu = (props) => {
    const styles = getStyles(props.dimensions);
    const d = (props.selectedNode || {}).data || {};
    return <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Paper zDepth={3} id="context" style={styles.container}>
            <Paper style={styles.header}>
                <div style={styles.closeButton}>
                    <div style={{marginTop: -8}}>
                        <IconButton onClick={props.close}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                <div style={styles.headerText}>{d.name}</div>
            </Paper>
            <div style={styles.dataArea} onClick={() => window.log(d.id)}>
                <JSONTree 
                    data={props.nodeMetadata} 
                    hideRoot={true} 
                    theme={constants.jsonTheme}
                    invertTheme={true}
                />
                <Divider />
                <JSONTree 
                    data={props.nodeValue} 
                    hideRoot={true} 
                    theme={constants.jsonTheme}
                    invertTheme={true}
                />
                
                
                {/* <pre style={styles.jsonString}>
                    {props.dataText}
                </pre> */}
            </div>
            <div style={styles.listArea}>
                <div style={styles.filterHeaderText}>
                    Only Show:
                </div>
                {
                    constants.FILTER_OPTIONS.map((str) => {
                        const selected = props.filterType === str;
                        const Icon = constants.BUTTON_ICONS[str];
                        return <div>
                            <FlatButton
                                icon={<Icon />} 
                                primary={true}
                                label={str}
                                onClick={() => {
                                    props.setFilter(props.selectedNode, str);
                                    graphActions.resetZoom();
                                }}
                            />
                        </div>
                    })
                }
            </div>
        </Paper>
    </MuiThemeProvider>
}

const mapStateToProps = (state, ownProps) => {
  return {
    dimensions: selectors.dimensions(state),
    selectedNode: selectors.selectedNode(state),
    filterType: state.ContextMenu.filterType,
    nodeValue: selectors.nodeValue(state),
    nodeMetadata: selectors.nodeMetadata(state),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFilter: (node, filter) => {
        dispatch({
            type: 'SET_NODE_TO_FILTER_ON',
            filter: filter,
            node: node,
        });
    },
    close: () => {
        dispatch({
            type: 'SET_SELECTED_NODE',
            node: null,
        });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContextMenu);