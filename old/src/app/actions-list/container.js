import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as actions from './actions';
import * as d3 from 'd3';
import * as constants from './constants';
import * as graphConstants from '../graph/constants';
import * as contextConstants from '../context-menu/constants';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Toggle from 'material-ui/Toggle';

import JSONTree from 'react-json-tree'

function getStyles(selectedAction) {
    const infoSize = selectedAction === null ? 0 : contextConstants.HEIGHT;
    return {
        container: {
            position: 'absolute',
            top: graphConstants.HEADER_SIZE,
            right: 0,
            bottom: infoSize,
            left: 0,
            overflowY: 'auto',
        },
        infoArea: {
            position: 'absolute',
            height: infoSize,
            right: 0,
            bottom: 0,
            left: 0,
            overflowY: 'auto',
        },
        flex: {
            display: 'flex',
            justifyContent: 'space-around',
        },
    };
}

class CustomListItem extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            hovered: false,
        }
    }

    getBackground() {
        return this.props.clicked 
            ? (this.state.hovered
                ? 'rgb(255,240,240)'
                : 'rgb(255,230,230)')
            : (this.state.hovered
                ? 'rgb(240,240,240)'
                : 'white');
    }

    getStyles() {
        return {
            container: {
                padding: 5,
                backgroundColor: this.getBackground(),
                cursor: 'pointer',
            },
        };
    }

    render() {
        const { primaryText, onClick, id } = this.props;
        const styles = this.getStyles();
        return <div 
            id={id}
            onMouseEnter={() => this.setState({hovered: true})}
            onMouseLeave={() => this.setState({hovered: false})}
            style={styles.container} 
            onClick={onClick}
        >
            {primaryText}
        </div>
    }
}

const Hider = (props) => (props.visible ? props.children : null);

const ActionsContainer = (props) => {
    const styles = getStyles(props.selectedAction);
    return <Paper>
        <div style={styles.container} id="actions-container">
            <List>
            {
                props.actions.map((action, index) => {
                    return <CustomListItem
                        id={`act_${index}`}
                        clicked={action === props.selectedAction}
                        primaryText={action.type} 
                        onClick={() => {
                            actions.setActionIndex(index, false);
                        }}
                    />
                })
            }
            </List>
        </div>
        <div style={styles.infoArea}>
            <div style={styles.flex}>
            {
                constants.VIEWS.map((view) => {
                    const isSelected = props.viewMode === view;
                    return <Chip
                        backgroundColor={isSelected ? 'rgb(206,206,206)' : null}
                        onClick={() => props.setViewMode(view)}
                        key={view}
                    >
                        {view}
                    </Chip>
                })
            }
            </div>
            <Toggle
                label="Most Recent Action"
                labelPosition="right"
                toggled={props.showMostRecentAction}
                onToggle={props.toggleMostRecent}
            />
            <Hider visible={props.viewMode === constants.ACTION_VIEW}>
                <JSONTree 
                    data={props.selectedAction} 
                    hideRoot={true} 
                    theme={contextConstants.jsonTheme}
                    invertTheme={true}
                />
            </Hider>
            <Hider visible={props.viewMode === constants.STATE_VIEW}>
                <JSONTree 
                    data={props.selectedState} 
                    hideRoot={true} 
                    theme={contextConstants.jsonTheme}
                    invertTheme={true}
                />
            </Hider>
        </div>
    </Paper>
}

const mapStateToProps = (state, ownProps) => {
  return {
    actions: selectors.actions(state),
    selectedIndex: state.ActionsList.selectedActionIndex,
    selectedAction: selectors.selectedAction(state),
    viewMode: state.ActionsList.viewMode,
    selectedState: selectors.selectedState(state),
    showMostRecentAction: state.ActionsList.showMostRecentAction,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMostRecent: () => {
        dispatch({
            type: 'TOGGLE_mostRecentAction',
        });
    },
    setViewMode: (mode) => {
        dispatch({
            type: 'SET_ACTION_VIEW_MODE',
            mode,
        });
    },
    setSelectedActionIndex: (index) => {
        dispatch({
            type: 'SET_SELECTED_ACTION_INDEX',
            index: index,
        });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsContainer);