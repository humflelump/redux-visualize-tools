import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  graph: [],
};


export default function todos(state = initialState, action) {
  switch (action.type) {
    case 'SET_GRAPH':
      return {...state, graph: action.graph };
    default:
      return state;
  }
}
