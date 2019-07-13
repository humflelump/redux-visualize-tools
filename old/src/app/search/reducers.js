import * as constants from './constants';

const initialState = {
    open: false,
    searchText: '',
};
const Search = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_SEARCH_EXPANDED_STATE':
            return { ...state, open: !state.open};
        case 'SET_SEARCH_TEXT':
            return { ...state, searchText: action.text};
        default:
            return state
    }
};


export default Search;