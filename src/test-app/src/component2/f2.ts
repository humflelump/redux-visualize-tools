import { graph } from "redux-visualize-tools";

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

export default j;
