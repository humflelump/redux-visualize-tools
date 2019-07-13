

const cache = {};
function modifyNode(node) {
  if (node.useCache === true) {
    if (!cache[node.id]) {
      throw node.id + ' is not in cache';
    }
    return cache[node.id];
  }
  node.stringifiedResult = JSON.stringify(node.value, null, 2);
  cache[node.id] = node;
  return node;
}


window.onload = function() {
  chrome.tabs.query({active: true, currentWindow: false}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {type: 'GRAPH_REQUESTED_INITIAL'});
 });
}

window.log = function(id) {
  chrome.tabs.query({}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {type: 'CONSOLE_LOG', id: id});
 });
}

window.timeTravel = function(index, updateState) {
  chrome.tabs.query({}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      type: 'TIME_TRAVEL', 
      index: index,
      updateState: updateState,
    });
  });
} 

function renderGraph(graph) {
  window.store.dispatch({
    type: 'SET_GRAPH',
    graph: graph.graph.map(modifyNode),
    id: graph.dispatchId,
  });
}

function addAction(action) {
  window.store.dispatch({
    type: 'ADD_ACTION',
    action: action,
  });
}

let nodes = [];
let dispatchId = -1;
chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message && message.type === 'STARTED_SENDING') {
      nodes = [];
      dispatchId = message.dispatchId;
    }
    else if (message && message.type === 'NODE_SENT') {
      nodes.push(message.node);
    }
    else if (message && message.type === 'FINISHED_SENDING') {
      renderGraph({
        graph: nodes,
        dispatchId: dispatchId,
      });
    } else if (message && message.type === 'ACTION_SENT') {
      addAction(message.action);
      window.moveToLatestActionIfNeccessary && window.moveToLatestActionIfNeccessary();
    }
    else if (message && message.type === 'STATE_SENT') {
      window.store.dispatch({
        type: 'SET_SELECTED_STATE',
        state: message.state,
        index: message.actionIndex,
      });
    }
    else if (message && message.type === 'RESET_ACTIONS') {
      window.store.dispatch({
        type: 'RESET_ACTIONS',
      });
    }
  }
);
