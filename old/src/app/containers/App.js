import React from 'react';
import { connect } from 'react-redux';
import Graph from '../graph/container';
import Settings from '../settings/container';
import ContextMenu from '../context-menu/container';
import FilterPopup from '../context-menu/filter-popup';

class App extends React.Component {

  render() {
    return (
      <div>
        <Graph />
        <Settings />
        <ContextMenu />
        <FilterPopup />
      </div>
    );
  }
}

const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {};
}

export default connect(mapState, mapDispatch)(App);