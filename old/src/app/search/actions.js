import * as graphActions from '../graph/actions';
import * as contextMenuConstants from '../context-menu/constants';

export function searchItemClicked(node) {
    window.store.dispatch({
        type: 'SET_NODE_TO_FILTER_ON',
        filter: contextMenuConstants.BOTH_FILTER,
        node: node,
    });
    graphActions.resetZoom();
    window.store.dispatch({
        type: 'TOGGLE_SEARCH_EXPANDED_STATE',
    });
    window.store.dispatch({
        type: 'SET_SELECTED_NODE',
        node: node.id,
    });
}
