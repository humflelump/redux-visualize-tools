import { NODE_TYPES } from "./constants";
import { getFunctionName, makeId, currentTime, getType } from "./functions";

export interface NodeMetadata {
    description?: string,
    file?: string,
}

export interface Action {
    userAction: any,
    actionNumber: number,
};

export type UserNodeMetadata = {
    name?: string,
} & NodeMetadata

export class Node {
    id: string;
    metadata: NodeMetadata;
    dependencies: Node[];
    value: any;
    duration?: number;
    type: NODE_TYPES;
    name: string;
    action?: Action;

    constructor(id: string, name: string, type: NODE_TYPES, metadata: NodeMetadata = {}) {
        this.id = id;
        this.metadata = metadata;
        this.type = type;
        this.name = name;

        this.dependencies = [];
        this.value = undefined;
        this.duration = undefined;
        this.action = undefined;
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

    addDependency(node: Node) {
        if (!this.dependencies.find(d => d.id === node.id)) {
            this.dependencies.push(node);
        }
    }
} 



export class Graph {
    private stack: Node[];
    private nodes: { [id: string]: Node };
    private lastAction: Action;
    constructor() {
        this.stack = [];
        this.nodes = {};
        this.lastAction = {
            userAction: null,
            actionNumber: 0,
        };
    }

    public setCurrentAction(action: any) {
        this.lastAction = {
            userAction: action,
            actionNumber: this.lastAction.actionNumber + 1,
        };
    }

    private addNode(node: Node) {
        this.nodes[node.id] = node;
    }

    private watch(f: Function, name: string, type: NODE_TYPES, metadata: NodeMetadata) {
        const stack = this.stack;
        const id = makeId(name);
        const newNode = new Node(id, name, type, metadata);
        this.addNode(newNode);
        const func = (...d: any[]) => {
            stack.push(newNode)
            const result = f(...d);
            newNode.setValue(result);
            newNode.setActionThatCausedCall(this.lastAction);
            const currNode = stack.pop();
            if (!currNode) {
                throw new Error('Empty stack was popped');
            }
            if (stack.length > 0) {
                stack[stack.length - 1].addDependency(currNode);
            }
            return result;
        }
        return { func, newNode };
    }

    public add<T extends Function>(f: T, metadata: UserNodeMetadata = {}) {
        const type = getType(f);
        if (type === 'UNKNOWN') {
            throw new Error('Function is not a know type');
        }
        switch (type) {
            case NODE_TYPES.FUNCTION:
                return this.addFunction(f, metadata);
            case NODE_TYPES.RESELECT_SELECTOR:
                return this.addReselectSelector(f, metadata);
            default:
                return f;
        }
    }

    private addFunction<T extends Function>(f: T, metadata: UserNodeMetadata={}): T {
        const name = getFunctionName(f, metadata.name);
        const type = NODE_TYPES.FUNCTION;
        const { func, newNode } = this.watch(f, name, type, metadata);
        const returnFunc = (...params: any[]) => {
            const t = currentTime();
            const result = func(...params);
            newNode.setDuration(currentTime() - t);
            return result;
        };
        return returnFunc as any as T;
    }

    private addReselectSelector<T extends Function>(f: T, metadata: UserNodeMetadata={}): T {
        const type = NODE_TYPES.RESELECT_SELECTOR;
        let node: Node;
        const newFunction = (...funcs: any[]) => {
            const mainFunction = funcs.pop();
            const name = getFunctionName(mainFunction, metadata.name);
            if (typeof mainFunction !== 'function') {
                throw new Error('Last argument of a reselect selector must be a function');
            }
            
            const newMainFunc = (...params: any[]) => {
                const t = currentTime();
                const result = mainFunction(...params);
                if (!node) {
                    throw new Error('Node unexpectedly undefined');
                }
                node.setDuration(currentTime() - t);
                return result;
            };
            funcs.push(newMainFunc);
            const selector = f(...funcs);
            const { func, newNode } = this.watch(selector, name, type, metadata);
            node = newNode;
            return func;
        }
        return newFunction as any as T;
    }
}

// const g = new Graph();

// function f2_() {
//     return 5;
// }
// const f2 = g.addFunction(f2_, {});

// function f3_() {
//     return 3;
// }
// const f3 = g.addFunction(f3_, {description: 'wowowo', file: "file/fff"});

// function f1_() {
//     f2()
//     f3();
// }
// const f1 = g.addFunction(f1_, {});

// f1();

// console.log(g);


