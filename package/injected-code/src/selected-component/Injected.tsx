import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, Paper, IconButton } from '@material-ui/core';
import { IState } from '../store';
import { nodeToShowComponentFor } from './selectors';
import CloseIcon from '@material-ui/icons/Close';
import { IUINode, INode } from '../graph/types';

const mapStateToProps = (state: IState) => {
  return {
    node: nodeToShowComponentFor(state),
    graph: state.CommChannel.graph,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const styles = (theme: Theme) => createStyles({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface IStyleProps extends WithStyles<typeof styles> {}
type Props = StateProps & DispatchProps & IStyleProps;

class Component extends React.Component<Props> {
  public componentDidMount() {
    const that = this;
    class ChildRoot extends React.Component<any, any> {
      private unsubscribe: any;
      constructor(props) {
        super(props);
        const { store } = that.props.graph;
        this.unsubscribe = store.subscribe(() => {
          this.setState({});
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      public render() {
        const { store } = that.props.graph;
        const { Provider } = that.props.graph.appData;
        const node = that.props.node as INode;
        const Component = node.componentInfo.component as any;
        const componentProps = node.componentInfo.props;
        return (
          <Provider store={store}>
            <Component {...componentProps} />
          </Provider>
        );
      }
    }

    const { ReactDOM } = this.props.graph.appData;
    ReactDOM.render(<ChildRoot />, document.getElementById('child-root-'));
  }

  public render() {
    return <div id="child-root-" />;
  }
}

export const InjectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Component)) as any;
