import { combineReducers } from 'redux';
import Graph from '../graph/reducers';
import Window from '../window/reducers';
import Search from '../search/reducers';
import ContextMenu from '../context-menu/reducers';
import Settings from '../settings/reducers';
import ActionsList from '../actions-list/reducers';

export default combineReducers({
  Graph,
  Window,
  Search,
  ContextMenu,
  Settings,
  ActionsList,
});
