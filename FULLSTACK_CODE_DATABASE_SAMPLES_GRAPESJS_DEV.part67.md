---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 67
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 67 of 97)

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

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/undo_manager/index.ts
Signals: TypeORM

```typescript
/**
 * This module allows to manage the stack of changes applied in canvas.
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance
 *
 * ```js
 * const um = editor.UndoManager;
 * ```
 *
 * * [getConfig](#getconfig)
 * * [add](#add)
 * * [remove](#remove)
 * * [removeAll](#removeall)
 * * [start](#start)
 * * [stop](#stop)
 * * [undo](#undo)
 * * [undoAll](#undoall)
 * * [redo](#redo)
 * * [redoAll](#redoall)
 * * [hasUndo](#hasundo)
 * * [hasRedo](#hasredo)
 * * [getStack](#getstack)
 * * [clear](#clear)
 *
 * @module UndoManager
 */
// @ts-ignore
import UndoManager from 'backbone-undo';
import { isArray, isBoolean, isEmpty, unique, times } from 'underscore';
import { Module } from '../abstract';
import EditorModel from '../editor/model/Editor';
import defConfig, { UndoManagerConfig } from './config';
import { EditorEvents } from '../editor/types';

export interface UndoGroup {
  index: number;
  actions: any[];
  labels: string[];
}

const hasSkip = (opts: any) => opts.avoidStore || opts.noUndo || opts.partial;

const getChanged = (obj: any) => Object.keys(obj.changedAttributes());

const changedMap = new WeakMap();

export default class UndoManagerModule extends Module<UndoManagerConfig & { name?: string; _disable?: boolean }> {
  beforeCache?: any;
  um: any;

  constructor(em: EditorModel) {
    super(em, 'UndoManager', defConfig());

    if (this.config._disable) {
      this.config.maximumStackLength = 0;
    }

    const fromUndo = true;
    this.um = new UndoManager({ track: true, register: [], ...this.config });
    this.um.changeUndoType('change', {
      condition: (object: any) => {
        const hasUndo = object.get('_undo');
        if (hasUndo) {
          const undoExc = object.get('_undoexc');
          if (isArray(undoExc)) {
            if (getChanged(object).some((chn) => undoExc.indexOf(chn) >= 0)) return false;
          }
          if (isBoolean(hasUndo)) return true;
          if (isArray(hasUndo)) {
            if (getChanged(object).some((chn) => hasUndo.indexOf(chn) >= 0)) return true;
          }
        }
        return false;
      },
      on(object: any, v: any, opts: any) {
        let before = changedMap.get(object);
        if (!before) {
          before = object.previousAttributes();
          changedMap.set(object, before);
        }
        const opt = opts || v || {};

        if (opt.noUndo) {
          setTimeout(() => {
            changedMap.delete(object);
          });
        }

        if (hasSkip(opt)) {
          return;
        } else {
          const after = object.toJSON({ fromUndo });
          const result = {
            object,
            before,
            after,
          };
          changedMap.delete(object);
          // Skip undo in case of empty changes
          if (isEmpty(after)) return;

          return result;
        }
      },
    });
    this.um.changeUndoType('add', {
      on: (model: any, collection: any, options = {}) => {
        if (hasSkip(options) || !this.isRegistered(collection)) return;
        return {
          object: collection,
          before: undefined,
          after: model,
          options: { ...options, fromUndo },
        };
      },
    });
    this.um.changeUndoType('remove', {
      on: (model: any, collection: any, options = {}) => {
        if (hasSkip(options) || !this.isRegistered(collection)) return;
        return {
          object: collection,
          before: model,
          after: undefined,
          options: { ...options, fromUndo },
        };
      },
    });
    this.um.changeUndoType('reset', {
      undo: (collection: any, before: any) => {
        collection.reset(before, { fromUndo });
      },
      redo: (collection: any, b: any, after: any) => {
        collection.reset(after, { fromUndo });
      },
      on: (collection: any, options: any = {}) => {
        if (hasSkip(options) || !this.isRegistered(collection)) return;
        return {
          object: collection,
          before: options.previousModels,
          after: [...collection.models],
          options: { ...options, fromUndo },
        };
      },
    });

    this.um.on('undo redo', () => {
      em.getSelectedAll().map((c) => c.trigger('rerender:layer'));
    });
    [EditorEvents.undo, EditorEvents.redo].forEach((ev) => this.um.on(ev, () => em.trigger(ev)));
  }

  postLoad() {
    const { config, em } = this;
    config.trackSelection && em && this.add(em.get('selected'));
  }

  /**
   * Get configuration object
   * @name getConfig
   * @function
   * @return {Object}
   */

  /**
   * Add an entity (Model/Collection) to track
   * Note: New Components and CSSRules will be added automatically
   * @param {Model|Collection} entity Entity to track
   * @return {this}
   * @example
   * um.add(someModelOrCollection);
   */
  add(entity: any) {
    this.um.register(entity);
    return this;
  }

  /**
   * Remove and stop tracking the entity (Model/Collection)
   * @param {Model|Collection} entity Entity to remove
   * @return {this}
   * @example
   * um.remove(someModelOrCollection);
   */
  remove(entity: any) {
    this.um.unregister(entity);
    return this;
  }

  /**
   * Remove all entities
   * @return {this}
   * @example
   * um.removeAll();
   */
  removeAll() {
    this.um.unregisterAll();
    return this;
  }

  /**
   * Start/resume tracking changes
   * @return {this}
   * @example
   * um.start();
   */
  start() {
    this.um.startTracking();
    return this;
  }

  /**
   * Stop tracking changes
   * @return {this}
   * @example
   * um.stop();
   */
  stop() {
    this.um.stopTracking();
    return this;
  }

  /**
   * Undo last change
   * @return {this}
   * @example
   * um.undo();
   */
  undo(all = true) {
    const { em, um } = this;
    !em.isEditing() && um.undo(all);
    return this;
  }

  /**
   * Undo all changes
   * @return {this}
   * @example
   * um.undoAll();
   */
  undoAll() {
    this.um.undoAll();
    return this;
  }

  /**
   * Redo last change
   * @return {this}
   * @example
   * um.redo();
   */
  redo(all = true) {
    const { em, um } = this;
    !em.isEditing() && um.redo(all);
    return this;
  }

  /**
   * Redo all changes
   * @return {this}
   * @example
   * um.redoAll();
   */
  redoAll() {
    this.um.redoAll();
    return this;
  }

  /**
   * Checks if exists an available undo
   * @return {Boolean}
   * @example
   * um.hasUndo();
   */
  hasUndo() {
    return !!this.um.isAvailable('undo');
  }

  /**
   * Checks if exists an available redo
   * @return {Boolean}
   * @example
   * um.hasRedo();
   */
  hasRedo() {
    return !!this.um.isAvailable('redo');
  }

  /**
   * Check if the entity (Model/Collection) to tracked
   * Note: New Components and CSSRules will be added automatically
   * @param {Model|Collection} entity Entity to track
   * @returns {Boolean}
   */
  isRegistered(obj: any) {
    return !!this.getInstance().objectRegistry.isRegistered(obj);
  }

  /**
   * Get stack of changes
   * @return {Collection}
   * @example
   * const stack = um.getStack();
   * stack.each(item => ...);
   */
  getStack(): any[] {
    return this.um.stack;
  }

  /**
   * Get grouped undo manager stack.
   * The difference between `getStack` is when you do multiple operations at a time,
   * like appending multiple components:
   * `editor.getWrapper().append('<div>C1</div><div>C2</div>');`
   * `getStack` will return a collection length of 2.
   *  `getStackGroup` instead will group them as a single operation (the first
   * inserted component will be returned in the list) by returning an array length of 1.
   * @return {Array}
   * @private
   */
  getStackGroup() {
    const result: any = [];
    const inserted: any = [];

    this.getStack().forEach((item: any) => {
      const index = item.get('magicFusionIndex');
      if (inserted.indexOf(index) < 0) {
        inserted.push(index);
        result.push(item);
      }
    });

    return result;
  }

  /**
   * Execute the provided callback temporarily stopping tracking changes
   * @param clb The callback to execute with changes tracking stopped
   * @example
   * um.skip(() => {
   *  // Do stuff without tracking
   * });
   */
  skip(clb: Function) {
    const isTracking = !!this.um.isTracking();

    isTracking && this.stop();
    clb();
    isTracking && this.start();
  }

  getGroupedStack(): UndoGroup[] {
    const result: Record<string, any> = {};
    const stack = this.getStack();
    const createItem = (item: any, index: number) => {
      const { type, after, before, object, options = {} } = item.attributes;
      return { index, type, after, before, object, options };
    };
    stack.forEach((item, i) => {
      const index = item.get('magicFusionIndex');
      const value = createItem(item, i);

      if (!result[index]) {
        result[index] = [value];
      } else {
        result[index].push(value);
      }
    });

    return Object.keys(result).map((index) => {
      const actions = result[index];
      return {
        index: actions[actions.length - 1].index,
        actions,
        labels: unique(
          actions.reduce((res: any, item: any) => {
            const label = item.options?.action;
            label && res.push(label);
            return res;
          }, []),
        ),
      };
    });
  }

  goToGroup(group: UndoGroup) {
    if (!group) return;
    const current = this.getPointer();
    const goTo = group.index - current;
    times(Math.abs(goTo), () => {
      this[goTo < 0 ? 'undo' : 'redo'](false);
    });
  }

  getPointer(): number {
    // @ts-ignore
    return this.getStack().pointer;
  }

  /**
   * Clear the stack
   * @return {this}
   * @example
   * um.clear();
   */
  clear() {
    this.um.clear();
    return this;
  }

  getInstance() {
    return this.um;
  }

  destroy() {
    this.clear().removeAll();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: AutoScroller.ts]---
Location: grapesjs-dev/packages/core/src/utils/AutoScroller.ts

```typescript
import { bindAll } from 'underscore';
import { getPointerEvent, off, on } from './dom';

export default class AutoScroller {
  private eventEl?: HTMLElement; // Element that handles mouse events
  private scrollEl?: HTMLElement | Window; // Element that will be scrolled
  private dragging: boolean = false;
  private lastClientY?: number;
  private lastMaxHeight: number = 0;
  private onScroll?: () => void;
  private autoscrollLimit: number;
  private zoom: number = 1;
  /**
   * When an element is inside an iframe, its `getBoundingClientRect()` values
   * are relative to the iframe's document, not the main window's.
   */
  private rectIsInScrollIframe: boolean = false;
  private ignoredElement?: HTMLElement; // If the mouse is over this element, don't autoscroll

  constructor(
    autoscrollLimit: number = 50,
    opts?: {
      lastMaxHeight?: number;
      onScroll?: () => void;
      rectIsInScrollIframe?: boolean;
    },
  ) {
    this.autoscrollLimit = autoscrollLimit;
    this.lastMaxHeight = opts?.lastMaxHeight ?? 0;
    this.onScroll = opts?.onScroll;
    this.rectIsInScrollIframe = !!opts?.rectIsInScrollIframe;
    bindAll(this, 'start', 'autoscroll', 'updateClientY', 'stop');
  }

  start(
    eventEl: HTMLElement,
    scrollEl: HTMLElement | Window,
    opts?: {
      lastMaxHeight?: number;
      zoom?: number;
      ignoredElement?: HTMLElement;
    },
  ) {
    this.eventEl = eventEl;
    this.scrollEl = scrollEl;
    this.lastMaxHeight = opts?.lastMaxHeight || Number.POSITIVE_INFINITY;
    this.zoom = opts?.zoom || 1;
    this.ignoredElement = opts?.ignoredElement;

    // By detaching those from the stack avoid browsers lags
    // Noticeable with "fast" drag of blocks
    setTimeout(() => {
      this.toggleAutoscrollFx(true);
      requestAnimationFrame(this.autoscroll);
    }, 0);
  }

  private autoscroll() {
    const scrollEl = this.scrollEl;
    if (!this.dragging || !scrollEl) return;
    if (this.lastClientY === undefined) {
      setTimeout(() => {
        requestAnimationFrame(this.autoscroll);
      }, 50);
      return;
    }

    const clientY = this.lastClientY ?? 0;
    const limitTop = this.autoscrollLimit;
    const eventElHeight = this.getEventElHeight();
    const limitBottom = eventElHeight - limitTop;
    let scrollAmount = 0;

    if (clientY < limitTop) scrollAmount += clientY - limitTop;
    if (clientY > limitBottom) scrollAmount += clientY - limitBottom;

    const scrollTop = this.getElScrollTop(scrollEl);
    scrollAmount = Math.min(scrollAmount, this.lastMaxHeight - scrollTop);
    scrollAmount = Math.max(scrollAmount, -scrollTop);
    if (scrollAmount !== 0) {
      scrollEl.scrollBy({ top: scrollAmount, behavior: 'auto' });
      this.onScroll?.();
    }

    requestAnimationFrame(this.autoscroll);
  }

  private getEventElHeight() {
    const eventEl = this.eventEl;
    if (!eventEl) return 0;

    const elRect = eventEl.getBoundingClientRect();
    return elRect.height;
  }

  private updateClientY(ev: Event) {
    const target = ev.target as HTMLElement;

    if (this.ignoredElement && this.ignoredElement.contains(target)) {
      return;
    }

    const scrollEl = this.scrollEl;
    ev.preventDefault();

    const scrollTop = !this.rectIsInScrollIframe ? this.getElScrollTop(scrollEl) : 0;
    this.lastClientY = getPointerEvent(ev).clientY * this.zoom - scrollTop;
  }

  private getElScrollTop(scrollEl: HTMLElement | Window | undefined) {
    return (scrollEl instanceof HTMLElement ? scrollEl.scrollTop : scrollEl?.scrollY) || 0;
  }

  private toggleAutoscrollFx(enable: boolean) {
    this.dragging = enable;
    const eventEl = this.eventEl;
    if (!eventEl) return;
    const method = enable ? 'on' : 'off';
    const mt = { on, off };
    mt[method](eventEl, 'mousemove dragover', this.updateClientY);
    mt[method](eventEl, 'mouseup', this.stop);
  }

  stop() {
    this.toggleAutoscrollFx(false);
    this.lastClientY = undefined;
    this.ignoredElement = undefined;
  }
}
```

--------------------------------------------------------------------------------

````
