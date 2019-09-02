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
  List,
  ListItem,
  ListItemText,
  ClickAwayListener,
} from '@material-ui/core';
import { IState } from '../../store';
import { Dispatch } from 'redux';
import {
  searchDimensions,
  searchedNodes,
  dropdownDimensions,
} from '../core/selectors';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Close';
import { clickedSearchNode } from '../core/actions';
import { FixedSizeList } from 'react-window';
import { SearchActions } from '../core/reducers';

const mapStateToProps = (state: IState) => {
  return {
    dimensions: dropdownDimensions(state),
    searchedNodes: searchedNodes(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    closeDropdown: () => {
      dispatch(SearchActions.closeDropdown());
    },
    select: clickedSearchNode,
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
      transition: 'all 0.3s',
      overflow: 'auto',
      backgroundColor: 'rgba(255,255,255,0.85)',
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
      <ClickAwayListener onClickAway={props.closeDropdown}>
        <div
          id="SearchDropdown_"
          style={{
            ...props.dimensions,
            border:
              props.dimensions.height === 0
                ? '1px solid rgba(0,0,0,0)'
                : '1px solid rgba(0,0,0,0.1)',
          }}
          className={props.classes.container}
        >
          <FixedSizeList
            itemSize={48}
            height={props.dimensions.height}
            width={props.dimensions.width}
            itemData={props.searchedNodes}
            itemCount={props.searchedNodes.length}
          >
            {({ index, style }) => {
              const node = props.searchedNodes[index];
              return (
                <ListItem
                  style={style}
                  button
                  onClick={() => props.select(node)}
                >
                  <ListItemText primary={node.name} />
                </ListItem>
              );
            }}
          </FixedSizeList>
        </div>
      </ClickAwayListener>
    );
  }
}

export const SearchDropdownComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
