import { AnyAction } from "redux";
import Immutable from "immutable";

const make = () => {
  const o = {};
  for (let i = 0; i < 10; i++) {
    o[String(Math.random())] = Math.random();
  }
  return o;
};

const L = [];
for (let i = 0; i < 100; i++) {
  L.push(make());
}

// setTimeout(() => {
//   console.log("test");
//   (window as any).store.dispatch(() => {
//     console.log("werwerwerwrwerwer");
//     console.log("6456456456456");
//   });
// }, 1000);

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
  L: any;
  f: any;
}

const initialState: Component2State = {
  text: "Component2String",
  L: L,
  f: () => {
    console.log("werwerwerwrwerwer");
    console.log("6456456456456");
  }
};

export function Component2Reducer(
  state: Component2State = initialState,
  action: AnyAction
): Component2State {
  if (action.type === "test") {
    return {
      ...state,
      L: L.map((d, i) => (i === 100 ? d : i))
    };
  }

  return state;
}
