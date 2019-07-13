import * as constants from './constants';

const initialState = {
    selectedNodeId: null,
    nodeIdToFilterOn: null,
    filterType: constants.NO_FILTER,
};
const ContextMenu = (state = initialState, action) => {
    switch (action.type) {
        case 'REMOVE_NODE_TO_FILTER_ON':
            return {
                ...state,
                nodeIdToFilterOn: null,
            };
        case 'SET_NODE_TO_FILTER_ON':
            return {
                ...state, 
                nodeIdToFilterOn: action.node.id,
                filterType: action.filter,
            };
        case 'SET_SELECTED_NODE':
            return { ...state, selectedNodeId: action.node};
        default:
            return state
    }
};


export default ContextMenu;