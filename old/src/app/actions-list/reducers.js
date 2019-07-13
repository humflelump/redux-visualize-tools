import * as constants from './constants';
import * as actions from './actions';

const initialState = {
    actions: [],
    selectedState: {
        state: null,
        index: -1,
    },
    selectedActionIndex: null,
    viewMode: constants.ACTION_VIEW,
    showMostRecentAction: true,
};

const ActionsList = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_mostRecentAction':
            return {
                ...state,
                showMostRecentAction: !state.showMostRecentAction,
            };
        case 'SET_SELECTED_STATE':
            return {
                ...state,
                selectedState: {
                    state: action.state,
                    index: action.index,
                },
            };
        case 'SET_ACTION_VIEW_MODE':
            return { ...state, viewMode: action.mode };
        case 'SET_SELECTED_ACTION_INDEX':
            return { 
                ...state, 
                selectedActionIndex: action.index,
            };
        case 'RESET_ACTIONS':
            return { ...state, actions: []};
        case 'ADD_ACTION':
            return { ...state, actions: [...state.actions, action.action]};
        default:
            return state
    }
};


export default ActionsList;