import { State } from "../store";
import { createSelector } from "reselect";
import { graph } from "../graph";

const a = graph.add(() => { });
const b = graph.add(() => { });
const c = graph.add(() => { });
const d = graph.add(() => {
  a();
  b();
  c();
});

const e = graph.add(() => { });
const f = graph.add(() => { });
const g = graph.add(() => { });
const h = graph.add(() => { });
const i = graph.add(() => { });
const j = graph.add(() => {
  e();
  f();
  g();
  h();
  i();
  d();
});

const text = (state: State) => state.Component1.text;
const wow = (state: State) => state.Component1.immutableYay.get("wow");



export const appendedText = graph.add(createSelector)([text, wow], t => {
  for (let i = 0; i < 1000; i++) { }
  j();
  return t + "_wow";
});

export const isLong = graph.add(createSelector, {
  name: "wow",
  file: __filename
})([appendedText], t => t.length > 10);

console.log("wowoowow", graph);
