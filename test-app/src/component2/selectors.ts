import { State } from "../store";
import { createSelector } from "reselect";
import { graph } from "redux-visualize-tools";
import blah from "./f1";
import blah2 from "./f2";
import blah3 from "./f3";
import blah4 from "./f4";
import blah5 from "./f5";

const a = graph.add(() => {});
const b = graph.add(() => {});
const c = graph.add(() => {});
const d = graph.add(() => {
  a();
  b();
  c();
});

const e = graph.add(() => {});
const f = graph.add(() => {});
const g = graph.add(() => {});
const h = graph.add(() => {});
const i = graph.add(() => {});
const j = graph.add(() => {
  e();
  f();
  g();
  h();
  i();
  d();
});

const test_ = (state: State) => state.Component2.text;

const wow = graph.add(function grr() {
  console.log("this is my func");
  j();
  f();
  blah();
  blah2();
  blah3();
  blah4();
});

export const test = graph.add(createSelector)([test_], function wowtest(t) {
  wow();
  console.log("ugh called", t);
  return t;
});
