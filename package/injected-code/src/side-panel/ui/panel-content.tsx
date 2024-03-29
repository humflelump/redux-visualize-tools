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
  IconButton,
  Button,
} from '@material-ui/core';
import { NODE_FILTER_TYPES } from './constants';
import {
  clickedNode,
  triggerResetZoomWhenGraphIsFinishedCalculating,
} from '../../graph/core/selectors';
import { NODE_FILTER_TYPE, INode, IUINode } from '../../graph/types';
import { JsonViewer } from './json-viewer';
import DeleteIcon from '@material-ui/icons/Close';
import { canShowComponentForClickedNode } from '../../selected-component/selectors';
import { SelectedComponentActions } from '../../selected-component/reducers';
import { GraphActions } from '../../graph/core/reducers';

const mapStateToProps = (state: IState) => {
  return {
    node: clickedNode(state),
    nodeFilter: state.Graph.nodeFilter,
    canShowComponent: canShowComponentForClickedNode(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    viewNodeComponent: (node: IUINode | null) => {
      const id = node ? node.data.id : null;
      dispatch(SelectedComponentActions.setComponentNode(id));
    },
    setFilter: (str: NODE_FILTER_TYPE, nodeId: string) => {
      triggerResetZoomWhenGraphIsFinishedCalculating();
      dispatch(GraphActions.setNodeFilter(str, nodeId));
    },
    close: () => {
      dispatch(GraphActions.clearClickedNode());
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
      height: 38,
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
    closeButtonContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
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
    if (!props.node) {
      return null;
    }

    return (
      <div className={props.classes.container}>
        <div className={props.classes.closeButtonContainer}>
          <IconButton onClick={props.close}>
            <DeleteIcon />
          </IconButton>
        </div>
        <div className={props.classes.title}>{props.node.label}</div>
        <Divider />
        {props.canShowComponent && (
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <Button
              onClick={() => props.viewNodeComponent(props.node)}
              variant="outlined"
              color="primary"
            >
              Show Component
            </Button>
          </div>
        )}
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
          <JsonViewer data={props.node.data.value} />
        </div>
        <div style={{ width: '100%', marginLeft: 10 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              Show Relatives of this Node
            </FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={
                props.node.data.id === props.nodeFilter.nodeId
                  ? props.nodeFilter.filterType
                  : NODE_FILTER_TYPE.NO_FILTER
              }
              onChange={(e: any) =>
                props.setFilter(e.target.value, (props.node as IUINode).data.id)
              }
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
