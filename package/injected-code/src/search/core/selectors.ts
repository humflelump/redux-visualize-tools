import { IState } from '../../store';
import { createSelector } from 'reselect';
import { INode } from '../../graph/types';
import sortBy from 'lodash/sortBy';
import { leftPanelEffectiveWidth } from '../../core-dev-tools/left-side-panel/core/selectors';
import { windowHeight } from '../../window-dimensions/selectors';
import { nodeData } from '../../graph/core/node-data-selector';

const searchText = (state: IState) => state.Search.searchText;

function getSearchValue(text: string, search: string): number {
  const textLower = text.toLowerCase();
  if (textLower.startsWith(search)) {
    return 2;
  } else if (textLower.includes(search)) {
    return 1;
  } else {
    return 0;
  }
}

export const searchedNodes = createSelector(
  [searchText, nodeData],
  (searchText, nodes) => {
    if (searchText === '') {
      return [];
    }
    const lowerSearch = searchText.toLowerCase();
    const result = nodes.filter(node => {
      return getSearchValue(node.name, lowerSearch) > 0;
    });
    return sortBy(result, d => getSearchValue(d.name, lowerSearch));
  }
);

export const searchDimensions = createSelector(
  [leftPanelEffectiveWidth],
  width => {
    const left = width === 0 ? 48 : width;
    return {
      left,
      top: 0,
      width: 200,
      height: 48,
    };
  }
);

export const dropdownDimensions = createSelector(
  [searchDimensions, windowHeight, searchedNodes],
  (dimensions, windowHeight, searchedNodes) => {
    const top = dimensions.top + dimensions.height;
    return {
      left: dimensions.left,
      top,
      width: dimensions.width + 100,
      height: Math.min(
        searchedNodes.length * 48,
        Math.min(300, windowHeight - top)
      ),
    };
  }
);
