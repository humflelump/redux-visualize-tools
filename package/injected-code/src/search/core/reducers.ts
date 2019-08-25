import { AnyAction } from 'redux';

export const initialState = {
  searchText: '',
  searchResultsOpen: false,
};

export interface ISearchState {
  searchText: string;
  searchResultsOpen: boolean;
}

export function SearchReducer(
  state: ISearchState = initialState,
  action: AnyAction
): ISearchState {
  switch (action.type) {
    case 'SET_SEARCH_TEXT':
      return {
        ...state,
        searchText: action.text,
        searchResultsOpen: action.text !== '',
      };
    case 'CLOSE_SEARCH_DROPDOWN':
      return {
        ...state,
        searchResultsOpen: false,
      };
    case 'OPEN_SEARCH_DROPDOWN':
      return {
        ...state,
        searchResultsOpen: true,
      };
    default:
      return state;
  }
}
