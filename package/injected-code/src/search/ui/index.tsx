import React from 'react';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import {
  WithStyles,
  Theme,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Popover,
} from '@material-ui/core';
import { IState } from '../../store';
import { Dispatch } from 'redux';
import { searchDimensions } from '../core/selectors';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Close';
import { SearchDropdownComponent } from './dropdown';

const mapStateToProps = (state: IState) => {
  return {
    dimensions: searchDimensions(state),
    searchText: state.Search.searchText,
    searchResultsOpen: state.Search.searchResultsOpen,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    search: (str: string) => {
      dispatch({
        type: 'SET_SEARCH_TEXT',
        text: str,
      });
    },
    openDropdown: () => {
      dispatch({
        type: 'OPEN_SEARCH_DROPDOWN',
      });
    },
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
      transition: 'all 0.3s',
    },
    searchIconContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 48,
    },
  });

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface IStyleProps extends WithStyles<typeof styles> {}
export interface IPassedProps {}
type Props = StateProps & DispatchProps & IStyleProps & IPassedProps;

class Component extends React.Component<Props> {
  public render() {
    const props = this.props;

    return (
      <React.Fragment>
        <div
          id="SearchContainer"
          style={props.dimensions}
          className={props.classes.container}
        >
          <div style={{ margin: '-10px 0px 0px 10px' }}>
            <TextField
              value={props.searchText}
              onChange={e => props.search(e.target.value)}
              onClick={props.openDropdown}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: props.searchText !== '' && (
                  <InputAdornment position="end">
                    <DeleteIcon
                      fontSize="small"
                      onClick={() => props.search('')}
                      style={{ cursor: 'pointer', color: 'gray' }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        {props.searchResultsOpen && props.searchText !== '' && (
          <SearchDropdownComponent />
        )}
      </React.Fragment>
    );
  }
}

export const SearchComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
