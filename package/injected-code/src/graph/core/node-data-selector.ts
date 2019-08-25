import { createSelector } from "reselect";
import { IState } from "../../store";
import { INode } from "../types";

const graphData = (state: IState) => state.CommChannel.graph;

export const nodeData = createSelector(
    [graphData],
    (data: any) => {
        if (!data) {
            return [] as INode[];
        }
        const ids = Object.keys(data.nodes);
        return ids.map(id => data.nodes[id] as INode);
    }
);