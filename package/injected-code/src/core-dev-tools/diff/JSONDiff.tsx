import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import { stringify } from 'javascript-stringify';
import getItemString from './getItemString';
import { theme } from '../json-tree-theme';

const styling: any = str => {
  if (str === 'stateDiffEmpty') {
    return {
      padding: '10px',
      color: 'orange',
    };
  } else if (str === 'diff') {
    return {
      padding: '2px 3px',
      borderRadius: '3px',
      position: 'relative',
      color: 'black',
    };
  } else if (str === 'diffWrap') {
    return {
      position: 'relative',
      zIndex: 1,
    };
  } else if (str === 'diffAdd') {
    return {
      backgroundColor: 'green',
    };
  } else if (str === 'diffUpdateFrom') {
    return {
      textDecoration: 'line-through',
      backgroundColor: 'red',
    };
  } else if (str === 'diffUpdateArrow') {
    return {
      color: 'blue',
    };
  } else if (str === 'diffUpdateTo') {
    return {
      backgroundColor: 'green',
    };
  } else if (str === 'diffRemove') {
    return {
      textDecoration: 'line-through',
      backgroundColor: 'red',
    };
  } else if (str === 'treeItemHint') {
    return {
      color: 'purple',
    };
  }
};

const isWideLayout = true;

function stringifyAndShrink(val, isWideLayout) {
  if (val === null) {
    return 'null';
  }

  const str = (stringify as any)(val);
  if (typeof str === 'undefined') {
    return 'undefined';
  }

  if (isWideLayout) {
    return str.length > 42 ? str.substr(0, 30) + '…' + str.substr(-10) : str;
  }
  return str.length > 22 ? `${str.substr(0, 15)}…${str.substr(-5)}` : str;
}

const expandFirstLevel = (keyName, data, level) => level <= 1;

function prepareDelta(value) {
  if (value && value._t === 'a') {
    const res = {};
    for (const key in value) {
      if (key !== '_t') {
        if (key[0] === '_' && !value[key.substr(1)]) {
          res[key.substr(1)] = value[key];
        } else if (value['_' + key]) {
          res[key] = [value['_' + key][0], value[key][0]];
        } else if (!value['_' + key] && key[0] !== '_') {
          res[key] = value[key];
        }
      }
    }
    return res;
  }

  return value;
}

export default class JSONDiff extends Component<any, any> {
  public getItemString: any;
  public valueRenderer: any;
  constructor(props) {
    super(props);
    this.state = { data: {} };
    this.getItemString = (type, data) =>
      getItemString(styling, type, data, 'dataTypeKey', isWideLayout, true);

    this.valueRenderer = (raw, value) => {
      function renderSpan(name, body) {
        return (
          <span key={name} style={{ ...styling('diff'), ...styling(name) }}>
            {body}
          </span>
        );
      }

      if (Array.isArray(value)) {
        switch (value.length) {
          case 1:
            return (
              <span style={styling('diffWrap')}>
                {renderSpan(
                  'diffAdd',
                  stringifyAndShrink(value[0], isWideLayout)
                )}
              </span>
            );
          case 2:
            return (
              <span style={styling('diffWrap')}>
                {renderSpan(
                  'diffUpdateFrom',
                  stringifyAndShrink(value[0], isWideLayout)
                )}
                {renderSpan('diffUpdateArrow', ' => ')}
                {renderSpan(
                  'diffUpdateTo',
                  stringifyAndShrink(value[1], isWideLayout)
                )}
              </span>
            );
          case 3:
            return (
              <span style={styling('diffWrap')}>
                {renderSpan(
                  'diffRemove',
                  stringifyAndShrink(value[0], isWideLayout)
                )}
              </span>
            );
        }
      }

      return raw;
    };
  }

  public componentDidMount() {
    this.updateData();
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.delta !== this.props.delta) {
      this.updateData();
    }
  }

  public updateData() {
    // this magically fixes weird React error, where it can't find a node in tree
    // if we set `delta` as JSONTree data right away
    // https://github.com/alexkuz/redux-devtools-inspector/issues/17

    this.setState({ data: this.props.delta });
  }

  public render() {
    if (!this.state.data) {
      return <div style={styling('stateDiffEmpty')}>(states are equal)</div>;
    }

    return (
      <JSONTree
        theme={theme as any}
        invertTheme={true}
        data={this.state.data}
        getItemString={this.getItemString as any}
        valueRenderer={this.valueRenderer as any}
        postprocessValue={prepareDelta as any}
        isCustomNode={Array.isArray as any}
        shouldExpandNode={expandFirstLevel as any}
        hideRoot={true}
      />
    );
  }
}
