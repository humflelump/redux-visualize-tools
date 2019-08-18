import React from 'react';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme } from '@material-ui/core';
import JSONTree from 'react-json-tree';
import { theme } from '../../core-dev-tools/json-tree-theme';

const styles = (theme: Theme) =>
  createStyles({
    container: {},
    text: {
      fontSize: 14,
      fontFamily: '"Roboto", sans-serif',
      color: 'blue',
      margin: '0px 5px 0px 5px',
      cursor: 'pointer',
    },
  });

interface IStyleProps extends WithStyles<typeof styles> {}
export interface IOwnProps {
  data: any;
}
type Props = IStyleProps & IOwnProps;

interface IState {
  jsonMode: boolean;
}

function stringify(d: any): string {
  if (d && typeof d === 'object') {
    try {
      return JSON.stringify(d, undefined, 2);
    } catch (e) {
      return 'Failed to JSON.stringify; ' + e;
    }
  } else {
    return String(d);
  }
}

class Component extends React.Component<Props, IState> {
  public readonly state = {
    jsonMode: false,
  };

  public render() {
    const props = this.props;
    return (
      <div className={props.classes.container}>
        <div style={{ display: 'flex' }}>
          <div
            className={props.classes.text}
            onClick={() => this.setState({ jsonMode: false })}
            style={{
              textDecoration: !this.state.jsonMode ? 'underline' : 'none',
            }}
          >
            Text
          </div>
          <div
            className={props.classes.text}
            onClick={() => this.setState({ jsonMode: true })}
            style={{
              textDecoration: this.state.jsonMode ? 'underline' : 'none',
            }}
          >
            Tree
          </div>
        </div>
        {this.state.jsonMode ? (
          <JSONTree theme={theme} invertTheme={true} data={props.data} />
        ) : (
          <textarea
            rows={6}
            style={{ width: '100%' }}
            value={stringify(props.data)}
          />
        )}
      </div>
    );
  }
}

export const JsonViewer = withStyles(styles)(Component) as React.ComponentClass<
  IOwnProps
>;
