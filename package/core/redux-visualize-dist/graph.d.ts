import { NODE_TYPES } from "./constants";
import { StoreCreator } from "redux";
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
export declare type UserNodeMetadata = {
    name?: string;
} & NodeMetadata;
export declare class Node {
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
        component?: Function;
        props?: object;
    };
    constructor(id: string, name: string, type: NODE_TYPES, metadata?: NodeMetadata);
    setReactComponent(component?: Function, props?: object): void;
    setActionThatCausedCall(action: Action): void;
    setDuration(duration: number): void;
    setValue(value: any): void;
    setFunction(f: Function): void;
    addDependency(node: Node): void;
    removeDependency(id: string): void;
}
export declare class Graph {
    private stack;
    private nodes;
    private lastAction;
    private actions;
    private store?;
    private appData;
    private stateInjectorCache;
    private getterCache;
    constructor();
    private addNode;
    enableViewingComponentsInDevTools(ReactDOM: any, Provider: any): void;
    getNodeById(id: string): Node | undefined;
    private watch;
    injectObject(d: any, history: string[], cache: Map<any, any>, depth?: number): any;
    injectImmutable(d: any, history: string[], cache: Map<any, any>, depth?: number): any;
    private injectState;
    enhanceUseSelector<T extends Function>(useSelector: Function): T;
    enhance<T extends Function>(createStore: StoreCreator): T;
    add<T extends Function>(f: T, metadata?: UserNodeMetadata): T;
    private addConnect;
    private addFunctionComponent;
    private addClassComponent;
    private addFunction;
    private addAsyncSelector;
    private addReselectSelector;
}
export declare const graph: Graph;
