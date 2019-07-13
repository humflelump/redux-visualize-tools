import React from 'react';
import * as d3 from 'd3';
import * as visConstants from './constants';
import * as actions from './actions';
import * as constants from './constants';
import { connect } from 'react-redux'


function getStyles(rect, highlight, selected, animated) {
    const BORDER = '1px solid rgba(0,0,0,0.2)'
    const t = constants.TRANSITION_MS / 1000;
    return {
        container: {
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            //position: 'absolute',
            backgroundColor: selected ? 'rgba(180,180,180,1)' : (highlight ? 'rgba(220,220,220,1)' : 'white'),
            border: BORDER,
            transition: animated ? `all linear ${t}s` : `background-color linear ${t}s`,
            transitionTimingFunction: 'linear',
            borderRadius: 5 * rect.scale,
            //overflow: 'hidden',
        },
        header: {
            //position: 'absolute',
            //top: 0,
            //left: 0,
            width: rect.width,
            //height: '20%',
            borderBottom: BORDER,
            //whiteSpace: 'nowrap',
            //overflow: 'hidden',
            //textOverflow: 'ellipsis',
            backgroundColor: visConstants.getColorForType(rect.node.data.type),
        },
        headerText: {
            //fontFamily: '"Roboto", sans-serif',
            fontSize: 15 * rect.scale,
            //color: 'black',
            //textAlign: 'center',
            //marginTop: '1%',
        },
        body: {
            //position: 'absolute',
            //top: '20%',
            //left: 0,
            //right: 0,
            //bottom: 0,
            fontSize: 9 * rect.scale,
            paddingLeft: 5 * rect.scale,
            paddingTop: -5 * rect.scale,
        },
    };
}

function getTypeText(rect) {
    return rect.data.type;
    
}

const Node = (props) => {
    const {rect, highlight, selected} = props;
    const styles = getStyles(rect, highlight, selected, props.animations);
    return (<div 
        className="node-container"
        style={styles.container} 
        onMouseEnter={() => props.setHovered(rect.node)}
        onMouseLeave={() => props.setHovered(null)}
        onClick={() => props.setClicked(rect.node.id)}
    >
        <div className="node-header" style={styles.header}>
            <div className="node-header-text" style={styles.headerText}>{rect.node.data.name}</div>
        </div>
        <div className="node-body" style={styles.body}>
        {
            rect.scale < 0.5 
                ? null
                : <pre>
                {(rect.node.data.description ? rect.node.data.description + '\n' : '')}
                {(rect.node.data.stringifiedResult || '').slice(0, 150)}
            </pre>
        }
        </div>
    </div>)
}

const mapDispatch = (dispatch) => {
    return {
        setHovered: (id) => {
            dispatch({
                type: 'SET_HOVERED_NODE',
                node: id,
            });
        },
        setClicked: (node) => {
            dispatch({
                type: 'SET_SELECTED_NODE',
                node,
            });
            actions.centerScalesAroundNode(node)
        },
    }
}

const mapState = (state) => {
    return {
        animations: state.Graph.animations,
    }
}

export default connect(mapState, mapDispatch)(Node);
