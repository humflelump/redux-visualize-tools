import { createSelector } from 'reselect';
import { uiNodes, xTo, yTo, xFrom, yFrom } from './selectors';
import { dimensions } from './dimensions-selectors';
import { getZoomedOutScales } from './functions';
import { isEqual } from 'lodash';
import { IState } from '../../store';
import { IUINode } from '../types';
import { ScaleLinear } from 'd3';

export const zoomedOutScales = createSelector(
  [uiNodes, dimensions],
  (nodes, dimensions) => {
    return getZoomedOutScales(nodes, dimensions);
  }
);

export const isZoomedOut = createSelector(
  [zoomedOutScales, xTo, yTo, xFrom, yFrom],
  (zoomedOutScales, xTo, yTo, xFrom, yFrom) => {
    const zoomed = {
      xTo: zoomedOutScales.x.range(),
      xFrom: zoomedOutScales.x.domain(),
      yTo: zoomedOutScales.y.range(),
      yFrom: zoomedOutScales.y.domain(),
    };
    const current = { xTo, yTo, xFrom, yFrom };
    return isEqual(zoomed, current);
  }
);
