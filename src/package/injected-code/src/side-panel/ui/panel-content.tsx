import React from 'react';
import { IState } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import {
  WithStyles,
  Theme,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { NODE_FILTER_TYPES } from './constants';
import { clickedNode } from '../../graph/core/selectors';
import { NODE_FILTER_TYPE } from '../../graph/types';

const mapStateToProps = (state: IState) => {
  return {
    node: clickedNode(state),
    clickedNodeFilter: state.Graph.clickedNodeFilter,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setFilter: (str: NODE_FILTER_TYPE) => {
      dispatch({
        type: 'SET_CLICKED_NODE_FILTER',
        filter: str,
      });
    },
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {},
    title: {
      fontSize: 18,
      fontFamily: '"Roboto", sans-serif',
      textAlign: 'center',
      padding: 5,
      fontWeight: 600,
    },
    label: {
      fontSize: 15,
      fontFamily: '"Roboto", sans-serif',
      textAlign: 'left',
      margin: 5,
      color: 'rgb(100,100,100)',
    },
    functionArea: {
      margin: 10,
      width: 'calc(100% - 20px)',
    },
    returnValueArea: {
      margin: 10,
      width: 'calc(100% - 20px)',
    },
  });

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface IStyleProps extends WithStyles<typeof styles> {}
export interface IPassedProps {}
type Props = StateProps & DispatchProps & IStyleProps & IPassedProps;

function stringify(d: any): string {
  if (d && typeof d === 'object') {
    return JSON.stringify(d, undefined, 2);
  } else {
    return String(d);
  }
}

class Component extends React.Component<Props> {
  public render() {
    const props = this.props;
    if (!props.node) {
      return null;
    }
    return (
      <div className={props.classes.container}>
        <div className={props.classes.title}>{props.node.label}</div>
        <Divider />
        <div className={props.classes.functionArea}>
          <div className={props.classes.label}>Function Text:</div>
          <textarea
            rows={6}
            style={{ width: '100%' }}
            value={String(props.node.data.function || 'No Content')}
          />
        </div>
        <div className={props.classes.functionArea}>
          <div className={props.classes.label}>Return Value:</div>
          <textarea
            rows={6}
            style={{ width: '100%' }}
            value={stringify(props.node.data.value)}
          />
        </div>
        <div style={{ width: '100%', marginLeft: 10 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              Show Relatives of this Node
            </FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={props.clickedNodeFilter}
              onChange={(e: any) => props.setFilter(e.target.value)}
            >
              {NODE_FILTER_TYPES.map(type => {
                return (
                  <FormControlLabel
                    value={type}
                    control={<Radio />}
                    label={type}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    );
  }
}

export const PanelContents = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
