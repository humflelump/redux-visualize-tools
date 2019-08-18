// The source code of this library contained <Script /> in the source code so the library needed to be forked and fixed to work as an inectino string
import { DiffPatcher } from './dist/jsondiffpatch.umd.js';

const defaultObjectHash = (o, idx) =>
  (o === null && '$$null') ||
  (o && (o.id || o.id === 0) && `$$id:${JSON.stringify(o.id)}`) ||
  (o && (o._id || o._id === 0) && `$$_id:${JSON.stringify(o._id)}`) ||
  '$$index:' + idx;

const defaultPropertyFilter = (name, context) =>
  typeof context.left[name] !== 'function' &&
  typeof context.right[name] !== 'function';

const defaultDiffPatcher = new DiffPatcher({
  arrays: { detectMove: false },
  objectHash: defaultObjectHash,
  propertyFilter: defaultPropertyFilter,
});

function createDiffPatcher(objectHash, propertyFilter) {
  if (!objectHash && !propertyFilter) {
    return defaultDiffPatcher;
  }

  return new DiffPatcher({
    arrays: { detectMove: false },
    objectHash: objectHash || defaultObjectHash,
    propertyFilter: propertyFilter || defaultPropertyFilter,
  });
}

const differ = createDiffPatcher(undefined, undefined);
export function diff(a, b) {
  return differ.diff(a, b);
}
