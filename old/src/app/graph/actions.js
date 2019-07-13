
import * as graphSelectors from './create-graph-selectors';
import * as functions from './functions';
import * as constants from './constants';
import * as selectors from './selectors';

const state = () => window.store.getState();


export function withAnimation(f) {
    window.store.dispatch({type: 'TOGGLE_ANIMATIONS'});
    f();
    setTimeout(() => {
        window.store.dispatch({type: 'TOGGLE_ANIMATIONS'});
    }, constants.TRANSITION_MS); 
}

export function centerScalesAroundNode(id) {
    const rectangles = selectors.rectangles(state());
    const rect = rectangles.find(rect => rect.node.id === id);
    if (!rect) return;
    const chartDimensions = selectors.chartDimensions(state());
    const xScale = selectors.xScale(state());
    const yScale = selectors.yScale(state());
    const xDomain = [0, chartDimensions.width].map(xScale.invert);
    const yDomain = [0, chartDimensions.height].map(yScale.invert);
    const rectX = rect.x + rect.width / 2;
    const rectY = rect.y + rect.height / 2;
    const xShift = (xDomain[1] + xDomain[0]) / 2 - rectX;
    const yShift = (yDomain[1] + yDomain[0]) / 2 - rectY;
    withAnimation(() => {
        window.store.dispatch({
            type: 'SET_DOMAINS',
            x: xScale.domain().map(x => x - xShift),
            y: yScale.domain().map(y => y - yShift),
        });
    });
}

export function resetZoom() {
    const extent = selectors.extent(state());
    withAnimation(
        () => window.store.dispatch({
            type: 'SET_SCALES',
            x: extent.x,
            y: extent.y,
        })
    );
}