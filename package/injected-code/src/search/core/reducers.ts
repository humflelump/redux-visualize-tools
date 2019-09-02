import { ImmerReducer } from 'immer-reducer';
import { createActionCreators, createReducerFunction } from 'immer-reducer';

const initialState = {
  searchText: '',
  searchResultsOpen: false,
};

type ISearchState = typeof initialState;

class SearchReducerClass extends ImmerReducer<ISearchState> {
  setSearchText(text: string) {
    this.draftState.searchText = text;
    this.draftState.searchResultsOpen = true;
  }

  closeDropdown() {
    this.draftState.searchResultsOpen = false;
  }

  openDropdown() {
    this.draftState.searchResultsOpen = true;
  }
}

export const SearchActions = createActionCreators(SearchReducerClass);
export const SearchReducer = createReducerFunction(
  SearchReducerClass,
  initialState
);
