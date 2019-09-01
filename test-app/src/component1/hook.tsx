import React from "react";
import { useSelector } from "react-redux";
import { isLong } from "./selectors";
import { graph } from "../graph";

export const Hook = graph.add(
  () => {
    console.log("hook called");
    const bool = graph.enhanceUseSelector(useSelector)(isLong);
    console.log("hook called2");
    return <div id="yoyoyoy">{bool ? "TRUE" : "False"}</div>;
  },
  { name: "Hook" }
);

console.log("Hook", Hook);
