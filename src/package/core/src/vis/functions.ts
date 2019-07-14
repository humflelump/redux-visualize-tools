import * as constants from './constants';

export function getFunctionName(func: Function, defaultName?: string) {
    if (typeof defaultName === 'string') return defaultName;
    if (func && func.name && func.name !== '') return func.name;
    return 'Anonymous Function';
}

export function getNameFromComponent(comp: any, defaultName?: string) {
    if (typeof defaultName === 'string') return defaultName;
    if (comp && comp.constructor && comp.constructor.name !== 'Function') return comp.constructor.name;
    if (comp && comp.name !== '') return comp.name;
    return 'Anonymous Component';
}

export function makeId(name: string) {
    (makeId as any)[name] = ((makeId as any)[name] || 0) + 1;
    return `${name}_${(makeId as any)[name].toString()}`;
}

export function currentTime() {
    return Date.now();
}

function isClassComponent(component: any) {
    return (
        typeof component === 'function' && 
        !!component.prototype.isReactComponent
    ) ? true : false
}

function isFunctionComponent(component: any) {

    return (
        typeof component === 'function' && 
        String(component).includes('createElement')
    ) ? true : false;
}

function isReactComponent(component: any) {
    return (
        isClassComponent(component) || 
        isFunctionComponent(component)
    ) ? true : false;
}

export function getType(f: any) {
    try {
        if (f().name === 'wrapWithConnect') {
            return constants.NODE_TYPES.CONNECT;
        }
    } catch (e) {}

    try {
        if ('resultFunc' in f()) {
            return constants.NODE_TYPES.RESELECT_SELECTOR;
        }
    } catch (e) {}

    try {
        const sel = f({async: () => null, sync: () => null});

        if ('forceUpdate' in sel) {
            return constants.NODE_TYPES.ASYNC_SELECTOR;
        }
    } catch (e) {}

    if (isReactComponent(f)) {
        return constants.NODE_TYPES.REACT_COMPONENT;
    }

    if (typeof f === 'function') {
        return constants.NODE_TYPES.FUNCTION;
    }

    return 'UNKNOWN';
}