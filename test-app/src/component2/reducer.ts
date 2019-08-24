import { AnyAction } from "redux";
import Immutable from "immutable";

const make = () => {
  const o = {};
  for (let i = 0; i < 10; i++) {
    o[String(Math.random())] = Math.random();
  }
  return o;
};

const make2 = () => {
  const L = [];
  for (let i = 0; i < 10000; i++) {
    L.push(make());
  }
  return L;
};

setTimeout(() => {
  console.log("test");
  (window as any).store.dispatch({
    type: "test"
  });
}, 1000);

const rec = { rec: null, wow: "string" };
rec.rec = rec;

setTimeout(() => {
  (window as any).store.dispatch({
    type: "blah",
    rec
  });
}, 1000);

export interface Component2State {
  text: string;
  f: any;
  d: any;
}

const initialState: Component2State = {
  text: "Component2String",
  f: () => {
    console.log("werwerwerwrwerwer");
    console.log("6456456456456");
  },
  d: make2()
};

export function Component2Reducer(
  state: Component2State = initialState,
  action: AnyAction
): Component2State {
  if (action.type === "test") {
    return {
      ...state,
      d: make2()
    };
  }

  return state;
}
