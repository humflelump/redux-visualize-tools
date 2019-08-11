import React from 'react';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme } from '@material-ui/core';
import JSONTree from 'react-json-tree';

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

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
