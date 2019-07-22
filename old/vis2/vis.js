import * as functions from './functions';
import * as constants from './constants';
import React from 'react';
import PropTypes from 'prop-types';

const time = () => performance.now();

class Node {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.indexedDependencies = {};
        this.dispatchId = -1;
        this.value = undefined;
        this.description = null;
        this.duration = null;

        this.changed = false;
        this.cached = false;
    }

    addDependency(node) {
        if (!(node.id in this.indexedDependencies)) {
            this.indexedDependencies[node.id] = node;
        }
    }

    setDuration(time) {
        this.duration = time;
    }

    setDescription(str) {
        this.description = str;
    }

    setValue(value) {
        this.value = value;
        this.changed = true;
    }

    setDispatchId(id) {
        this.dispatchId = id;
    }

    serialize() {
        if (!this.changed && this.cached && this.value !== undefined) {
            return {
                id: this.id,
                useCache: true,
            };
        }
        this.changed = false;
        this.cached = true;
        const result = {...this};
        delete result.changed;
        delete result.cached;
        delete result.indexedDependencies;
        result.dependencies = Object.keys(this.indexedDependencies);
        result.value = functions.tryMakeValueSerializable(result.value);

        return result;
    }
}

const ctxKey = '__VIS_PARENT_ID__'

class Graph {
    constructor() {
        this.stack = [];
        this.indexedNodes = {};
        this.store = null;
        this.dispatchId = 0;
        this.ctx = React.createContext(null);
        this.isTurnedOff = false;

        this.states = [];
        this.actions = [];
        this.reducer = null;
        this.initialState = undefined;

        this.resetActionsInChromeExtension();

        window.addEventListener('message', (event) => {
            if (this.isTurnedOff === true) return;
            if (event.data && event.data.type === 'GRAPH_REQUESTED') {
                this.displayGraphInExtension();
            }
        });

        window.addEventListener('message', (event) => {
            if (this.isTurnedOff === true) return;
            if (event.data && event.data.type === 'TIME_TRAVEL') {
                this.timeTravel(event.data.index, event.data.updateState);
            }
        });

        window.addEventListener('message', (event) => {
            if (this.isTurnedOff === true) return;
            if (event.data && event.data.type === 'GRAPH_REQUESTED_INITIAL') {
                this.getAllNodes().forEach((n) => {
                    n.cached = false;
                });
                this.displayGraphInExtension();
                for (const action of this.actions) {
                    this.sendActionToChromeExtension(action);
                }
            }
        });

        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'CONSOLE_LOG') {
                const node = this.indexedNodes[event.data.id];
                if (!node) return console.log('Failed to log node');
                console.log('-----Logged From Extension-----');
                console.log(node.value);
            }
        });
    }

    doNothing() {
        this.isTurnedOff = true;
    }

    getNodeById(id) {
        return this.indexedNodes[id];
    }

    getAllNodes() {
        const ids = Object.keys(this.indexedNodes);
        return ids.map(id => this.indexedNodes[id]);
    }

    displayGraphInExtension() {
        if (this.isTurnedOff === true) return;
        const nodes = this.serializeGraph();
        const firstMessage = {
            type: 'STARTED_SENDING',
            dispatchId: this.dispatchId,
        }
        window.postMessage(firstMessage, '*');

        for (const node of nodes) {
            try {
                const message = {
                    type: 'NODE_SENT',
                    node: node,
                }
                window.postMessage(message, '*');
            } catch (e) {
                const message = {
                    type: 'NODE_SENT',
                    node: {...node, value: '-Failed to Serialize-'},
                }
                window.postMessage(message, '*');
            }
        }

        const finalMessage = {
            type: 'FINISHED_SENDING',
        }
        window.postMessage(finalMessage, '*')
    }

    serializeGraph() {
        const result = Object.keys(this.indexedNodes)
            .map(key => this.indexedNodes[key])
            .map((node) => node.serialize());

        return result;
    }

    addNode(node) {
        this.indexedNodes[node.id] = node;
    }

    makeStateWatchableMemoized(obj, state) {
        if (this.cachedState === obj) return this.cachedWatchableState;
        const result = this.makeStateWatchable(obj, state);
        this.cachedState = obj;
        this.cachedWatchableState = result;
        return result;
    }

    makeStateWatchable(obj, state) {
        return this.makeStateWatchableHelper(obj, state, 0, [])
    }

    makeStateWatchableHelper(obj, state, depth, historyKeys) {
        const newObj = {};
        const keys = Object.keys(obj);
        const stack = this.stack;
        
        for (const key of keys) {
            const newKeys = [...historyKeys, key];
            const name = functions.getStateVariableName(newKeys);
            let node = this.getNodeById(name);
            if (!node) {
                const type = constants.STATE_VARIABLE;
                node = new Node(name, name, type);
                node.id = name;
                this.addNode(node);
            }

            const child = (
                typeof state[key] === 'object' && state[key] !== null && !Array.isArray(state[key])
                 && typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])
            )
                ? this.makeStateWatchableHelper(obj[key], state[key], depth + 1, newKeys)
                : obj[key];

            const getterFunc = () => child;

            Object.defineProperty(newObj, key, {
                get: () => {
                    const result = getterFunc();
                    
                    stack.push(node);
                    const currNode = stack.pop();
                    if (stack.length > 0) {
                        stack[stack.length - 1].addDependency(currNode);
                    }
                    if (node.value !== result) {
                        node.setValue(result);
                        node.setDispatchId(this.dispatchId);
                    }
                    return result;
                },
                enumerable: true,
            });
        }
        return newObj;
    }

    timeTravel(actionIndex, updateState) {
        const state = this.states[actionIndex];
        this.sendStateToChromeExtension(actionIndex);
        if (updateState) {
            this.loadState(state);
        }
    }

    loadState(state) {
        this.store.dispatch({
            type: '__REDUX_VISUALIZE_LOAD_STATE__',
            state: state,
        });
    }

    sendStateToChromeExtension(actionIndex) {
        if (actionIndex >= this.states.length) return;
        if (!this.states[actionIndex]) return;
        const serializable = JSON.parse(JSON.stringify(this.states[actionIndex]));
        const message = {
            type: 'STATE_SENT',
            actionIndex,
            state: serializable,
        }
        try {
            window.postMessage(message, '*');
        } catch (e) {
            console.log(e);
        }
    }
/*
    getState(actionIndex) {
        let state = this.initialState;
        for (let i = 0; i < actionIndex; i++) {
            state = this.reducer(state, this.actions[i]);
        }
        return state;
    }
*/
    enhanceCreateStore(createStore) {
        return (reducer, initialState, enhancer) => {
            this.reducer = reducer;
            this.store = createStore(this.enhanceReducer(reducer), initialState, enhancer);
            return this.store;
        }
    }

    resetActionsInChromeExtension() {
        const message = {
            type: 'RESET_ACTIONS',
        }
        window.postMessage(message, '*');
    }

    sendActionToChromeExtension(action) {
        const message = {
            type: 'ACTION_SENT',
            action: action,
        }
        try {
            window.postMessage(message, '*');
        } catch (e) {
            message.action = {
                type: action.type,
                payload: '-Failed to Serialize-',
            };
            window.postMessage(message, '*');
        }

    }

    enhanceReducer(reducer) {
        return (state, action) => {
            if (action.type === '__REDUX_VISUALIZE_LOAD_STATE__') {
                return action.state;
            }
            this.sendActionToChromeExtension(action);
            this.dispatchId += 1;
            console.log(action);
            this.actions.push(action);
            const nextState = reducer(state, action);
            this.states.push(nextState);
            if (this.initialState === undefined) {
                this.initialState = nextState;
            }
            console.log(nextState);
            return nextState;
        };
    }


    inject(f, name, type, description, ref={}) {
        const stack = this.stack;
        const id = functions.make_id(name);
        const node = new Node(id, name, type);
        node.setDescription(description)
        ref.node = node;
        this.addNode(node);
        return (...d) => {
            stack.push(node)
            const result = f(...d);
            node.setValue(result);
            const currNode = stack.pop();
            if (stack.length > 0) {
                stack[stack.length - 1].addDependency(currNode);
            }
            return result;
        }
    }

    add(f, defaultName=null, description=null) {
        if (this.isTurnedOff === true) return f;
        const type = functions.getType(f);
        if (type === constants.RESELECT_SELECTOR) {
            return (...funcs) => {
                let node = null;
                const mainFunction = funcs.pop();
                const newMainFunction = (...params) => {
                    const now = time();
                    const result = mainFunction(...params);
                    const duration = time() - now;
                    if (node !== null) {
                        node.setDispatchId(this.dispatchId);
                        node.setDuration(duration);
                    }
                    return result;
                }
                funcs.push(newMainFunction);
                const selector = f(...funcs);
                const name = functions.getFunctionName(mainFunction, defaultName);
                const ref = {};
                const newFunc = this.inject(selector, name, type, description, ref);
                node = ref.node;
                return newFunc;
            };
        } else if (type === constants.ASYNC_SELECTOR) {
            return (obj, ...funcs) => {
                let node;
                const mainFunction = obj.async;

                const setDispatchIdAfterCallback = (key) => {
                    if (typeof obj[key] !== 'function') return;
                    const f = obj[key];
                    obj[key] = (...params) => {
                        let curr = this.dispatchId;
                        f(...params);
                        let next = this.dispatchId;
                        if (next > curr)
                            node.setDispatchId(this.dispatchId);
                    };
                }
                setDispatchIdAfterCallback('onResolve');
                setDispatchIdAfterCallback('onReject');

                const newAsync = (...params) => {
                    const promise = mainFunction(...params);

                    return new Promise((resolve, reject) => {
                        const now = time();
                        return promise.then((...d) => {
                            const duration = time() - now;
                            node.setDispatchId(this.dispatchId);
                            node.setDuration(duration);
                            resolve(...d);
                        }).catch((...e) => {
                            const duration = time() - now;
                            node.setDispatchId(this.dispatchId);
                            node.setDuration(duration);
                            reject(...e);
                        });
                    });
                }
                obj.async = newAsync;
                const selector = f(obj, ...funcs);
                const name = functions.getFunctionName(mainFunction, defaultName);
                const ref = {};
                const newFunc = this.inject(selector, name, type, description, ref);
                node = ref.node;
                return newFunc;
            }
        } else if (type === constants.CONNECT) {
            const ctxKey = '__VIS_PARENT_ID__'
            return (mapState_, mapDispatch, ...params) => (Component) => {
                const mapState = mapState_ || (() => ({}));
                const self = this;
                const stack = this.stack;
                const name = functions.getNameFromComponent(Component, defaultName);
                const id = functions.make_id(name);
                const node = new Node(id, name, type);
                node.setDescription(description);
                self.addNode(node);

                class Parent extends React.Component {
                    getChildContext() {
                        return {[ctxKey]: id};
                    }

                    render() {
                        if (self.store) {
                            const state_ = self.store.getState();
                            const state = self.makeStateWatchableMemoized(state_, self.initialState);
                            stack.push(node)
                            const now = time();
                            node.setValue(mapState(state, this.props))
                            node.setDuration(time() - now);
                            node.setDispatchId(self.dispatchId);
                            const currNode = stack.pop();
                            if (stack.length > 0) {
                                stack[stack.length - 1].addDependency(currNode);
                            }
                        } else {
                            console.warn('watchReduxStore method was never called')
                        }

                        if (this.context[ctxKey]) {
                            const parentNode = self.getNodeById(this.context[ctxKey]);
                            parentNode.addDependency(node);
                        }
                        return <Component {...this.props} />
                    }
                }

                Parent.childContextTypes = {
                    [ctxKey]: PropTypes.string
                };
                Parent.contextTypes = {
                    [ctxKey]: PropTypes.string
                };

                return f(mapState_, mapDispatch, ...params)(Parent);
            }
        } else if (type === constants.REACT_COMPONENT) {
            const Component = f;
            const self = this;
            const name = functions.getNameFromComponent(Component, defaultName);
            const id = functions.make_id(name);
            const node = new Node(id, name, type);
            node.setDescription(description);
            self.addNode(node);
            class Parent extends React.Component {
                getChildContext() {
                    return {[ctxKey]: id};
                }

                render() {
                    if (this.context[ctxKey]) {
                        const parentNode = self.getNodeById(this.context[ctxKey]);
                        parentNode.addDependency(node);
                    }
                    return <Component {...this.props} />
                }
            }

            Parent.childContextTypes = {
                [ctxKey]: PropTypes.string
            };
            Parent.contextTypes = {
                [ctxKey]: PropTypes.string
            };

            return Parent;
        } else if (type === constants.FUNCTION) {
            let node;
            const name = functions.getFunctionName(f, defaultName);
            const newFunc = (...params) => {
                const now = time();
                const result = f(...params);
                if (node) {
                    node.setDuration(time() - now);
                    node.setDispatchId(this.dispatchId);
                }
                return result;
            }
            const ref = {};
            const returnFunc = this.inject(newFunc, name, type, description, ref);
            node = ref.node;
            return returnFunc;
        }
    }
}


/*
return (
    <ParentContext.Consumer>
        {
            (parentId) => {
                if (parentId !== null) {
                    const parentNode = self.getNodeById(parentId);
                    parentNode.addDependency(node);
                }
                return <ParentContext.Provider value={node.id}>
                    <Component {...props} />
                </ParentContext.Provider>
            }
        }
    </ParentContext.Consumer>
);*/

const graph = new Graph();
//setInterval(() => console.log(graph), 2000);

export default graph;