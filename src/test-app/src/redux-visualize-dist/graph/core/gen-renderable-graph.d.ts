import { Node } from './selectors';
export interface UINode {
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    data: Node;
}
export declare function createUiNodes(nodes: Node[]): UINode[];
