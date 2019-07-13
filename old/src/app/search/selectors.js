import { createSelector } from 'reselect';
import createAsyncSelector from 'async-selector';
import * as d3 from 'd3';
import * as constants from './constants';
import * as graphSelectors from '../graph/create-graph-selectors';
import _ from 'underscore';
import search from 'material-ui/svg-icons/action/search';
import * as contextMenuSelectors from '../context-menu/selectors';

const nodes = contextMenuSelectors.nodes;
const searchText = state => state.Search.searchText;
const open = state => state.Search.open;

function compareStrings(str_, searchStr_) {
    const str = str_.toLowerCase();
    const searchStr = searchStr_.toLowerCase();
    if (str.startsWith(searchStr)) return 2;
    if (str.includes(searchStr)) return 1;
    return 0;
}

function getSearchResults(nodes, searchText) {
    //console.log('selectedNodes, searchText', selectedNodes, searchText)
    if (searchText === '') return [];
    const filtered = nodes.filter((node) => {
        return compareStrings(node.data.name, searchText) > 0;
    });
    const result = _.sortBy(filtered, (node) => {
        return compareStrings(node.data.name, searchText);
    });
    return result
}
export const searchResults = createSelector([nodes, searchText], getSearchResults);

function getIfDropdownIsVisible(searchResults, open) {
    if (!open) return false;
    return searchResults.length > 0;
}
export const isDropdownVisible = createSelector([searchResults, open], getIfDropdownIsVisible);
