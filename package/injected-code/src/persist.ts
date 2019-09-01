import { IState } from './store';
import merge from 'merge';

function createSerializableObject(state: IState) {
  const obj = { ...state };
  delete obj.Window;
  delete obj.CommChannel;
  return obj;
}

const KEY = '__DEV_TOOLS_PERSISTED_STATE__';

export function persist(state: IState) {
  const obj = createSerializableObject(state);
  const str = JSON.stringify(obj);
  console.log(str);
  window.localStorage.setItem(KEY, str);
}

export function loadPersistedState(): object {
  const str = window.localStorage.getItem(KEY);
  return str ? JSON.parse(str) : {};
}

export function mergeState(state: IState, toMerge: object) {
  const obj = createSerializableObject(state);
  return {
    ...state,
    ...(merge.recursive(obj, toMerge) as object),
  };
}
