import { createSelector } from 'reselect';
import createAsyncSelector from 'async-selector';
import * as d3 from 'd3';
import * as graphConstants from '../graph/constants';
import * as settingsConstants from '../settings/constants';
import * as graphFunctions from '../graph/functions';
import _ from 'underscore';

const selectedActionIndex = state => state.ActionsList.selectedActionIndex;
const actions_ = state => state.ActionsList.actions;
const settingsTab = state => state.Settings.settingsTab;
const selectedStateObj = state => state.ActionsList.selectedState;

function getMostRecentActions(actions_) {
    return actions_;
    // const MAX = 100;
    // const L = actions_.length;
    // if (actions_.length <= MAX) return actions_;
    // return actions_.slice(L - MAX, MAX)
}
export const actions = createSelector([actions_], getMostRecentActions);


function getSelectedAction(actions, index, settingsTab) {
    if (settingsTab !== settingsConstants.ACTIONS_TAB) return null;
    if (typeof index !== 'number') return null;
    if (index < 0 || index >= actions.length) return null;
    return actions[index];
}
export const selectedAction = createSelector([actions, selectedActionIndex, settingsTab], getSelectedAction);


function getSelectedState (selectedStateObj) {
    return selectedStateObj.state;
}
export const selectedState = createSelector([selectedStateObj], getSelectedState);

