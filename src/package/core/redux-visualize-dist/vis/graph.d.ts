import { NODE_TYPES } from "./constants";
import { StoreCreator } from 'redux';
export interface NodeMetadata {
    description?: string;
    file?: string;
}
export interface Action {
    userAction: any;
    actionNumber: number;
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
    constructor(id: string, name: string, type: NODE_TYPES, metadata?: NodeMetadata);
    setActionThatCausedCall(action: Action): void;
    setDuration(duration: number): void;
    setValue(value: any): void;
    addDependency(node: Node): void;
    removeDependency(id: string): void;
}
export declare class Graph {
    private stack;
    private nodes;
    private lastAction;
    private store?;
    private stateInjectorCache;
    private getterCache;
    constructor();
    setCurrentAction(action: any): void;
    private addNode;
    getNodeById(id: string): Node | undefined;
    private watch;
    injectObject(d: any, history: string[], cache: Map<any, any>): any;
    injectImmutable(d: any, history: string[], cache: Map<any, any>): any;
    private injectState;
    enhance<T extends Function>(createStore: StoreCreator): T;
    add<T extends Function>(f: T, metadata?: UserNodeMetadata): T;
    private addConnect;
    private addFunction;
    private addReselectSelector;
}