import { IState } from '../../store';
import { createSelector } from 'reselect';
import { INode } from '../../graph/types';
import sortBy from 'lodash/sortBy';
import memoize from 'lodash/memoize';
import { leftPanelEffectiveWidth } from '../../core-dev-tools/left-side-panel/core/selectors';
import { windowHeight } from '../../window-dimensions/selectors';
import { nodeData } from '../../graph/core/node-data-selector';
import { asyncSearcher, ISearchResult } from './compare-async';
import createAsyncSelector from 'async-selector';

const searchText = (state: IState) => state.Search.searchText;

const makeFunctionTextExtractor = () => {
  const map = new Map<any, string>();
  return (func: any | undefined) => {
    if (!func) {
      return '';
    }
    if (map.has(func)) {
      return map.get(func) as string;
    }
    const text = String(func).slice(0, 10000);
    map.set(func, text);
    return text;
  };
};
const funcToString = makeFunctionTextExtractor();

const searchAsyncSelector = createAsyncSelector(
  {
    onResolve: () => {
      (window as any).store.dispatch({ type: 'RERENDER' });
    },
    async: (nodes: INode[], searchText: string) => {
      const input = {
        strings: nodes.map(node => funcToString(node.function)),
        searchText,
      };
      return asyncSearcher.compute(input);
    },
    sync: () => [],
  },
  nodeData,
  searchText
);

function compare(search: string, text: string) {
  search = search.toLowerCase();
  text = text.toLowerCase();
  if (text.startsWith(search)) {
    return 2;
  } else if (text.includes(search)) {
    return 1;
  } else {
    return 0;
  }
}

export const searchedNodes = createSelector(
  [searchAsyncSelector, nodeData, searchText],
  (searchAsyncSelector: any, nodes, searchText) => {
    const searchResults: ISearchResult[] = searchAsyncSelector.previous || [];
    if (searchText === '') return [];
    if (searchResults.length !== nodes.length) return [];
    const unsorted = nodes.map((node, index) => {
      return {
        node,
        result: searchResults[index],
        value: compare(searchText, node.name),
      };
    });
    const rank = d => (d.result.length - 10) / 100 + d.value;
    const filtered = unsorted.filter(d => rank(d) > 0);
    return sortBy(filtered, d => -1 * rank(d)).map(d => d.node);
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
