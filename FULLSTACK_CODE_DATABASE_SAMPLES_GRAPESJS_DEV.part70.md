---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 70
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 70 of 97)

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

---[FILE: dom.ts]---
Location: grapesjs-dev/packages/core/src/utils/dom.ts

```typescript
import { each, isArray, isString, isUndefined } from 'underscore';
import { ObjectAny } from '../common';

type vNode = {
  tag?: string;
  attributes?: ObjectAny;
  children?: vNode[];
};

type ChildHTML = HTMLElement | string;

type ClassNameInputType = string | number | boolean | null | undefined;

type ClassNameInput = ClassNameInputType | Array<ClassNameInputType>;

const KEY_TAG = 'tag';
const KEY_ATTR = 'attributes';
const KEY_CHILD = 'children';

export const motionsEv = 'transitionend oTransitionEnd transitionend webkitTransitionEnd';

export const isDoc = (el?: Node): el is Document => el?.nodeType === Node.DOCUMENT_NODE;

export const removeEl = (el?: HTMLElement) => {
  const parent = el && el.parentNode;
  parent && parent.removeChild(el);
};

export function cx(...inputs: ClassNameInput[]): string {
  const inp = Array.isArray(inputs[0]) ? inputs[0] : [...inputs];
  return inp.filter(Boolean).join(' ');
}

export const find = (el: HTMLElement, query: string) => el.querySelectorAll(query);

export const attrUp = (el?: HTMLElement, attrs: ObjectAny = {}) =>
  el && el.setAttribute && each(attrs, (value, key) => el.setAttribute(key, value));

export const isVisible = (el?: HTMLElement) => {
  return el && !!(el.offsetWidth || el.offsetHeight || el.getClientRects?.().length);
};

export const empty = (node: HTMLElement) => {
  while (node.firstChild) node.removeChild(node.firstChild);
};

export const replaceWith = (oldEl: HTMLElement, newEl: HTMLElement) => {
  oldEl.parentNode?.replaceChild(newEl, oldEl);
};

export const appendAtIndex = (parent: HTMLElement | DocumentFragment, child: ChildHTML, index?: number) => {
  const { childNodes } = parent;
  const total = childNodes.length;
  const at = isUndefined(index) ? total : index;

  if (isString(child)) {
    // @ts-ignore
    parent.insertAdjacentHTML('beforeEnd', child);
    child = parent.lastChild as HTMLElement;
    parent.removeChild(child);
  }

  if (at >= total) {
    parent.appendChild(child);
  } else {
    parent.insertBefore(child, childNodes[at]);
  }
};

export const append = (parent: HTMLElement, child: ChildHTML) => appendAtIndex(parent, child);

export const createEl = (tag: string, attrs: ObjectAny = {}, child?: ChildHTML) => {
  const el = document.createElement(tag);
  attrs && each(attrs, (value, key) => el.setAttribute(key, value));

  if (child) {
    if (isString(child)) el.innerHTML = child;
    else el.appendChild(child);
  }

  return el;
};

export const createText = (str: string) => document.createTextNode(str);

// Unfortunately just creating `KeyboardEvent(e.type, e)` is not enough,
// the keyCode/which will be always `0`. Even if it's an old/deprecated
// property keymaster (and many others) still use it... using `defineProperty`
// hack seems the only way
export const createCustomEvent = (e: any, cls: any) => {
  let oEvent: any;
  const { type } = e;
  try {
    // @ts-ignore
    oEvent = new window[cls](type, e);
  } catch (err) {
    oEvent = document.createEvent(cls);
    oEvent.initEvent(type, true, true);
  }
  oEvent._parentEvent = e;
  if (type.indexOf('key') === 0) {
    oEvent.keyCodeVal = e.keyCode;
    ['keyCode', 'which'].forEach((prop) => {
      Object.defineProperty(oEvent, prop, {
        get() {
          return this.keyCodeVal;
        },
      });
    });
  }
  return oEvent;
};

/**
 * Append an array of vNodes to an element
 * @param {HTMLElement} node HTML element
 * @param {Array} vNodes Array of node objects
 */
export const appendVNodes = (node: HTMLElement, vNodes: vNode | vNode[] = []) => {
  const vNodesArr = Array.isArray(vNodes) ? vNodes : [vNodes];
  vNodesArr.forEach((vnode) => {
    const tag = vnode[KEY_TAG] || 'div';
    const attr = vnode[KEY_ATTR] || {};
    const el = document.createElement(tag);

    each(attr, (value, key) => {
      el.setAttribute(key, value);
    });

    node.appendChild(el);
  });
};

/**
 * Check if element is a text node
 * @param  {Node} el
 * @return {Boolean}
 */
export const isTextNode = (el?: Node): el is Text => el?.nodeType === Node.TEXT_NODE;

/**
 * Check if element is a comment node
 * @param  {Node} el
 * @return {Boolean}
 */
export const isCommentNode = (el?: Node): el is Comment => el?.nodeType === Node.COMMENT_NODE;

/**
 * Check if taggable node
 * @param  {Node} el
 * @return {Boolean}
 */
export const isTaggableNode = (el?: Node) => el && !isTextNode(el) && !isCommentNode(el);

/**
 * Get DOMRect of the element.
 * @param el
 * @returns {DOMRect}
 */
export const getElRect = (el?: Element) => {
  const def = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };
  if (!el) return def;
  let rectText;

  if (isTextNode(el)) {
    const range = document.createRange();
    range.selectNode(el);
    rectText = range.getBoundingClientRect();
    range.detach();
  }

  return rectText || (el.getBoundingClientRect ? el.getBoundingClientRect() : def);
};

/**
 * Get document scroll coordinates
 */
export const getDocumentScroll = (el?: HTMLElement) => {
  const doc = el?.ownerDocument || document;
  const docEl = doc.documentElement;
  const win = doc.defaultView || window;

  return {
    x: (win.pageXOffset || docEl.scrollLeft || 0) - (docEl.clientLeft || 0),
    y: (win.pageYOffset || docEl.scrollTop || 0) - (docEl.clientTop || 0),
  };
};

export const getKeyCode = (ev: KeyboardEvent) => ev.which || ev.keyCode;

export const getKeyChar = (ev: KeyboardEvent) => String.fromCharCode(getKeyCode(ev));

export const getPointerEvent = (ev: any): PointerEvent => (ev.touches && ev.touches[0] ? ev.touches[0] : ev);

export const isEscKey = (ev: KeyboardEvent) => getKeyCode(ev) === 27;

export const isEnterKey = (ev: KeyboardEvent) => getKeyCode(ev) === 13;

export const hasCtrlKey = (ev: WheelEvent) => ev.ctrlKey;

export const hasModifierKey = (ev: WheelEvent) => hasCtrlKey(ev) || ev.metaKey;

// Ref: https://stackoverflow.com/a/10162353
export const doctypeToString = (dt?: DocumentType | null) => {
  if (!dt) return '';
  const { name, publicId, systemId } = dt;
  const pubId = publicId ? ` PUBLIC "${publicId}"` : '';
  const sysId = !publicId && systemId ? ` SYSTEM "${systemId}"` : '';
  return `<!DOCTYPE ${name}${pubId}${sysId}>`;
};

export const attrToString = (attrs: ObjectAny = {}) => {
  const res: string[] = [];
  each(attrs, (value, key) => res.push(`${key}="${value}"`));
  return res.join(' ');
};

export const on = <E extends Event = Event>(
  el: EventTarget | EventTarget[],
  ev: string,
  fn: (ev: E) => void,
  opts?: boolean | AddEventListenerOptions,
) => {
  const evs = ev.split(/\s+/);
  const els = isArray(el) ? el : [el];

  evs.forEach((ev) => {
    els.forEach((el) => el?.addEventListener(ev, fn as EventListener, opts));
  });
};

export const off = <E extends Event = Event>(
  el: EventTarget | EventTarget[],
  ev: string,
  fn: (ev: E) => void,
  opts?: boolean | AddEventListenerOptions,
) => {
  const evs = ev.split(/\s+/);
  const els = isArray(el) ? el : [el];

  evs.forEach((ev) => {
    els.forEach((el) => el?.removeEventListener(ev, fn as EventListener, opts));
  });
};

export const processDataGjsAttributeHyphen = (str: string): string => {
  const camelCased = str.replace(/-([a-zA-Z0-9])/g, (_, char) => char.toUpperCase());

  return camelCased;
};
```

--------------------------------------------------------------------------------

---[FILE: Dragger.ts]---
Location: grapesjs-dev/packages/core/src/utils/Dragger.ts

```typescript
import { bindAll, isFunction, isUndefined, result } from 'underscore';
import { Position } from '../common';
import { getPointerEvent, isEscKey, off, on } from './dom';

type DraggerPosition = Position & { end?: boolean };

type PositionXY = keyof Omit<DraggerPosition, 'end'>;

type Guide = {
  x: number;
  y: number;
  lock?: number;
  active?: boolean;
};

export interface DraggerOptions {
  /**
   * Element on which the drag will be executed. By default, the document will be used
   */
  container?: HTMLElement;

  /**
   * Callback on drag start.
   * @example
   * onStart(ev, dragger) {
   *  console.log('pointer start', dragger.startPointer, 'position start', dragger.startPosition);
   * }
   */
  onStart?: (ev: Event, dragger: Dragger) => void;

  /**
   * Callback on drag.
   * @example
   * onDrag(ev, dragger) {
   *  console.log('pointer', dragger.currentPointer, 'position', dragger.position, 'delta', dragger.delta);
   * }
   */
  onDrag?: (ev: Event, dragger: Dragger) => void;

  /**
   * Callback on drag end.
   * @example
   * onEnd(ev, dragger) {
   *   console.log('pointer', dragger.currentPointer, 'position', dragger.position, 'delta', dragger.delta);
   * }
   */
  onEnd?: (ev: Event, dragger: Dragger, opts: { cancelled: boolean }) => void;

  /**
   * Indicate a callback where to pass an object with new coordinates
   */
  setPosition?: (position: DraggerPosition) => void;

  /**
   * Indicate a callback where to get initial coordinates.
   * @example
   * getPosition: () => {
   *   // ...
   *   return { x: 10, y: 100 }
   * }
   */
  getPosition?: () => DraggerPosition;

  /**
   * Indicate a callback where to get pointer coordinates.
   */
  getPointerPosition?: (ev: Event) => DraggerPosition;

  /**
   * Static guides to be snapped.
   */
  guidesStatic?: () => Guide[];

  /**
   * Target guides that will snap to static one.
   */
  guidesTarget?: () => Guide[];

  /**
   * Offset before snap to guides.
   * @default 5
   */
  snapOffset?: number;

  /**
   * Snapping value for the x-y axis. If you pass a value of 0, the snapping will be disabled for that axis.
   * @example { snapGuides: { x: 10, y: 5 } }
   */
  snapGuides?: { x?: number; y?: number };

  /**
   * Document on which listen to pointer events.
   */
  doc?: Document;

  /**
   * Scale result points, can also be a function.
   * @default 1
   */
  scale?: number | (() => number);
}

const resetPos = () => ({ x: 0, y: 0 });

const xyArr: PositionXY[] = ['x', 'y'];

export default class Dragger {
  opts: DraggerOptions;
  startPointer: DraggerPosition;
  delta: DraggerPosition;
  lastScroll: DraggerPosition;
  lastScrollDiff: DraggerPosition;
  startPosition: DraggerPosition;
  globScrollDiff: DraggerPosition;
  currentPointer: DraggerPosition;
  position: DraggerPosition;
  el?: HTMLElement;
  guidesStatic: Guide[];
  guidesTarget: Guide[];
  docs: Document[];
  trgX?: Guide;
  trgY?: Guide;

  /**
   * Init the dragger
   * @param  {Object} opts
   */
  constructor(opts: DraggerOptions = {}) {
    this.opts = {
      snapGuides: { x: 5, y: 5 },
      snapOffset: 5,
      scale: 1,
    };
    bindAll(this, 'drag', 'stop', 'keyHandle', 'handleScroll');
    this.setOptions(opts);
    this.delta = resetPos();
    this.lastScroll = resetPos();
    this.lastScrollDiff = resetPos();
    this.startPointer = resetPos();
    this.startPosition = resetPos();
    this.globScrollDiff = resetPos();
    this.currentPointer = resetPos();
    this.position = resetPos();
    this.guidesStatic = [];
    this.guidesTarget = [];
    this.docs = [];
    return this;
  }

  /**
   * Update options
   * @param {Object} options
   */
  setOptions(opts: Partial<DraggerOptions> = {}) {
    this.opts = {
      ...this.opts,
      ...opts,
    };
  }

  toggleDrag(enable?: boolean) {
    const docs = this.getDocumentEl();
    const container = this.getContainerEl();
    const win = this.getWindowEl();
    const method = enable ? 'on' : 'off';
    const methods = { on, off };
    methods[method](container, 'mousemove dragover', this.drag);
    methods[method](docs, 'mouseup dragend touchend', this.stop);
    methods[method](docs, 'keydown', this.keyHandle);
    methods[method](win, 'scroll', this.handleScroll);
  }

  handleScroll() {
    const { lastScroll, delta } = this;
    const actualScroll = this.getScrollInfo();
    const scrollDiff = {
      x: actualScroll.x - lastScroll!.x,
      y: actualScroll.y - lastScroll!.y,
    };
    this.move(delta.x + scrollDiff.x, delta.y + scrollDiff.y);
    this.lastScrollDiff = scrollDiff;
  }

  /**
   * Start dragging
   * @param  {Event} e
   */
  start(ev: Event) {
    const { opts } = this;
    const { onStart } = opts;
    this.toggleDrag(true);
    this.startPointer = this.getPointerPos(ev);
    this.guidesStatic = result(opts, 'guidesStatic') || [];
    this.guidesTarget = result(opts, 'guidesTarget') || [];
    isFunction(onStart) && onStart(ev, this);
    this.startPosition = this.getStartPosition();
    this.lastScrollDiff = resetPos();
    this.globScrollDiff = resetPos();
    this.drag(ev);
  }

  /**
   * Drag event
   * @param  {Event} event
   */
  drag(ev: Event) {
    const { opts, lastScrollDiff, globScrollDiff } = this;
    const { onDrag } = opts;
    const { startPointer } = this;
    const currentPos = this.getPointerPos(ev);
    const glDiff = {
      x: globScrollDiff.x + lastScrollDiff.x,
      y: globScrollDiff.y + lastScrollDiff.y,
    };
    this.globScrollDiff = glDiff;
    const delta = {
      x: currentPos.x - startPointer.x + glDiff.x,
      y: currentPos.y - startPointer.y + glDiff.y,
    };
    this.lastScrollDiff = resetPos();

    const moveDelta = (delta: DraggerPosition) => {
      xyArr.forEach((co) => (delta[co] = delta[co] * result(opts, 'scale')));
      this.delta = delta;
      this.move(delta.x, delta.y);
      isFunction(onDrag) && onDrag(ev, this);
    };
    const deltaPre = { ...delta };
    this.currentPointer = currentPos;
    this.lastScroll = this.getScrollInfo();
    moveDelta(delta);

    if (this.guidesTarget.length) {
      const { newDelta, trgX, trgY } = this.snapGuides(deltaPre);
      (trgX || trgY) && moveDelta(newDelta);
    }

    // @ts-ignore In case the mouse button was released outside of the window
    ev.which === 0 && this.stop(ev);
  }

  /**
   * Check if the delta hits some guide
   */
  snapGuides(delta: DraggerPosition) {
    const newDelta = { ...delta };
    let { trgX, trgY } = this;

    this.guidesTarget.forEach((trg) => {
      // Skip the guide if its locked axis already exists
      if ((trg.x && this.trgX) || (trg.y && this.trgY)) return;
      trg.active = false;

      this.guidesStatic.forEach((stat) => {
        if ((trg.y && stat.x) || (trg.x && stat.y)) return;
        const isY = trg.y && stat.y;
        const axis = isY ? 'y' : 'x';
        const trgPoint = trg[axis];
        const statPoint = stat[axis];
        const deltaPoint = delta[axis];
        const trgGuide = isY ? trgY : trgX;

        if (this.isPointIn(trgPoint, statPoint, { axis })) {
          if (isUndefined(trgGuide)) {
            const trgValue = deltaPoint - (trgPoint - statPoint);
            this.setGuideLock(trg, trgValue);
          }
        }
      });
    });

    trgX = this.trgX;
    trgY = this.trgY;

    xyArr.forEach((axis) => {
      const axisName = axis.toUpperCase();
      // @ts-ignore
      let trg = this[`trg${axisName}`];

      if (trg && !this.isPointIn(delta[axis], trg.lock, { axis })) {
        this.setGuideLock(trg, null);
        trg = null;
      }

      if (trg && !isUndefined(trg.lock)) {
        newDelta[axis] = trg.lock;
      }
    });

    return {
      newDelta,
      trgX: this.trgX,
      trgY: this.trgY,
    };
  }

  isPointIn(src: number, trg: number, { offset, axis }: { offset?: number; axis?: PositionXY } = {}) {
    const { snapGuides = {}, snapOffset = 0 } = this.opts;
    const axisOffset = axis === 'x' ? snapGuides.x : axis === 'y' ? snapGuides.y : undefined;

    // If snapGuides.x or snapGuides.y is explicitly 0, disable snapping for that axis
    const effectiveOffset = axisOffset === 0 ? 0 : (offset ?? axisOffset ?? snapOffset);

    // If effectiveOffset is 0, snapping is disabled for this axis
    if (effectiveOffset === 0) return false;

    return (src >= trg && src <= trg + effectiveOffset) || (src <= trg && src >= trg - effectiveOffset);
  }

  setGuideLock(guide: Guide, value: any) {
    const axis = !isUndefined(guide.x) ? 'X' : 'Y';
    const trgName = `trg${axis}`;

    if (value !== null) {
      guide.active = true;
      guide.lock = value;
      // @ts-ignore
      this[trgName] = guide;
    } else {
      delete guide.active;
      delete guide.lock;
      // @ts-ignore
      delete this[trgName];
    }

    return guide;
  }

  /**
   * Stop dragging
   */
  stop(ev: Event, opts: { cancel?: boolean } = {}) {
    const { delta } = this;
    const cancelled = !!opts.cancel;
    const x = cancelled ? 0 : delta.x;
    const y = cancelled ? 0 : delta.y;
    this.toggleDrag();
    this.move(x, y, true);
    const { onEnd } = this.opts;
    isFunction(onEnd) && onEnd(ev, this, { cancelled });
  }

  keyHandle(ev: Event) {
    if (isEscKey(ev as KeyboardEvent)) {
      this.stop(ev, { cancel: true });
    }
  }

  /**
   * Move the element
   * @param  {integer} x
   * @param  {integer} y
   */
  move(x: number, y: number, end?: boolean) {
    const { el, opts } = this;
    const pos = this.startPosition;
    if (!pos) return;
    const { setPosition } = opts;
    const xPos = pos.x + x;
    const yPos = pos.y + y;
    this.position = {
      x: xPos,
      y: yPos,
      end,
    };

    isFunction(setPosition) && setPosition(this.position);

    if (el) {
      el.style.left = `${xPos}px`;
      el.style.top = `${yPos}px`;
    }
  }

  getContainerEl() {
    const { container } = this.opts;
    return container ? [container] : this.getDocumentEl();
  }

  getWindowEl() {
    const cont = this.getContainerEl();
    return cont.map((item) => {
      const doc = item.ownerDocument || item;
      // @ts-ignore
      return doc.defaultView || doc.parentWindow;
    });
  }

  /**
   * Returns documents
   */
  getDocumentEl(el?: HTMLElement): Document[] {
    const { doc } = this.opts;
    el = el || this.el;

    if (!this.docs.length) {
      const docs = [document];
      el && docs.push(el.ownerDocument);
      doc && docs.push(doc);
      this.docs = docs;
    }

    return this.docs;
  }

  /**
   * Get mouse coordinates
   * @param  {Event} event
   * @return {Object}
   */
  getPointerPos(ev: Event) {
    const getPos = this.opts.getPointerPosition;
    const pEv = getPointerEvent(ev);

    return getPos
      ? getPos(ev)
      : {
          x: pEv.clientX,
          y: pEv.clientY,
        };
  }

  getStartPosition() {
    const { el, opts } = this;
    const getPos = opts.getPosition;
    let result = resetPos();

    if (isFunction(getPos)) {
      result = getPos();
    } else if (el) {
      result = {
        x: parseFloat(el.style.left),
        y: parseFloat(el.style.top),
      };
    }

    return result;
  }

  getScrollInfo() {
    const { doc } = this.opts;
    const body = doc && doc.body;

    return {
      y: body ? body.scrollTop : 0,
      x: body ? body.scrollLeft : 0,
    };
  }

  detectAxisLock(x: number, y: number) {
    const relX = x;
    const relY = y;
    const absX = Math.abs(relX);
    const absY = Math.abs(relY);

    // Vertical or Horizontal lock
    if (relY >= absX || relY <= -absX) {
      return 'x';
    } else if (relX > absY || relX < -absY) {
      return 'y';
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Droppable.ts]---
Location: grapesjs-dev/packages/core/src/utils/Droppable.ts

```typescript
import { bindAll, indexOf } from 'underscore';
import CanvasModule from '../canvas';
import { ObjectStrings } from '../common';
import Component from '../dom_components/model/Component';
import EditorModel from '../editor/model/Editor';
import { getDocumentScroll, off, on } from './dom';
import CanvasNewComponentNode from './sorter/CanvasNewComponentNode';
import ComponentSorter from './sorter/ComponentSorter';
import { DragDirection, DraggableContent, DragSource } from './sorter/types';

// TODO move in sorter
type SorterOptions = {
  sorter: any;
  event: any;
};

type DragStop = (cancel?: boolean) => void;

/**
 * This class makes the canvas droppable
 */
export default class Droppable {
  em: EditorModel;
  canvas: CanvasModule;
  el: HTMLElement;
  counter: number;
  getSorterOptions?: (sorter: any) => Record<string, any> | null;
  over?: boolean;
  dragStop?: DragStop;
  draggedNode?: CanvasNewComponentNode;
  sorter!: ComponentSorter<CanvasNewComponentNode>;
  setAbsoluteDragContent?: (cnt: any) => any;

  constructor(em: EditorModel, rootEl?: HTMLElement) {
    this.em = em;
    this.canvas = em.Canvas;
    const el = rootEl || this.canvas.getFrames().map((frame) => frame.getComponent().getEl()!);
    const els = Array.isArray(el) ? el : [el];
    this.el = els[0];
    this.counter = 0;
    bindAll(this, 'handleDragEnter', 'handleDragOver', 'handleDrop', 'handleDragLeave', 'handleDragEnd');
    els.forEach((el) => this.toggleEffects(el, true));
  }

  toggleEffects(el: HTMLElement, enable: boolean) {
    const methods = { on, off };
    const method = enable ? 'on' : 'off';
    methods[method](el, 'dragenter', this.handleDragEnter);
    methods[method](el, 'dragover', this.handleDragOver);
    methods[method](el, 'drop', this.handleDrop);
    methods[method](el, 'dragleave', this.handleDragLeave);
  }

  __customTglEff(enable: boolean) {
    const method = enable ? on : off;
    const doc = this.el.ownerDocument;
    const frameEl = doc.defaultView?.frameElement as HTMLIFrameElement;
    const getSorterOptions: (sorter: any) => Record<string, any> = (sorter: any) => ({
      legacyOnStartSort() {
        on(frameEl, 'pointermove', sorter.onMove);
      },
      legacyOnEnd() {
        off(frameEl, 'pointermove', sorter.onMove);
      },
      customTarget({ event }: SorterOptions) {
        return doc.elementFromPoint(event.clientX, event.clientY);
      },
    });

    this.getSorterOptions = enable ? getSorterOptions : undefined;
    method(frameEl, 'pointerenter', this.handleDragEnter);
    method(frameEl, 'pointermove', this.handleDragOver);
    method(document, 'pointerup', this.handleDrop);
    method(frameEl, 'pointerout', this.handleDragLeave);

    // Test with touch devices (seems like frameEl is not capturing pointer events).
    // on/off(document, 'pointermove', sorter.onMove); // for the sorter
    // enable && this.handleDragEnter({}); // no way to use pointerenter/pointerout
  }

  startCustom() {
    this.__customTglEff(true);
  }

  endCustom(cancel?: boolean) {
    this.over ? this.endDrop(cancel) : this.__customTglEff(false);
  }

  /**
   * This function is expected to be always executed at the end of d&d.
   */
  endDrop(cancel?: boolean, ev?: Event) {
    const { em, dragStop } = this;
    this.counter = 0;
    dragStop && dragStop(cancel || !this.over);
    this.__customTglEff(false);
    em.trigger('canvas:dragend', ev);
  }

  handleDragLeave(ev: Event) {
    this.updateCounter(-1, ev);
  }

  updateCounter(value: number, ev: Event) {
    this.counter += value;
    this.counter === 0 && this.endDrop(true, ev);
  }

  handleDragEnter(ev: DragEvent | Event) {
    const { em, canvas } = this;
    const dt = (ev as DragEvent).dataTransfer;
    const dragSourceOrigin: DragSource<Component> = em.get('dragSource');

    if (!dragSourceOrigin?.content && !canvas.getConfig().allowExternalDrop) {
      return;
    }

    this.updateCounter(1, ev);
    if (this.over) return;
    this.over = true;
    const utils = em.Utils;
    // For security reason I can't read the drag data on dragenter, but
    // as I need it for the Sorter context I will use `dragSource` or just
    // any not empty element
    let content = dragSourceOrigin?.content || '<br>';
    let dragStop: DragStop;
    em.stopDefault();

    // Select the right drag provider
    if (em.inAbsoluteMode()) {
      const wrapper = em.Components.getWrapper()!;
      const target = wrapper.append({})[0];
      const dragger = em.Commands.run('core:component-drag', {
        event: ev,
        guidesInfo: 1,
        center: 1,
        target,
        onEnd: (ev: any, dragger: any, { cancelled }: any) => {
          let comp;
          if (!cancelled && !!content) {
            comp = wrapper.append(content)[0];
            const canvasOffset = canvas.getOffset();
            const { top, left, position } = target.getStyle() as ObjectStrings;
            const scroll = getDocumentScroll(ev.target);
            const postLeft = parseInt(`${parseFloat(left) + scroll.x - canvasOffset.left}`, 10);
            const posTop = parseInt(`${parseFloat(top) + scroll.y - canvasOffset.top}`, 10);

            comp.addStyle({
              left: postLeft + 'px',
              top: posTop + 'px',
              position,
            });
          }
          this.handleDragEnd(comp, dt);
          target.remove();
        },
      });
      dragStop = (cancel?: boolean) => dragger.stop(ev, { cancel });
      this.setAbsoluteDragContent = (cnt: any) => (content = cnt);
    } else {
      const sorter = new utils.ComponentSorter({
        em,
        treeClass: CanvasNewComponentNode,
        containerContext: {
          container: this.el,
          containerSel: '*',
          itemSel: '*',
          pfx: 'gjs-',
          placeholderElement: canvas.getPlacerEl()!,
          document: this.el.ownerDocument,
        },
        dragBehavior: {
          dragDirection: DragDirection.BothDirections,
          nested: true,
        },
        positionOptions: {
          windowMargin: 1,
          canvasRelative: true,
        },
        eventHandlers: {
          legacyOnEndMove: this.handleDragEnd,
        },
      });
      const sorterOptions = this.getSorterOptions?.(sorter);
      if (sorterOptions) {
        sorter.eventHandlers.legacyOnStartSort = sorterOptions.legacyOnStart;
        sorter.eventHandlers.legacyOnEnd = sorterOptions.legacyOnEnd;
        sorter.containerContext.customTarget = sorterOptions.customTarget;
      }
      const shallowCmp = em.Components.getShallowWrapper();
      const model = shallowCmp?.append(content, { temporary: true })[0];
      const element = model?.getEl();
      const sources = [{ element, dragSource: { model, ...dragSourceOrigin } }];
      sorter.startSort(sources);
      this.sorter = sorter;
      this.draggedNode = sorter.sourceNodes?.[0];
      dragStop = (cancel?: boolean) => {
        if (cancel) {
          sorter.cancelDrag();
        } else {
          sorter.endDrag();
        }
      };
    }

    this.dragStop = dragStop;
    em.trigger('canvas:dragenter', dt, content);
  }

  handleDragEnd(model: any, dt: any) {
    const { em } = this;
    this.over = false;
    if (model) {
      em.set('dragResult', model);
      em.trigger('canvas:drop', dt, model);
    }
    em.runDefault({ preserveSelected: 1 });
  }

  /**
   * Always need to have this handler active for enabling the drop
   * @param {Event} ev
   */
  handleDragOver(ev: Event) {
    ev.preventDefault();
    this.em.trigger('canvas:dragover', ev);
  }

  /**
   * WARNING: This function might fail to run on drop, for example, when the
   * drop, accidentally, happens on some external element (DOM not inside the iframe)
   */
  handleDrop(ev: Event | DragEvent) {
    ev.preventDefault();
    const dt = (ev as DragEvent).dataTransfer;
    const content = this.getContentByData(dt!).content || '';
    if (this.draggedNode) {
      this.draggedNode.content = content;
    }
    this.setAbsoluteDragContent?.(content);
    this.endDrop(!content, ev);
  }

  getContentByData(dt?: DataTransfer) {
    const em = this.em;
    const types = dt?.types || [];
    const files = dt?.files || [];
    const dragSource: DragSource<Component> = em.get('dragSource');
    let content: DraggableContent['content'] = dt?.getData('text') || '';

    if (files.length) {
      content = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const type = file.type.split('/')[0];

        if (type == 'image') {
          content.push({
            type,
            file,
            attributes: { alt: file.name },
          });
        }
      }
    } else if (dragSource?.content) {
      content = dragSource.content;
    } else if (indexOf(types, 'text/html') >= 0) {
      content = dt && dt.getData('text/html').replace(/<\/?meta[^>]*>/g, '');
    } else if (indexOf(types, 'text/uri-list') >= 0) {
      content = {
        type: 'link',
        attributes: { href: content },
        content: content,
      };
    } else if (indexOf(types, 'text/json') >= 0) {
      const json = dt && dt.getData('text/json');
      json && (content = JSON.parse(json));
    } else if (types.length === 1 && types[0] === 'text/plain') {
      // Avoid dropping non-selectable and non-editable text nodes inside the editor
      content = `<div>${content}</div>`;
    }

    const result = {
      content,
      setContent(content: DraggableContent['content']) {
        result.content = content;
      },
    };
    em.trigger('canvas:dragdata', dt, result);
    return result;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extender.ts]---
Location: grapesjs-dev/packages/core/src/utils/extender.ts

```typescript
import { isObject } from 'underscore';

export default ({ $ }: { $: any }) => {
  if ($ && $.prototype && $.prototype.constructor.name !== 'jQuery') {
    const fn = $.fn;

    // Additional helpers

    fn.hide = function () {
      return this.css('display', 'none');
    };

    fn.show = function () {
      return this.css('display', 'block');
    };

    fn.focus = function () {
      const el = this.get(0);
      el && el.focus();
      return this;
    };

    // For spectrum compatibility

    fn.bind = function (ev: any, h: any) {
      return this.on(ev, h);
    };

    fn.unbind = function (ev: any, h: any) {
      if (isObject(ev)) {
        for (let name in ev) {
          ev.hasOwnProperty(name) && this.off(name, ev[name]);
        }

        return this;
      } else {
        return this.off(ev, h);
      }
    };

    fn.click = function (h: any) {
      return h ? this.on('click', h) : this.trigger('click');
    };

    fn.change = function (h: any) {
      return h ? this.on('change', h) : this.trigger('change');
    };

    fn.keydown = function (h: any) {
      return h ? this.on('keydown', h) : this.trigger('keydown');
    };

    fn.delegate = function (selector: any, events: any, data: any, handler: any) {
      if (!handler) {
        handler = data;
      }

      return this.on(events, selector, function (e: any) {
        e.data = data;
        handler(e);
      });
    };

    fn.scrollLeft = function () {
      let el = this.get(0);
      el = el.nodeType == 9 ? el.defaultView : el;
      let win = el instanceof Window ? el : null;
      return win ? win.pageXOffset : el.scrollLeft || 0;
    };

    fn.scrollTop = function () {
      let el = this.get(0);
      el = el.nodeType == 9 ? el.defaultView : el;
      let win = el instanceof Window ? el : null;
      return win ? win.pageYOffset : el.scrollTop || 0;
    };

    const offset = $.prototype.offset;
    fn.offset = function (coords: any) {
      let top, left;

      if (coords) {
        top = coords.top;
        left = coords.left;
      }

      if (typeof top != 'undefined') {
        this.css('top', `${top}px`);
      }
      if (typeof left != 'undefined') {
        this.css('left', `${left}px`);
      }

      return offset.call(this);
    };

    $.map = function (items: any, clb: any) {
      const ar = [];

      for (var i = 0; i < items.length; i++) {
        ar.push(clb(items[i], i));
      }

      return ar;
    };

    const indexOf = Array.prototype.indexOf;

    $.inArray = function (val: any, arr: any, i: any) {
      return arr == null ? -1 : indexOf.call(arr, val, i);
    };

    $.Event = function (src: any, props: any) {
      if (!(this instanceof $.Event)) {
        return new $.Event(src, props);
      }

      this.type = src;
      this.isDefaultPrevented = () => false;
    };
  }
};
```

--------------------------------------------------------------------------------

---[FILE: fetch.ts]---
Location: grapesjs-dev/packages/core/src/utils/fetch.ts

```typescript
// @ts-ignore avoid errors during TS build
import Promise from 'promise-polyfill';
import { hasWin } from './mixins';

if (hasWin()) {
  window.Promise = window.Promise || Promise;
}

export default typeof fetch == 'function'
  ? // @ts-ignore
    fetch.bind()
  : (url: string, options: Record<string, any>) => {
      // @ts-ignore avoid errors during TS build
      return new Promise((res, rej) => {
        const req = new XMLHttpRequest();
        req.open(options.method || 'get', url);
        req.withCredentials = options.credentials == 'include';

        for (let k in options.headers || {}) {
          req.setRequestHeader(k, options.headers[k]);
        }

        req.onload = (e) =>
          res({
            status: req.status,
            statusText: req.statusText,
            text: () => Promise.resolve(req.responseText),
          });
        req.onerror = rej;

        // Actually, fetch doesn't support onProgress feature
        if (req.upload && options.onProgress) {
          req.upload.onprogress = options.onProgress;
        }

        // Include body only if present
        options.body ? req.send(options.body) : req.send();
      });
    };
```

--------------------------------------------------------------------------------

---[FILE: host-name.ts]---
Location: grapesjs-dev/packages/core/src/utils/host-name.ts

```typescript
export function getHostName() {
  return window.location.hostname;
}
```

--------------------------------------------------------------------------------

---[FILE: html.ts]---
Location: grapesjs-dev/packages/core/src/utils/html.ts

```typescript
import { escape } from './mixins';

/**
 * Safe ES6 tagged template strings
 * @param {Array<String>} literals
 * @param  {Array<String>} substs
 * @returns {String}
 * @example
 * const str = '<b>Hello</b>';
 * const strHtml = html`Escaped ${str}, unescaped $${str}`;
 */
export default function html(literals: TemplateStringsArray, ...substs: string[]) {
  const { raw } = literals;

  return raw.reduce((acc, lit, i) => {
    let subst = substs[i - 1];
    const last = raw[i - 1];

    if (Array.isArray(subst)) {
      subst = subst.join('');
    } else if (last && last.slice(-1) === '$') {
      // If the interpolation is preceded by a dollar sign, it won't be escaped
      acc = acc.slice(0, -1);
    } else {
      subst = escape(subst);
    }

    return acc + subst + lit;
  });
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/utils/index.ts

```typescript
import Dragger from './Dragger';
import Resizer from './Resizer';
import * as mixins from './mixins';
import { Module } from '../abstract';
import EditorModel from '../editor/model/Editor';
import ComponentSorter from './sorter/ComponentSorter';
import StyleManagerSorter from './sorter/StyleManagerSorter';

export default class UtilsModule extends Module {
  Sorter = ComponentSorter;
  Resizer = Resizer;
  Dragger = Dragger;
  ComponentSorter = ComponentSorter;
  StyleManagerSorter = StyleManagerSorter;
  helpers = { ...mixins };

  constructor(em: EditorModel) {
    super(em, 'Utils');
  }

  destroy() {}
}
```

--------------------------------------------------------------------------------

````
