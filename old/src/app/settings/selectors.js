import { createSelector } from 'reselect';
import createAsyncSelector from 'async-selector';
import * as d3 from 'd3';
import * as graphConstants from '../graph/constants';
import * as settingsConstants from '../settings/constants';
import * as graphFunctions from '../graph/functions';
import _ from 'underscore';

const settingsOpen = state => state.Graph.settingsOpen;

function getDimensions(settingsOpen) {
    return {
        top: 0,
        bottom: 0,
        width: graphConstants.SETTINGS_WIDTH,
        right: settingsOpen ? 0 : -1 * graphConstants.SETTINGS_WIDTH,
        leftEdge: !settingsOpen ? 0 : graphConstants.SETTINGS_WIDTH,
    };
}
export const dimensions = createSelector([settingsOpen], getDimensions);
