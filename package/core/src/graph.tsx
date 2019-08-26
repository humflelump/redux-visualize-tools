import { NODE_TYPES } from "./constants";
import {
  getFunctionName,
  makeId,
  currentTime,
  getType,
  isObject,
  isImmutableMap,
  getStateVariableName,
  getNameFromComponent,
  shallowEqual
} from "./functions";
import Immutable from "immutable";
import React from "react";
import { Store, StoreCreator, AnyAction } from "redux";
import PropTypes from "prop-types";

const ctxKey = "__VIS_PARENT_ID__";

const emptyAction = {
  action: null,
  prevState: undefined,
  nextState: undefined,
  actionNumber: -1,
  startTime: -1,
  endTime: -1
};

export interface NodeMetadata {
  description?: string;
  file?: string;
}

export interface Action {
  action: any;
  prevState: any;
  nextState: any;
  actionNumber: number;
  startTime: number;
  endTime: number;
}

export type UserNodeMetadata = {
  name?: string;
} & NodeMetadata;

export class Node {
  id: string;
  metadata: NodeMetadata;
  dependencies: Node[];
  value: any;
  duration?: number;
  type: NODE_TYPES;
  name: string;
  action?: Action;
  function?: Function;
  componentInfo: {
    component?: Function,
    props?: object,
  }

  constructor(
    id: string,
    name: string,
    type: NODE_TYPES,
    metadata: NodeMetadata = {}
  ) {
    this.id = id;
    this.metadata = metadata;
    this.type = type;
    this.name = name;

    this.dependencies = [];
    this.value = undefined;
    this.duration = undefined;
    this.action = undefined;
    this.function = undefined;
    this.componentInfo = {};
  }

  setReactComponent(component?: Function, props?: object) {
    this.componentInfo.component = component;
    this.componentInfo.props = props;
  }

  setActionThatCausedCall(action: Action) {
    this.action = action;
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  setValue(value: any) {
    this.value = value;
  }

  setFunction(f: Function) {
    this.function = f;
  }

  addDependency(node: Node) {
    if (!this.dependencies.find(d => d.id === node.id)) {
      this.dependencies.push(node);
    }
  }

  removeDependency(id: string) {
    this.dependencies = this.dependencies.filter(d => d.id !== id);
  }
}

export class Graph {
  private stack: Node[];
  private nodes: { [id: string]: Node };
  private lastAction: Action;
  private actions: Action[];
  private store?: Store;
  private appData: {
    ReactDOM?: any,
    Provider?: any,
  }

  // caches
  private stateInjectorCache: Map<any, any>;
  private getterCache: string[] = [];

  constructor() {
    this.stack = [];
    this.nodes = {};
    this.lastAction = emptyAction;
    this.stateInjectorCache = new Map();
    this.actions = [];
    this.appData = {};
  }

  private addNode(node: Node) {
    this.nodes[node.id] = node;
  }

  public enableViewingComponentsInDevTools(ReactDOM: any, Provider: any) {
    this.appData.ReactDOM = ReactDOM;
    this.appData.Provider = Provider;
  }

  public getNodeById(id: string): Node | undefined {
    return this.nodes[id];
  }

  private watch(
    f: Function,
    name: string,
    type: NODE_TYPES,
    metadata: NodeMetadata
  ) {
    const stack = this.stack;
    const id = makeId(name);
    const newNode = new Node(id, name, type, metadata);
    this.addNode(newNode);
    const func = (...d: any[]) => {
      stack.push(newNode);
      const result = f(...d);
      newNode.setValue(result);
      const currNode = stack.pop();
      if (!currNode) {
        throw new Error("Empty stack was popped");
      }
      if (stack.length > 0) {
        stack[stack.length - 1].addDependency(currNode);
      }
      return result;
    };
    return { func, newNode };
  }

  injectObject(d: any, history: string[], cache: Map<any, any>, depth = 0) {
    if (cache.has(d)) {
      return cache.get(d);
    }
    if (depth > 6) {
      return d;
    }
    const newObj = {};
    const keys = Object.keys(d);
    for (const key of keys) {
      const newKeys = [...history, key];
      const nodeId = getStateVariableName(newKeys);
      let node = this.getNodeById(nodeId);
      if (!node) {
        const type = NODE_TYPES.STATE_VARIABLE;
        node = new Node(nodeId, nodeId, type);
        node.setValue(d[key]);
        this.addNode(node);
      }

      let child: any;
      if (isObject(d[key])) {
        child = this.injectObject(d[key], newKeys, cache, depth + 1);
      } else if (isImmutableMap(d[key])) {
        child = this.injectImmutable(d[key], newKeys, cache, depth + 1);
      } else {
        child = d[key];
      }

      const self = this;
      Object.defineProperty(newObj, key, {
        get: () => {
          const newHistory = [...history, key];
          // only mark the root it accesses as a dependency
          if (this.getterCache.length === history.length) {
            if (self.stack.length > 0) {
              const id = getStateVariableName(history);
              self.stack[self.stack.length - 1].removeDependency(id);
            }
          }
          this.getterCache = newHistory;
          const nodeId = getStateVariableName(newKeys);
          const node = self.getNodeById(nodeId);
          if (!node) return child;
          if (self.stack.length > 0) {
            self.stack[self.stack.length - 1].addDependency(node);
          }
          if (node.value !== d[key]) {
            node.setValue(d[key]);
            node.setActionThatCausedCall(self.lastAction);
          }
          return child;
        },
        enumerable: true
      });
    }
    cache.set(d, newObj);
    return newObj;
  }

  injectImmutable(d: any, history: string[], cache: Map<any, any>, depth = 0) {
    if (cache.has(d)) {
      return cache.get(d);
    }
    if (depth > 6) {
      return d;
    }
    let newObj = Immutable.fromJS({});
    for (const key of d.keySeq().toJS()) {
      const newKeys = [...history, key];
      const nodeId = getStateVariableName(newKeys);
      let node = this.getNodeById(nodeId);
      if (!node) {
        const type = NODE_TYPES.STATE_VARIABLE;
        node = new Node(nodeId, nodeId, type);
        this.addNode(node);
      }
      node.setValue(d.get(key));

      let child: any;
      const got = d.get(key);
      if (isObject(got)) {
        child = this.injectObject(got, newKeys, cache, depth + 1);
      } else if (isImmutableMap(got)) {
        child = this.injectImmutable(got, newKeys, cache, depth + 1);
      } else {
        child = got;
      }
      newObj = newObj.set(key, child);
    }

    const get = newObj.__proto__.get.bind(newObj);
    const getIn = newObj.__proto__.getIn.bind(newObj);

    newObj.get = (key: string) => {
      const newKeys = [...history, key];
      if (this.getterCache.length === history.length) {
        if (this.stack.length > 0) {
          const id = getStateVariableName(history);
          this.stack[this.stack.length - 1].removeDependency(id);
        }
      }
      this.getterCache = newKeys;
      const nodeId = getStateVariableName(newKeys);
      const node = this.getNodeById(nodeId);
      const result = get(key);
      if (!node) {
        return result;
      }
      if (this.stack.length > 0) {
        this.stack[this.stack.length - 1].addDependency(node);
      }
      if (node.value !== result) {
        node.setValue(result);
        node.setActionThatCausedCall(this.lastAction);
      }
      return result;
    };

    newObj.getIn = (arr: string[]) => {
      let result = newObj;
      for (const key of arr) {
        result = result.get(key);
      }
      return result;
    };
    cache.set(d, newObj);
    return newObj;
  }

  private injectState<T extends any>(state: T): T {
    const history: string[] = [];
    const cache = this.stateInjectorCache;
    if (cache.has(state)) {
      return cache.get(state);
    }
    let result;
    if (isImmutableMap(state)) {
      result = this.injectImmutable(state, history, cache);
    } else if (isObject(state)) {
      result = (this.injectObject(state, history, cache) as any) as T;
    } else {
      result = state;
    }
    cache.set(state, result);
    cache.set(result, result); // the second cache is a trick so that selector calls will hit this cache.
    return result;
  }

  // Main function that enhances create store
  public enhance<T extends Function>(createStore: StoreCreator): T {
    const result = (reducer: Function, ...params: any[]) => {
      const newReducer = (state: any, action: AnyAction) => {
        if (action.type === "DEV_TOOLS_SET_STATE") {
          return action.state;
        }
        return reducer(state, action);
      };
      const store = (createStore as Function)(newReducer, ...params);
      this.store = store;
      const dispatch = (action: AnyAction) => {
        const prev = store.getState();
        const startTime = currentTime();

        // This object was created before "const result = store.dispatch(action);"
        // was called so all the functions that are triggered after the dispatch
        // have a reference to this object. More data is added later
        this.lastAction = {
          action,
          prevState: prev,
          nextState: null,
          actionNumber: this.lastAction.actionNumber + 1,
          startTime,
          endTime: -1
        };
        const result = store.dispatch(action);
        const endTime = currentTime();
        const next = store.getState();

        this.lastAction.nextState = next;
        this.lastAction.endTime = endTime;
        this.actions.push(this.lastAction);
        return result;
      };
      return {
        ...store,
        dispatch
      };
    };
    return (result as any) as T;
  }

  public add<T extends Function>(f: T, metadata: UserNodeMetadata = {}) {
    const type = getType(f);
    if (type === "UNKNOWN") {
      throw new Error("Function is not a known type");
    }
    switch (type) {
      case NODE_TYPES.FUNCTION:
        return this.addFunction(f, metadata);
      case NODE_TYPES.RESELECT_SELECTOR:
        return this.addReselectSelector(f, metadata);
      case NODE_TYPES.CONNECT:
        return this.addConnect(f, metadata);
      case NODE_TYPES.REACT_COMPONENT:
        return this.addReactComponent(f, metadata);
      default:
        return f;
    }
  }

  private addConnect<T extends Function>(
    f: T,
    metadata: UserNodeMetadata = {}
  ): T {
    let prevResult: any = null;
    const result = (
      mapState_?: Function,
      mapDispatch?: Function,
      ...params: any[]
    ) => (DumbComponent: new () => React.Component<any, any>) => {

      const name = getNameFromComponent(DumbComponent, metadata.name);
      const id = makeId(name);
      const type = NODE_TYPES.CONNECT;
      const node = new Node(id, name, type, metadata);
      this.addNode(node);
      const self = this;

      const mapState = mapState_ || (() => ({}));
      node.setFunction(mapState);
      const newMapState = (state: any, ...params: any[]) => {
        this.stack.push(node);
        const now = currentTime();
        // Turn the store into a listener if it isn't already
        const injectedState = this.injectState(state);
        const result = mapState(injectedState, ...params);
        if (!shallowEqual(prevResult, result)) {
          node.setActionThatCausedCall(this.lastAction);
          node.setDuration(currentTime() - now);
          node.setValue(result);
          prevResult = result;
        }
        this.stack.pop();
        return result;
      };

      class Parent extends React.Component {

        getChildContext() {
          return { [ctxKey]: id };
        }

        render() {
          if (this.context[ctxKey]) {
            const parentNode = self.getNodeById(this.context[ctxKey]) as Node;
            parentNode.addDependency(node);
          }
          node.setReactComponent(DumbComponent as Function, this.props);
          return <DumbComponent {...this.props} />;
        }
      }

      (Parent as any).childContextTypes = {
        [ctxKey]: PropTypes.string
      };
      (Parent as any).contextTypes = {
        [ctxKey]: PropTypes.string
      };
      return f(newMapState, mapDispatch, ...params)(Parent);
    };
    return (result as any) as T;
  }

  private addReactComponent<T extends Function>(f: T, metadata: UserNodeMetadata = {}): T {
    const name = getFunctionName(f, metadata.name);
    const type = NODE_TYPES.REACT_COMPONENT;
    const id = makeId(name);
    const node = new Node(id, name, type, metadata);
    this.addNode(node);
    const DumbComponent = f as any as new () => React.Component<any, any>;
    const self = this;

    class Parent extends React.Component {
      getChildContext() {
        return { [ctxKey]: id };
      }

      render() {
        if (this.context[ctxKey]) {
          const parentNode = self.getNodeById(this.context[ctxKey]) as Node;
          parentNode.addDependency(node);
        }
        node.setReactComponent(f as Function, this.props);
        return <DumbComponent {...this.props} />;
      }
    }

    (Parent as any).childContextTypes = {
      [ctxKey]: PropTypes.string
    };
    (Parent as any).contextTypes = {
      [ctxKey]: PropTypes.string
    };

    return Parent as any as T;
  }

  private addFunction<T extends Function>(
    f: T,
    metadata: UserNodeMetadata = {}
  ): T {
    const name = getFunctionName(f, metadata.name);
    const type = NODE_TYPES.FUNCTION;
    const { func, newNode } = this.watch(f, name, type, metadata);
    newNode.setFunction(f);
    const returnFunc = (...params: any[]) => {
      const t = currentTime();
      const result = func(...params);
      newNode.setDuration(currentTime() - t);
      newNode.setActionThatCausedCall(this.lastAction);
      return result;
    };
    return (returnFunc as any) as T;
  }

  private addReselectSelector<T extends Function>(
    f: T,
    metadata: UserNodeMetadata = {}
  ): T {
    const type = NODE_TYPES.RESELECT_SELECTOR;
    let node: Node;
    const newFunction = (...funcs: any[]) => {
      const mainFunction = funcs.pop();
      const name = getFunctionName(mainFunction, metadata.name);
      if (typeof mainFunction !== "function") {
        throw new Error(
          "Last argument of a reselect selector must be a function"
        );
      }
      const newMainFunc = (...params: any[]) => {
        const t = currentTime();
        const result = mainFunction(...params);
        if (!node) {
          throw new Error("Node unexpectedly undefined");
        }
        node.setDuration(currentTime() - t);
        node.setActionThatCausedCall(this.lastAction);
        return result;
      };
      funcs.push(newMainFunc);
      const selector = f(...funcs);
      const newSelector = (state: any, ...params: any[]) => {
        // Turn the store into a listener if it isn't already
        const injected = this.injectState(state);
        return selector(injected, ...params);
      };
      const { func, newNode } = this.watch(newSelector, name, type, metadata);
      node = newNode;
      node.setFunction(mainFunction);
      return func;
    };
    return (newFunction as any) as T;
  }
}

export const graph = new Graph();
