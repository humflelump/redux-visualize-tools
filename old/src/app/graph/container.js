import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as graphSelectors from './create-graph-selectors';
import * as d3 from 'd3';
import Node from './node';
import Arrows from './arrow';
import Header from './header';
import SearchDropdown from '../search/dropdown';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

function getStyles(chartDimensions) {
    return {
        container: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
        },
        divContainer: {
            ...chartDimensions,
            position: 'relative',
            zIndex: 1,
            border: '0px solid black',
            overflow: 'hidden',
            backgroundColor: 'rgba(0,0,0,0.05)',
        },
    };
}

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.data = {
            props,
        };
        this.dom = {};
    }

    componentDidMount() {
        this.data.props = this.props;
        update(this.data, this.dom);
    }

    componentDidUpdate() {
        this.data.props = this.props;
        update(this.data, this.dom);
    }

    render() {
        const styles = getStyles(this.props.chartDimensions);

        return <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <div style={styles.container} >
                <Header />
                <SearchDropdown />
                <div id="Graph" style={styles.divContainer}>
                {
                    this.props.rectangles.map((rect) => {
                        return (<Node 
                            key={rect.node.id}
                            rect={rect} 
                            highlight={this.props.highlightedNodes.has(rect.node.id)}
                            selected={this.props.selectedNodeId === rect.node.id}
                        />)
                    })
                }
                </div>
                <Arrows />
            </div>
        </MuiThemeProvider>
    }
}

function update(data, dom) {
    const container = d3.select('#Graph');

    const zoom = data.props.zoom(zoomed);

    function zoomed() {
        if (data.stopRecursion) {
            data.stopRecursion = false;
            return;
        }

        const newXScale = d3.event.transform.rescaleX(data.props.xScale);
        const newYScale = d3.event.transform.rescaleY(data.props.yScale);
    
        data.props.setScales(newXScale, newYScale);
        data.stopRecursion = true;
        container.call(zoom.transform, d3.zoomIdentity);
    }

    container.call(zoom);
}

const mapStateToProps = (state, ownProps) => {
  return {
    chartDimensions: selectors.chartDimensions(state),
    rectangles: selectors.performanceRectangles(state),
    zoom: selectors.zoom(state),
    xScale: selectors.xScale(state),
    yScale: selectors.yScale(state),
    arrows: selectors.arrows(state),
    highlightedNodes: selectors.highlightedNodes(state),
    selectedNodeId: state.ContextMenu.selectedNodeId,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScales: (x, y) => {
        dispatch({
            type: 'SET_SCALES',
            x: x,
            y: y,
        });
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Graph);