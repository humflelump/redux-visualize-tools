
import _ from 'underscore';
import * as selectors from './selectors';

const state = () => window.store.getState();

export function setActionIndex(index, shouldScroll=true, updateState=true) {
    window.timeTravel(index, updateState);
    
    window.store.dispatch({
        type: 'SET_SELECTED_ACTION_INDEX',
        index: index,
    });
    if (!shouldScroll) return;
    setTimeout(() => {
        const container = document.getElementById('actions-container');
        if (!container) return;
        const el = document.getElementById(`act_${index}`);
        if (!el) return;
        const topPos = el.offsetTop;
        container.scrollTop = topPos;
    });
}
const setActionIndexThrottled = _.throttle(setActionIndex, 200);

export function moveToLatestActionIfNeccessary() {
    if (!state().ActionsList.showMostRecentAction) {
        return;
    }
    const actions = selectors.actions(state());
    const index = actions.length - 1;
    console.log(actions, index);
    setActionIndexThrottled(index, true, false); 
}
// used in popup
window.moveToLatestActionIfNeccessary = moveToLatestActionIfNeccessary;


