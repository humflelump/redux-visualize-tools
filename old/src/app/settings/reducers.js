import * as constants from './constants';

const initialState = {
    settingsOpen: false,
    shouldFilterUnconnectedNodes: false,
    shouldRemoveInactiveNodes: false,
    hoverOption: constants.DEPENDANCIES,
    maxNodesOnScreen: 100,
    settingsTab: constants.ACTIONS_TAB,
};

const Settings = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SETTINGS_TAB':
            return { ...state, settingsTab: action.tab };
        case 'TOGGLE_shouldRemoveInactiveNodes':
            return { ...state, shouldRemoveInactiveNodes: !state.shouldRemoveInactiveNodes };
        case 'TOGGLE_shouldFilterUnconnectedNodes':
            return { ...state, shouldFilterUnconnectedNodes: !state.shouldFilterUnconnectedNodes };
        case 'SET_MAX_NODES_ON_SCREEN':
            return { ...state, maxNodesOnScreen: action.count }
        case 'SET_HOVER_OPTION':
            return { ...state, hoverOption: action.option };
        case 'TOGGLE_SETTINGS_OPEN_STATE':
            return { ...state, settingsOpen: !state.settingsOpen };
        default:
            return state
    }
};


export default Settings;