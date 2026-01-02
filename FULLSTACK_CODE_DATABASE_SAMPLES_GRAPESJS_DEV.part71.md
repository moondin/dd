---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 71
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 71 of 97)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - grapesjs-dev
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/grapesjs-dev
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: keymaster.ts]---
Location: grapesjs-dev/packages/core/src/utils/keymaster.ts

```typescript
// @ts-nocheck
// The initial version of this library was borrowed from https://github.com/madrobby/keymaster
// and adapted to the GrapesJS's need

var k,
  _handlers = {},
  _mods = {
    16: false,
    18: false,
    17: false,
    91: false,
  },
  _scope = 'all',
  // modifier keys
  _MODIFIERS = {
    '⇧': 16,
    shift: 16,
    '⌥': 18,
    alt: 18,
    option: 18,
    '⌃': 17,
    ctrl: 17,
    control: 17,
    '⌘': 91,
    command: 91,
  },
  // special keys
  _MAP = {
    backspace: 8,
    tab: 9,
    clear: 12,
    enter: 13,
    return: 13,
    esc: 27,
    escape: 27,
    space: 32,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    del: 46,
    delete: 46,
    home: 36,
    end: 35,
    pageup: 33,
    pagedown: 34,
    ',': 188,
    '.': 190,
    '/': 191,
    '`': 192,
    '-': 189,
    '=': 187,
    ';': 186,
    "'": 222,
    '[': 219,
    ']': 221,
    '\\': 220,
  },
  code = function (x) {
    return _MAP[x] || x.toUpperCase().charCodeAt(0);
  },
  _downKeys = [];

for (k = 1; k < 20; k++) _MAP['f' + k] = 111 + k;

// IE doesn't support Array#indexOf, so have a simple replacement
function index(array, item) {
  var i = array.length;
  while (i--) if (array[i] === item) return i;
  return -1;
}

// for comparing mods before unassignment
function compareArray(a1, a2) {
  if (a1.length != a2.length) return false;
  for (var i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) return false;
  }
  return true;
}

var modifierMap = {
  16: 'shiftKey',
  18: 'altKey',
  17: 'ctrlKey',
  91: 'metaKey',
};

function updateModifierKey(event) {
  for (k in _mods) _mods[k] = event[modifierMap[k]];
}

// handle keydown event
function dispatch(event) {
  var key, handler, k, i, modifiersMatch, scope;
  key = event.keyCode;

  if (index(_downKeys, key) == -1) {
    _downKeys.push(key);
  }

  // if a modifier key, set the key.<modifierkeyname> property to true and return
  if (key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
  if (key in _mods) {
    _mods[key] = true;
    // 'assignKey' from inside this closure is exported to window.key
    for (k in _MODIFIERS) if (_MODIFIERS[k] == key) assignKey[k] = true;
    return;
  }
  updateModifierKey(event);

  // see if we need to ignore the keypress (filter() can can be overridden)
  // by default ignore key presses if a select, textarea, or input is focused
  if (!assignKey.filter.call(this, event)) return;

  // abort if no potentially matching shortcuts found
  if (!(key in _handlers)) return;

  scope = getScope();

  // for each potential shortcut
  for (i = 0; i < _handlers[key].length; i++) {
    handler = _handlers[key][i];

    // see if it's in the current scope
    if (handler.scope == scope || handler.scope == 'all') {
      // check if modifiers match if any
      modifiersMatch = handler.mods.length > 0;
      for (k in _mods)
        if ((!_mods[k] && index(handler.mods, +k) > -1) || (_mods[k] && index(handler.mods, +k) == -1))
          modifiersMatch = false;
      // call the handler and stop the event if neccessary
      if ((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch) {
        if (handler.method(event, handler) === false) {
          if (event.preventDefault) event.preventDefault();
          else event.returnValue = false;
          if (event.stopPropagation) event.stopPropagation();
          if (event.cancelBubble) event.cancelBubble = true;
        }
      }
    }
  }
}

// unset modifier keys on keyup
function clearModifier(event) {
  var key = event.keyCode,
    k,
    i = index(_downKeys, key);

  // remove key from _downKeys
  if (i >= 0) {
    _downKeys.splice(i, 1);
  }

  if (key == 93 || key == 224) key = 91;
  if (key in _mods) {
    _mods[key] = false;
    for (k in _MODIFIERS) if (_MODIFIERS[k] == key) assignKey[k] = false;
  }
}

function resetModifiers() {
  for (k in _mods) _mods[k] = false;
  for (k in _MODIFIERS) assignKey[k] = false;
}

// parse and assign shortcut
function assignKey(key, scope, method) {
  var keys, mods;
  keys = getKeys(key);
  if (method === undefined) {
    method = scope;
    scope = 'all';
  }

  // for each shortcut
  for (var i = 0; i < keys.length; i++) {
    // set modifier keys if any
    mods = [];
    key = keys[i].split('+');
    if (key.length > 1) {
      mods = getMods(key);
      key = [key[key.length - 1]];
    }
    // convert to keycode and...
    key = key[0];
    key = code(key);
    // ...store handler
    if (!(key in _handlers)) _handlers[key] = [];
    _handlers[key].push({
      shortcut: keys[i],
      scope: scope,
      method: method,
      key: keys[i],
      mods: mods,
    });
  }
}

// unbind all handlers for given key in current scope
function unbindKey(key, scope) {
  var multipleKeys,
    keys,
    mods = [],
    i,
    j,
    obj;

  multipleKeys = getKeys(key);

  for (j = 0; j < multipleKeys.length; j++) {
    keys = multipleKeys[j].split('+');

    if (keys.length > 1) {
      mods = getMods(keys);
    }

    key = keys[keys.length - 1];
    key = code(key);

    if (scope === undefined) {
      scope = getScope();
    }
    if (!_handlers[key]) {
      return;
    }
    for (i = 0; i < _handlers[key].length; i++) {
      obj = _handlers[key][i];
      // only clear handlers if correct scope and mods match
      if (obj.scope === scope && compareArray(obj.mods, mods)) {
        _handlers[key][i] = {};
      }
    }
  }
}

// Returns true if the key with code 'keyCode' is currently down
// Converts strings into key codes.
function isPressed(keyCode) {
  if (typeof keyCode == 'string') {
    keyCode = code(keyCode);
  }
  return index(_downKeys, keyCode) != -1;
}

function getPressedKeyCodes() {
  return _downKeys.slice(0);
}

function filter(event) {
  var tagName = (event.target || event.srcElement).tagName;
  // ignore keypressed in any elements that support keyboard data input
  return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
}

// initialize key.<modifier> to false
for (k in _MODIFIERS) assignKey[k] = false;

// set current scope (default 'all')
function setScope(scope) {
  _scope = scope || 'all';
}

function getScope() {
  return _scope || 'all';
}

// delete all handlers for a given scope
function deleteScope(scope) {
  var key, handlers, i;

  for (key in _handlers) {
    handlers = _handlers[key];
    for (i = 0; i < handlers.length; ) {
      if (handlers[i].scope === scope) handlers.splice(i, 1);
      else i++;
    }
  }
}

// abstract key logic for assign and unassign
function getKeys(key) {
  var keys;
  key = key.replace(/\s/g, '');
  keys = key.split(',');
  if (keys[keys.length - 1] == '') {
    keys[keys.length - 2] += ',';
  }
  return keys;
}

// abstract mods logic for assign and unassign
function getMods(key) {
  var mods = key.slice(0, key.length - 1);
  for (var mi = 0; mi < mods.length; mi++) mods[mi] = _MODIFIERS[mods[mi]];
  return mods;
}

// cross-browser events
function addEvent(object, event, method) {
  if (object.addEventListener) object.addEventListener(event, method, false);
  else if (object.attachEvent)
    object.attachEvent('on' + event, function () {
      method(window.event);
    });
}

// set window.key and window.key.set/get/deleteScope, and the default filter
assignKey.setScope = setScope;
assignKey.getScope = getScope;
assignKey.deleteScope = deleteScope;
assignKey.filter = filter;
assignKey.isPressed = isPressed;
assignKey.getPressedKeyCodes = getPressedKeyCodes;
assignKey.unbind = unbindKey;
assignKey.handlers = _handlers;
assignKey.init = (win) => {
  // set the handlers globally on document
  // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
  addEvent(win.document, 'keydown', function (event) {
    dispatch(event);
  });
  addEvent(win.document, 'keyup', clearModifier);
  addEvent(win, 'focus', resetModifiers);
};

export default assignKey;
```

--------------------------------------------------------------------------------

---[FILE: mixins.ts]---
Location: grapesjs-dev/packages/core/src/utils/mixins.ts

```typescript
import { isArray, isElement, isFunction, isUndefined, keys } from 'underscore';
import ComponentView from '../dom_components/view/ComponentView';
import EditorModel from '../editor/model/Editor';
import { isTextNode } from './dom';
import Component from '../dom_components/model/Component';
import { ObjectAny } from '../common';

const obj: ObjectAny = {};

const reEscapeChar = /\\(\\)?/g;
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

export const stringToPath = function (string: string) {
  const result = [];
  if (string.charCodeAt(0) === 46 /* . */) result.push('');
  string.replace(rePropName, (match: string, number, quote, subString) => {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
    return '';
  });
  return result;
};

function castPath(value: string | string[], object: ObjectAny) {
  if (isArray(value)) return value;
  return object.hasOwnProperty(value) ? [value] : stringToPath(value);
}

export const get = (object: ObjectAny, path: string | string[], def?: any) => {
  const paths = castPath(path, object);
  const length = paths.length;
  let index = 0;

  while (object != null && index < length) {
    object = object[`${paths[index++]}`];
  }
  return (index && index == length ? object : undefined) ?? def;
};

export const set = (object: ObjectAny, path: string | string[], value: any): boolean => {
  if (!isObject(object)) return false;
  const paths = castPath(path, object);
  const length = paths.length;

  if (length === 0) return false;

  if (length === 1) {
    object[paths[0]] = value;
    return true;
  }

  const parentPath = paths.slice(0, -1);
  const lastKey = paths[length - 1];
  const parent = get(object, parentPath);

  if (parent) {
    if (Array.isArray(parent)) {
      const index = +lastKey;
      if (!isNaN(index)) {
        parent[index] = value;
        return true;
      }
    } else if (isObject(parent)) {
      (parent as ObjectAny)[lastKey] = value;
      return true;
    }
  }

  return false;
};

export const serialize = (obj: ObjectAny) => JSON.parse(JSON.stringify(obj));

export const isBultInMethod = (key: string) => isFunction(obj[key]);

export const normalizeKey = (key: string) => (isBultInMethod(key) ? `_${key}` : key);

export const wait = (mls: number = 0) => new Promise((res) => setTimeout(res, mls));

export const isDef = (value: any) => typeof value !== 'undefined';

export const hasWin = () => typeof window !== 'undefined';

export const getGlobal = () =>
  typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : global;

export const toLowerCase = (str: string) => (str || '').toLowerCase();

const elProt = hasWin() ? window.Element.prototype : {};
// @ts-ignore
const matches = elProt.matches || elProt.webkitMatchesSelector || elProt.mozMatchesSelector || elProt.msMatchesSelector;

export const getUiClass = (em: EditorModel, defCls: string) => {
  const { stylePrefix, customUI } = em.getConfig();
  return [customUI && `${stylePrefix}cui`, defCls].filter((i) => i).join(' ');
};

/**
 * Import styles asynchronously
 * @param {String|Array<String>} styles
 */
const appendStyles = (styles: {}, opts: { unique?: boolean; prepand?: boolean } = {}) => {
  const stls = isArray(styles) ? [...styles] : [styles];

  if (stls.length) {
    const href = stls.shift();

    if (href && (!opts.unique || !document.querySelector(`link[href="${href}"]`))) {
      const { head } = document;
      const link = document.createElement('link');
      link.href = href;
      link.rel = 'stylesheet';

      if (opts.prepand) {
        head.insertBefore(link, head.firstChild);
      } else {
        head.appendChild(link);
      }
    }

    appendStyles(stls);
  }
};

/**
 * Returns shallow diff between 2 objects
 * @param  {Object} objOrig
 * @param  {Objec} objNew
 * @return {Object}
 * @example
 * var a = {foo: 'bar', baz: 1, faz: 'sop'};
 * var b = {foo: 'bar', baz: 2, bar: ''};
 * shallowDiff(a, b);
 * // -> {baz: 2, faz: null, bar: ''};
 */
const shallowDiff = (objOrig: ObjectAny, objNew: ObjectAny) => {
  const result: ObjectAny = {};
  const keysNew = keys(objNew);

  for (let prop in objOrig) {
    if (objOrig.hasOwnProperty(prop)) {
      const origValue = objOrig[prop];
      const newValue = objNew[prop];

      if (keysNew.indexOf(prop) >= 0) {
        if (origValue !== newValue) {
          result[prop] = newValue;
        }
      } else {
        result[prop] = null;
      }
    }
  }

  for (let prop in objNew) {
    if (objNew.hasOwnProperty(prop)) {
      if (isUndefined(objOrig[prop])) {
        result[prop] = objNew[prop];
      }
    }
  }

  return result;
};

const getUnitFromValue = (value: any) => {
  return value.replace(parseFloat(value), '');
};

const upFirst = (value: string) => value[0].toUpperCase() + value.toLowerCase().slice(1);

const camelCase = (value: string) => {
  return value.replace(/-./g, (x) => x[1].toUpperCase());
};

const normalizeFloat = (value: any, step = 1, valueDef = 0) => {
  let stepDecimals = 0;
  if (isNaN(value)) return valueDef;
  value = parseFloat(value);

  if (Math.floor(value) !== value) {
    const side = step.toString().split('.')[1];
    stepDecimals = side ? side.length : 0;
  }

  return stepDecimals ? parseFloat(value.toFixed(stepDecimals)) : value;
};

const hasDnd = (em: EditorModel) => {
  return 'draggable' in document.createElement('i') && (em ? em.config.nativeDnD! : true);
};

/**
 * Ensure to fetch the element from the input argument
 * @param  {HTMLElement|Component} el Component or HTML element
 * @return {HTMLElement}
 */
const getElement = (el: HTMLElement) => {
  if (isElement(el) || isTextNode(el)) {
    return el;
    // @ts-ignore
  } else if (el && el.getEl) {
    // @ts-ignore
    return el.getEl();
  }
};

export const find = (arr: any[], test: (item: any, i: number, arr: any[]) => boolean) => {
  let result = null;
  arr.some((el, i) => (test(el, i, arr) ? ((result = el), 1) : 0));
  return result;
};

export const escape = (str = '') => {
  return `${str}`
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#96;');
};

export const escapeNodeContent = (str = '') => {
  return `${str}`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

export const escapeAttrValue = (str = '') => {
  return `${str}`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

export const escapeAltQuoteAttrValue = (str = '') => {
  return `${str}`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;');
};

export const deepMerge = (...args: ObjectAny[]) => {
  const target = { ...args[0] };

  for (let i = 1; i < args.length; i++) {
    const source = { ...args[i] };

    for (let key in source) {
      const targValue = target[key];
      const srcValue = source[key];

      if (isObject(targValue) && isObject(srcValue)) {
        target[key] = deepMerge(targValue, srcValue);
      } else {
        target[key] = srcValue;
      }
    }
  }

  return target;
};

/**
 * Ensure to fetch the model from the input argument
 * @param  {HTMLElement|Component} el Component or HTML element
 * @return {Component}
 */
const getModel = (el: HTMLElement & { __cashData?: any }, $?: any): Component | undefined => {
  let model;
  if (!$ && el && el.__cashData) {
    model = el.__cashData.model;
  } else if ($ && isElement(el)) {
    model = $(el).data('model');
  }
  return model;
};

const isObject = (val: any): val is ObjectAny => val && !Array.isArray(val) && typeof val === 'object';
const isEmptyObj = (val: ObjectAny) => Object.keys(val).length <= 0;

const capitalize = (str: string = '') => str && str.charAt(0).toUpperCase() + str.substring(1);
const isRule = (obj: any) => obj && obj.toCSS;

const getViewEl = <T extends any>(el?: Node): T | undefined => (el as any)?.__gjsv;

export const isComponent = (obj: any): obj is Component => !!obj?.toHTML;

export const getComponentView = (el?: Node) => getViewEl<ComponentView>(el);

export const getComponentModel = (el?: Node) => getComponentView(el)?.model;

const setViewEl = (el: any, view: any) => {
  el.__gjsv = view;
};

const createId = (length = 16) => {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const len = chars.length;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * len));
  }
  return result;
};

export const buildBase64UrlFromSvg = (svg: string) => {
  if (svg && svg.substr(0, 4) === '<svg') {
    let base64Str = '';

    if (hasWin()) {
      base64Str = window.btoa(svg);
    } else if (typeof Buffer !== 'undefined') {
      base64Str = Buffer.from(svg, 'utf8').toString('base64');
    }

    return base64Str ? `data:image/svg+xml;base64,${base64Str}` : svg;
  }

  return svg;
};

export {
  hasDnd,
  upFirst,
  matches,
  getModel,
  camelCase,
  getElement,
  shallowDiff,
  normalizeFloat,
  getUnitFromValue,
  capitalize,
  getViewEl,
  setViewEl,
  appendStyles,
  isObject,
  isEmptyObj,
  createId,
  isRule,
};
```

--------------------------------------------------------------------------------

---[FILE: polyfills.ts]---
Location: grapesjs-dev/packages/core/src/utils/polyfills.ts

```typescript
/**
 * File made for IE/Edge support
 * https://github.com/GrapesJS/grapesjs/issues/214
 */
import { hasWin } from './mixins';

export default () => {
  /**
   * Check if IE/Edge
   * @return {Boolean}
   */
  const isIE = () => {
    let match;
    const agent = window.navigator.userAgent;
    const rules: [string, RegExp][] = [
      ['edge', /Edge\/([0-9\._]+)/],
      ['ie', /MSIE\s(7\.0)/],
      ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
      ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
    ];

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      match = rule[1].exec(agent);
      if (match) break;
    }

    return !!match;
  };

  if (hasWin() && isIE()) {
    const originalCreateHTMLDocument = DOMImplementation.prototype.createHTMLDocument;
    DOMImplementation.prototype.createHTMLDocument = (title) => {
      if (!title) title = '';
      return originalCreateHTMLDocument.apply(document.implementation, [title]);
    };
  }
};
```

--------------------------------------------------------------------------------

---[FILE: promise-polyfill.d.ts]---
Location: grapesjs-dev/packages/core/src/utils/promise-polyfill.d.ts

```typescript
declare module 'promise-polyfill' {
  const defType: PromiseConstructor;
  export default defType;
}
```

--------------------------------------------------------------------------------

---[FILE: Resizer.ts]---
Location: grapesjs-dev/packages/core/src/utils/Resizer.ts

```typescript
import { bindAll, each, isFunction } from 'underscore';
import { ElementPosOpts } from '../canvas/view/CanvasView';
import { Position } from '../common';
import { off, on } from './dom';
import { normalizeFloat } from './mixins';

export type RectDim = {
  t: number;
  l: number;
  w: number;
  h: number;
};

type BoundingRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type CallbackOptions = {
  docs: Document[];
  config: ResizerOptions;
  el: HTMLElement;
  resizer: Resizer;
};

interface ResizerUpdateTargetOptions {
  store: boolean;
  selectedHandler?: string;
  resizer: Resizer;
  config: ResizerOptions;
  event: PointerEvent;
}

interface ResizerOnUpdateContainerOptions {
  el: HTMLElement;
  resizer: Resizer;
  opts: ResizerOptions;
}

export interface ResizerOptions {
  /**
   * Function which returns custom X and Y coordinates of the mouse.
   */
  mousePosFetcher?: (ev: Event) => Position;

  /**
   * Indicates custom target updating strategy.
   */
  updateTarget?: (el: HTMLElement, rect: RectDim, opts: ResizerUpdateTargetOptions) => void;

  /**
   * Function which gets HTMLElement as an arg and returns it relative position
   */
  posFetcher?: (el: HTMLElement, opts: ElementPosOpts) => BoundingRect;

  /**
   * Indicate if the resizer should keep the default ratio.
   * @default false
   */
  ratioDefault?: boolean;

  /**
   * On resize start callback.
   */
  onStart?: (ev: PointerEvent, opts: CallbackOptions) => void;

  /**
   * On resize move callback.
   */
  onMove?: (ev: PointerEvent, opts: CallbackOptions) => void;

  /**
   * On resize end callback.
   */
  onEnd?: (ev: PointerEvent, opts: CallbackOptions) => void;

  /**
   * On container update callback.
   */
  onUpdateContainer?: (opts: ResizerOnUpdateContainerOptions) => void;

  /**
   * Resize unit step.
   * @default 1
   */
  step?: number;

  /**
   * Minimum dimension.
   * @default 10
   */
  minDim?: number;

  /**
   * Maximum dimension.
   * @default Infinity
   */
  maxDim?: number;

  /**
   * Unit used for height resizing.
   * @default 'px'
   */
  unitHeight?: string;

  /**
   * Unit used for width resizing.
   * @default 'px'
   */
  unitWidth?: string;

  /**
   * The key used for height resizing.
   * @default 'height'
   */
  keyHeight?: string;

  /**
   * The key used for width resizing.
   * @default 'width'
   */
  keyWidth?: string;

  /**
   * If true, will override unitHeight and unitWidth, on start, with units
   * from the current focused element (currently used only in SelectComponent).
   * @default true
   */
  currentUnit?: boolean;

  /**
   * With this option enabled the mousemove event won't be altered when the pointer comes over iframes.
   * @default false
   */
  silentFrames?: boolean;

  /**
   * If true the container of handlers won't be updated.
   * @default false
   */
  avoidContainerUpdate?: boolean;

  /**
   * If height is 'auto', this setting will preserve it and only update the width.
   * @default false
   */
  keepAutoHeight?: boolean;

  /**
   * If width is 'auto', this setting will preserve it and only update the height.
   * @default false
   */
  keepAutoWidth?: boolean;

  /**
   * When keepAutoHeight is true and the height has the value 'auto', this is set to true and height isn't updated.
   * @default false
   */
  autoHeight?: boolean;

  /**
   * When keepAutoWidth is true and the width has the value 'auto', this is set to true and width isn't updated.
   * @default false
   */
  autoWidth?: boolean;

  /**
   * Enable top left handler.
   * @default true
   */
  tl?: boolean;

  /**
   * Enable top center handler.
   * @default true
   */
  tc?: boolean;

  /**
   * Enable top right handler.
   * @default true
   */
  tr?: boolean;

  /**
   * Enable center left handler.
   * @default true
   */
  cl?: boolean;

  /**
   * Enable center right handler.
   * @default true
   */
  cr?: boolean;

  /**
   * Enable bottom left handler.
   * @default true
   */
  bl?: boolean;

  /**
   * Enable bottom center handler.
   * @default true
   */
  bc?: boolean;

  /**
   * Enable bottom right handler.
   * @default true
   */
  br?: boolean;

  /**
   * Class prefix.
   */
  prefix?: string;

  /**
   * Where to append resize container (default body element).
   */
  appendTo?: HTMLElement;

  /**
   * When enabled, the resizer will emit updates only if the size of the element
   * changes during a drag operation.
   *
   * By default, the resizer triggers update callbacks even if the pointer
   * doesn’t move (e.g., on click or tap without dragging). Set this option to `true`
   * to suppress those "no-op" updates and emit only meaningful changes.
   *
   * @default false
   */
  updateOnMove?: boolean;

  /**
   * By default, the resizer will try to perform adjustments on some units (eg. %), with this option
   * you can skip this behavior.
   */
  skipUnitAdjustments?: boolean;

  docs?: Document[];
}

type Handlers = Record<string, HTMLElement | null>;

const createHandler = (name: string, opts: { prefix?: string } = {}) => {
  var pfx = opts.prefix || '';
  var el = document.createElement('i');
  el.className = pfx + 'resizer-h ' + pfx + 'resizer-h-' + name;
  el.setAttribute('data-' + pfx + 'handler', name);
  return el;
};

const getBoundingRect = (el: HTMLElement, win?: Window): BoundingRect => {
  var w = win || window;
  var rect = el.getBoundingClientRect();
  return {
    left: rect.left + w.pageXOffset,
    top: rect.top + w.pageYOffset,
    width: rect.width,
    height: rect.height,
  };
};

export default class Resizer {
  defOpts: ResizerOptions;
  opts: ResizerOptions;
  container?: HTMLElement;
  handlers?: Handlers;
  el?: HTMLElement;
  clickedHandler?: HTMLElement;
  selectedHandler?: HTMLElement;
  handlerAttr?: string;
  startDim?: RectDim;
  rectDim?: RectDim;
  parentDim?: RectDim;
  startPos?: Position;
  delta?: Position;
  currentPos?: Position;
  docs?: Document[];
  moved = false;
  keys?: { shift: boolean; ctrl: boolean; alt: boolean };
  mousePosFetcher?: ResizerOptions['mousePosFetcher'];
  updateTarget?: ResizerOptions['updateTarget'];
  posFetcher?: ResizerOptions['posFetcher'];
  onStart?: ResizerOptions['onStart'];
  onMove?: ResizerOptions['onMove'];
  onEnd?: ResizerOptions['onEnd'];
  onUpdateContainer?: ResizerOptions['onUpdateContainer'];

  /**
   * Init the Resizer with options
   * @param  {Object} options
   */
  constructor(opts: ResizerOptions = {}) {
    this.defOpts = {
      ratioDefault: false,
      onUpdateContainer: () => {},
      step: 1,
      minDim: 10,
      maxDim: Infinity,
      unitHeight: 'px',
      unitWidth: 'px',
      keyHeight: 'height',
      keyWidth: 'width',
      currentUnit: true,
      silentFrames: false,
      avoidContainerUpdate: false,
      keepAutoHeight: false,
      keepAutoWidth: false,
      autoHeight: false,
      autoWidth: false,
      tl: true,
      tc: true,
      tr: true,
      cl: true,
      cr: true,
      bl: true,
      bc: true,
      br: true,
    };
    this.opts = { ...this.defOpts };
    this.setOptions(opts);
    bindAll(this, 'handleKeyDown', 'handleMouseDown', 'move', 'stop');
  }

  /**
   * Get current connfiguration options
   * @return {Object}
   */
  getConfig() {
    return this.opts;
  }

  /**
   * Setup options
   * @param {Object} options
   */
  setOptions(options: Partial<ResizerOptions> = {}, reset?: boolean) {
    this.opts = {
      ...(reset ? this.defOpts : this.opts),
      ...options,
    };
    this.setup();
  }

  /**
   * Setup resizer
   */
  setup() {
    const opts = this.opts;
    const pfx = opts.prefix || '';
    const appendTo = opts.appendTo || document.body;
    let container = this.container;

    // Create container if not yet exist
    if (!container) {
      container = document.createElement('div');
      container.className = `${pfx}resizer-c`;
      appendTo.appendChild(container);
      this.container = container;
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Create handlers
    const handlers: Handlers = {};
    ['tl', 'tc', 'tr', 'cl', 'cr', 'bl', 'bc', 'br'].forEach(
      // @ts-ignore
      (hdl) => (handlers[hdl] = opts[hdl] ? createHandler(hdl, opts) : null),
    );

    for (let n in handlers) {
      const handler = handlers[n];
      handler && container.appendChild(handler);
    }

    this.handlers = handlers;
    this.mousePosFetcher = opts.mousePosFetcher;
    this.updateTarget = opts.updateTarget;
    this.posFetcher = opts.posFetcher;
    this.onStart = opts.onStart;
    this.onMove = opts.onMove;
    this.onEnd = opts.onEnd;
    this.onUpdateContainer = opts.onUpdateContainer;
  }

  /**
   * Toggle iframes pointer event
   * @param {Boolean} silent If true, iframes will be silented
   */
  toggleFrames(silent?: boolean) {
    if (this.opts.silentFrames) {
      const frames = document.querySelectorAll('iframe');
      each(frames, (frame) => (frame.style.pointerEvents = silent ? 'none' : ''));
    }
  }

  /**
   * Detects if the passed element is a resize handler
   * @param  {HTMLElement} el
   * @return {Boolean}
   */
  isHandler(el: HTMLElement) {
    const { handlers } = this;

    for (var n in handlers) {
      if (handlers[n] === el) return true;
    }

    return false;
  }

  /**
   * Returns the focused element
   * @return {HTMLElement}
   */
  getFocusedEl() {
    return this.el;
  }

  /**
   * Returns the parent of the focused element
   * @return {HTMLElement}
   */
  getParentEl() {
    return this.el?.parentElement;
  }

  /**
   * Returns documents
   */
  getDocumentEl() {
    return this.opts.docs || [this.el!.ownerDocument, document];
  }

  /**
   * Return element position
   * @param  {HTMLElement} el
   * @param  {Object} opts Custom options
   * @return {Object}
   */
  getElementPos(el: HTMLElement, opts: ElementPosOpts = {}) {
    const { posFetcher } = this;
    return posFetcher ? posFetcher(el, opts) : getBoundingRect(el);
  }

  /**
   * Focus resizer on the element, attaches handlers to it
   * @param {HTMLElement} el
   */
  focus(el: HTMLElement) {
    // Avoid focusing on already focused element
    if (el && el === this.el) {
      return;
    }

    this.el = el;
    this.updateContainer({ forceShow: true });
    on(this.getDocumentEl(), 'pointerdown', this.handleMouseDown);
  }

  /**
   * Blur from element
   */
  blur() {
    this.container!.style.display = 'none';

    if (this.el) {
      off(this.getDocumentEl(), 'pointerdown', this.handleMouseDown);
      delete this.el;
    }
  }

  /**
   * Start resizing
   * @param  {Event} e
   */
  start(e: PointerEvent) {
    const { el, opts = {} } = this;
    this.moved = false;

    if (e.button !== 0 || !el) return;

    e.preventDefault();
    e.stopPropagation();
    this.selectedHandler?.setPointerCapture(e.pointerId);
    const parentEl = this.getParentEl();
    const resizer = this;
    const config = opts;
    const mouseFetch = this.mousePosFetcher;
    const attrName = 'data-' + config.prefix + 'handler';
    const rect = this.getElementPos(el, { avoidFrameZoom: true, avoidFrameOffset: true });
    const parentRect = this.getElementPos(parentEl!);
    const target = e.target as HTMLElement;
    this.handlerAttr = target.getAttribute(attrName)!;
    this.clickedHandler = target;
    this.startDim = {
      t: rect.top,
      l: rect.left,
      w: rect.width,
      h: rect.height,
    };
    this.rectDim = {
      t: rect.top,
      l: rect.left,
      w: rect.width,
      h: rect.height,
    };
    this.startPos = mouseFetch
      ? mouseFetch(e)
      : {
          x: e.clientX,
          y: e.clientY,
        };
    this.parentDim = {
      t: parentRect.top,
      l: parentRect.left,
      w: parentRect.width,
      h: parentRect.height,
    };

    // Listen events
    const docs = this.getDocumentEl();
    this.docs = docs;
    on(docs, 'pointermove', this.move);
    on(docs, 'keydown', this.handleKeyDown);
    on(docs, 'pointerup', this.stop);
    isFunction(this.onStart) && this.onStart(e, { docs, config, el, resizer });
    this.toggleFrames(true);
    !config.updateOnMove && this.move(e);
  }

  /**
   * While resizing
   * @param  {Event} e
   */
  move(ev: PointerEvent) {
    this.moved = true;
    const el = this.el!;
    const config = this.opts;
    const docs = this.docs || this.getDocumentEl();
    const currentPos = this.mousePosFetcher?.(ev) || {
      x: ev.clientX,
      y: ev.clientY,
    };
    this.currentPos = currentPos;
    this.delta = {
      x: currentPos.x - this.startPos!.x,
      y: currentPos.y - this.startPos!.y,
    };
    this.keys = {
      shift: ev.shiftKey,
      ctrl: ev.ctrlKey,
      alt: ev.altKey,
    };
    this.rectDim = this.calc(this);
    this.updateRect(false, ev);
    this.onMove?.(ev, { docs, config, el, resizer: this });
  }

  /**
   * Stop resizing
   * @param  {Event} ev
   */
  stop(ev: PointerEvent) {
    const el = this.el!;
    const config = this.opts;
    const docs = this.docs || this.getDocumentEl();
    off(docs, 'pointermove', this.move);
    off(docs, 'keydown', this.handleKeyDown);
    off(docs, 'pointerup', this.stop);

    if (this.moved || !config.updateOnMove) {
      this.updateRect(true, ev);
    }

    ev.pointerId && this.selectedHandler?.releasePointerCapture(ev.pointerId);
    this.toggleFrames();
    this.onEnd?.(ev, { docs, config, el, resizer: this });
    this.moved = false;
    delete this.docs;
  }

  /**
   * Update rect
   */
  updateRect(store: boolean, event: PointerEvent) {
    const el = this.el!;
    const resizer = this;
    const config = this.opts;
    const rect = this.rectDim!;
    const updateTarget = this.updateTarget;
    const selectedHandler = this.getSelectedHandler();
    const { unitHeight, unitWidth, keyWidth, keyHeight } = config;

    // Use custom updating strategy if requested
    if (isFunction(updateTarget)) {
      updateTarget(el, rect, {
        store,
        selectedHandler,
        resizer,
        config,
        event,
      });
    } else {
      const elStyle = el.style as Record<string, any>;
      elStyle[keyWidth!] = rect.w + unitWidth!;
      elStyle[keyHeight!] = rect.h + unitHeight!;
    }

    this.updateContainer();
  }

  updateContainer(opt: { forceShow?: boolean } = {}) {
    const { opts, container, el } = this;
    const { style } = container!;

    if (!opts.avoidContainerUpdate && el) {
      // On component resize container fits the tool,
      // to check if this update is required somewhere else point
      // const toUpdate = ['left', 'top', 'width', 'height'];
      // const rectEl = this.getElementPos(el, { target: 'container' });
      // toUpdate.forEach(pos => (style[pos] = `${rectEl[pos]}px`));
      if (opt.forceShow) style.display = 'block';
    }

    this.onUpdateContainer?.({
      el: container!,
      resizer: this,
      opts: {
        ...opts,
        ...opt,
      },
    });
  }

  /**
   * Get selected handler name
   * @return {string}
   */
  getSelectedHandler() {
    var handlers = this.handlers;

    if (!this.selectedHandler) {
      return;
    }

    for (let n in handlers) {
      if (handlers[n] === this.selectedHandler) return n;
    }
  }

  /**
   * Handle ESC key
   * @param  {Event} e
   */
  handleKeyDown(e: PointerEvent) {
    // @ts-ignore
    if (e.keyCode === 27) {
      // Rollback to initial dimensions
      this.rectDim = this.startDim;
      this.stop(e);
    }
  }

  /**
   * Handle mousedown to check if it's possible to start resizing
   */
  handleMouseDown(e: PointerEvent) {
    const el = e.target as HTMLElement;

    if (this.isHandler(el)) {
      this.selectedHandler = el;
      this.start(e);
    } else if (el !== this.el) {
      delete this.selectedHandler;
      this.blur();
    }
  }

  /**
   * All positioning logic
   * @return {Object}
   */
  calc(data: Resizer): RectDim | undefined {
    let value;
    const opts = this.opts || {};
    const step = opts.step!;
    const startDim = this.startDim!;
    const minDim = opts.minDim!;
    const maxDim = opts.maxDim;
    const deltaX = data.delta!.x;
    const deltaY = data.delta!.y;
    const parentW = this.parentDim!.w;
    const parentH = this.parentDim!.h;
    const { unitWidth, unitHeight, skipUnitAdjustments } = opts;
    const parentRect = this.getParentRect();
    const isWidthPercent = unitWidth === '%' && !skipUnitAdjustments;
    const isHeightPercent = unitHeight === '%' && !skipUnitAdjustments;
    const startW = isWidthPercent ? (startDim.w / 100) * parentW : startDim.w;
    const startH = isHeightPercent ? (startDim.h / 100) * parentH : startDim.h;

    const box: RectDim = {
      t: startDim.t - parentRect.top,
      l: startDim.l - parentRect.left,
      w: startW,
      h: startH,
    };

    if (!data) return;

    var attr = data.handlerAttr!;
    if (~attr.indexOf('r')) {
      value = isWidthPercent
        ? normalizeFloat(((startW + deltaX * step) / parentW) * 100, 0.01)
        : normalizeFloat(startW + deltaX * step, step);
      value = Math.max(minDim, value);
      maxDim && (value = Math.min(maxDim, value));
      box.w = value;
    }
    if (~attr.indexOf('b')) {
      value = isHeightPercent
        ? normalizeFloat(((startH + deltaY * step) / parentH) * 100, 0.01)
        : normalizeFloat(startH + deltaY * step, step);
      value = Math.max(minDim, value);
      maxDim && (value = Math.min(maxDim, value));
      box.h = value;
    }
    if (~attr.indexOf('l')) {
      value = isWidthPercent
        ? normalizeFloat(((startW - deltaX * step) / parentW) * 100, 0.01)
        : normalizeFloat(startW - deltaX * step, step);
      value = Math.max(minDim, value);
      maxDim && (value = Math.min(maxDim, value));
      box.w = value;
    }
    if (~attr.indexOf('t')) {
      value = isHeightPercent
        ? normalizeFloat(((startH - deltaY * step) / parentH) * 100, 0.01)
        : normalizeFloat(startH - deltaY * step, step);
      value = Math.max(minDim, value);
      maxDim && (value = Math.min(maxDim, value));
      box.h = value;
    }

    // Enforce aspect ratio (unless shift key is being held)
    var ratioActive = opts.ratioDefault ? !data.keys!.shift : data.keys!.shift;
    if (attr.indexOf('c') < 0 && ratioActive) {
      var ratio = startDim.w / startDim.h;
      if (box.w / box.h > ratio) {
        box.h = Math.round(box.w / ratio);
      } else {
        box.w = Math.round(box.h * ratio);
      }
    }

    if (~attr.indexOf('l')) {
      box.l += startDim.w - box.w;
    }
    if (~attr.indexOf('t')) {
      box.t += startDim.h - box.h;
    }

    for (const key in box) {
      const i = key as keyof RectDim;
      box[i] = parseInt(`${box[i]}`, 10);
    }

    return box;
  }

  getParentRect(): BoundingRect {
    let parentRect = { left: 0, top: 0, width: 0, height: 0 };
    const { el } = this;

    if (!el) return parentRect;

    const { offsetParent } = el;

    // Check if the parent or any ancestor has `position: relative`, `absolute`, `fixed`, or `sticky`
    if (offsetParent && offsetParent.tagName !== 'BODY') {
      parentRect = this.getElementPos(offsetParent as HTMLElement);
    }

    return parentRect;
  }
}
```

--------------------------------------------------------------------------------

````
