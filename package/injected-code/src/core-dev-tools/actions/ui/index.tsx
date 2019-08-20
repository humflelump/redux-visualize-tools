import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, ListItem, ListItemText } from '@material-ui/core';
import { IState } from '../../../store';
import { actions, actionsListDimensions } from '../core/selectors';
import { jumpToState } from '../core/actions';
import { FixedSizeList } from 'react-window';
import { LEFT_PANEL_WIDTH } from '../../left-side-panel/ui/constants';
import { IAction } from '../../../graph/types';
import AutoSizer from 'react-virtualized-auto-sizer';

const mapStateToProps = (state: IState) => {
  return {
    actions: actions(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    jumpToState,
    setAction: (action: IAction) => {
      dispatch({
        type: 'SET_SELECTED_ACTION',
        action,
      });
    },
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: '100%',
    },
    topPanel: {
      width: '100%',
      height: 5,
    },
  });

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface IStyleProps extends WithStyles<typeof styles> {}
export interface IPassedProps {}
type Props = StateProps & DispatchProps & IStyleProps & IPassedProps;

function actionName(action: any) {
  if (typeof action === 'function') {
    return 'Thunk';
  }
  return action.type;
}

class Component extends React.Component<Props> {
  private isScrolledDown: boolean;
  private scrollview: HTMLElement | null;

  constructor(props) {
    super(props);
    this.isScrolledDown = true;
    this.scrollview = null;
  }

  public componentDidUpdate() {
    this.listenForScrolling();
    if (this.isScrolledDown && this.scrollview) {
      this.scrollview.scrollTop = this.scrollview.scrollHeight;
    }
  }

  public componentDidMount() {
    setTimeout(() => {
      this.listenForScrolling();
    });
  }

  public render() {
    const props = this.props;
    return (
      <div id="-container" className={props.classes.container}>
        <AutoSizer>
          {({ width, height }) => {
            console.log({ width, height, actions: props.actions });
            return (
              <FixedSizeList
                itemSize={45}
                height={height}
                width={width}
                itemData={props.actions}
                itemCount={props.actions.length}
              >
                {({ index, style }) => {
                  const action = props.actions[index];
                  return (
                    <ListItem
                      button
                      style={style}
                      key={index}
                      onClick={() => {
                        props.jumpToState(action.nextState);
                        props.setAction(action);
                      }}
                    >
                      <ListItemText
                        primary={actionName(action.action)}
                        secondary={`${action.actionNumber}: ${(
                          action.endTime - action.startTime
                        ).toFixed(2)} ms`}
                      />
                    </ListItem>
                  );
                }}
              </FixedSizeList>
            );
          }}
        </AutoSizer>
      </div>
    );
  }

  private listenForScrolling() {
    try {
      const container = document.getElementById('-container') as HTMLElement;
      this.scrollview = container.childNodes[0].childNodes[0] as HTMLElement;
      let count = 0;
      this.scrollview.addEventListener('scroll', () => {
        if (!this.scrollview) {
          return;
        }
        const curscroll =
          this.scrollview.scrollTop + this.scrollview.offsetHeight;
        const maxscroll = this.scrollview.scrollHeight;

        if (curscroll === maxscroll) {
          this.isScrolledDown = true;
          count = 0;
        } else if (count < 5) {
          count += 1;
        } else {
          this.isScrolledDown = false;
        }
      });
    } catch (e) {
      this.scrollview = null;
    }
  }
}

export const ActionsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as React.ComponentClass<IPassedProps>;
