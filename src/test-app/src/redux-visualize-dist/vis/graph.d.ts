import { NODE_TYPES } from "./constants";
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
}
export declare class Graph {
    private stack;
    private nodes;
    private lastAction;
    constructor();
    setCurrentAction(action: any): void;
    private addNode;
    private watch;
    add<T extends Function>(f: T, metadata?: UserNodeMetadata): T;
    private addFunction;
    private addReselectSelector;
}
