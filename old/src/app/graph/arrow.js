import React from 'react';
import * as d3 from 'd3';
import * as visConstants from './constants';
import * as selectors from './selectors'; 
import * as constants from './constants';
import { connect } from 'react-redux'

function getStyles(chartDimensions) {
    return {
        line: {
            stroke: 'rgb(255,0,0)',
            strokeWidth: 2,
        },
        svgContainer: {
            ...chartDimensions,
            position: 'absolute',
            zIndex: 0,
            pointerEvents: 'none',
        },
    };
}

class Arrow extends React.Component {
    constructor(props) {
        super(props);
        this.data = {props};
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
    
        return <svg id="arrows" style={styles.svgContainer}/>
    }
}

function update(data, dom) {
    dom.svg = dom.svg || d3.select('#arrows');

    const enter = sel => sel
        .attr('class', 'arr')
        .attr('stroke', 'red')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', 2.5)

    const update = sel => sel
        .transition()
        .ease(d3.easeLinear)
        .duration(data.props.animations ? constants.TRANSITION_MS : 0)
        .attr('x1', d => d.x1)
        .attr('x2', d => d.x2)
        .attr('y1', d => d.y1)
        .attr('y2', d => d.y2)
        

    dom.arrows = dom.svg
        .selectAll('.arr')
        .data(data.props.arrows, d => d.id)

    dom.arrows.enter().append('line').call(enter).call(update);
    dom.arrows.call(update);
    dom.arrows.exit().remove();
}


const mapStateToProps = (state, ownProps) => {
    return {
        chartDimensions: selectors.chartDimensions(state),
        arrows: selectors.arrows(state),
        animations: state.Graph.animations,
    };
}
  
const mapDispatchToProps = (dispatch) => {
    return {

    }
}
  

export default connect(mapStateToProps, mapDispatchToProps)(Arrow);