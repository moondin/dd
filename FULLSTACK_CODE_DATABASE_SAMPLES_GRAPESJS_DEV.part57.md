---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 57
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 57 of 97)

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
Location: grapesjs-dev/packages/core/src/selector_manager/index.ts

```typescript
/**
 * Selectors in GrapesJS are used in CSS Composer inside Rules and in Components as classes. To illustrate this concept let's take
 * a look at this code:
 *
 * ```css
 * span > #send-btn.btn{
 *  ...
 * }
 * ```
 * ```html
 * <span>
 *   <button id="send-btn" class="btn"></button>
 * </span>
 * ```
 *
 * In this scenario we get:
 * * span     -> selector of type `tag`
 * * send-btn -> selector of type `id`
 * * btn      -> selector of type `class`
 *
 * So, for example, being `btn` the same class entity it'll be easier to refactor and track things.
 *
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/selector_manager/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  selectorManager: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance.
 *
 * ```js
 * const sm = editor.Selectors;
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * ## Methods
 * * [getConfig](#getconfig)
 * * [add](#add)
 * * [get](#get)
 * * [remove](#remove)
 * * [rename](#rename)
 * * [getAll](#getall)
 * * [setState](#setstate)
 * * [getState](#getstate)
 * * [getStates](#getstates)
 * * [setStates](#setstates)
 * * [getSelected](#getselected)
 * * [addSelected](#addselected)
 * * [removeSelected](#removeselected)
 * * [getSelectedTargets](#getselectedtargets)
 * * [setComponentFirst](#setcomponentfirst)
 * * [getComponentFirst](#getcomponentfirst)
 *
 * [Selector]: selector.html
 * [State]: state.html
 * [Component]: component.html
 * [CssRule]: css_rule.html
 *
 * @module Selectors
 */

import { bindAll, debounce, isArray, isObject, isString } from 'underscore';
import { ItemManagerModule } from '../abstract/Module';
import { Collection, Debounced, Model, RemoveOptions, SetOptions } from '../common';
import Component from '../dom_components/model/Component';
import { ComponentsEvents } from '../dom_components/types';
import StyleableModel from '../domain_abstract/model/StyleableModel';
import EditorModel from '../editor/model/Editor';
import { StyleModuleParam } from '../style_manager';
import { isComponent, isRule } from '../utils/mixins';
import defConfig, { SelectorManagerConfig } from './config/config';
import Selector from './model/Selector';
import Selectors from './model/Selectors';
import State from './model/State';
import { SelectorEvents, SelectorStringObject } from './types';
import ClassTagsView from './view/ClassTagsView';

export type SelectorEvent = `${SelectorEvents}`;

const isId = (str: string) => isString(str) && str[0] == '#';
const isClass = (str: string) => isString(str) && str[0] == '.';

export default class SelectorManager extends ItemManagerModule<SelectorManagerConfig & { pStylePrefix?: string }> {
  Selector = Selector;

  Selectors = Selectors;

  model: Model;
  states: Collection<State>;
  selectorTags?: ClassTagsView;
  selected: Selectors;
  all: Selectors;
  events = SelectorEvents;
  storageKey = '';
  __update: Debounced;
  __ctn?: HTMLElement;
  /**
   * Get configuration object
   * @name getConfig
   * @function
   * @return {Object}
   */

  constructor(em: EditorModel) {
    super(em, 'SelectorManager', new Selectors([]), SelectorEvents, defConfig(), { skipListen: true });
    bindAll(this, '__updateSelectedByComponents');
    const { config, events } = this;
    const ppfx = config.pStylePrefix;
    if (ppfx) config.stylePrefix = ppfx + config.stylePrefix;

    this.all = new Selectors(config.selectors);
    this.selected = new Selectors([], { em, config });
    this.states = new Collection<State>(
      config.states!.map((state: any) => new State(state)),
      { model: State },
    );
    this.model = new Model({ cFirst: config.componentFirst, _undo: true });
    this.__update = debounce(() => this.__trgCustom(), 0);
    this.__initListen({
      collections: [this.states, this.selected],
      propagate: [{ entity: this.states, event: events.state }],
    });
    em.on('change:state', (m, value) => em.trigger(events.state, value));
    this.model.on('change:cFirst', (m, value) => em.trigger('selector:type', value));
    const eventCmpUpdateCls = `${ComponentsEvents.update}:classes`;
    em.on(`component:toggled ${eventCmpUpdateCls}`, this.__updateSelectedByComponents);
    const listenTo = `component:toggled ${eventCmpUpdateCls} change:device styleManager:update selector:state selector:type style:target`;
    this.model.listenTo(em, listenTo, () => this.__update());
  }

  __trgCustom(opts?: any) {
    this.em.trigger(this.events.custom, this.__customData(opts));
  }

  getAll<T extends { array?: boolean }>(opts: T = {} as T) {
    return (this.all ? (opts.array ? [...this.all.models] : this.all) : []) as T['array'] extends true
      ? Selector[]
      : Selectors;
  }

  __customData(opts: any = {}) {
    this.__ctn = this.__ctn || opts.container;
    return {
      states: this.getStates(),
      selected: this.getSelected(),
      container: this.__ctn,
    };
  }

  postRender() {
    this.__appendTo();
    this.__trgCustom();
  }

  select(value: StyleModuleParam<'select', 0>, opts: StyleModuleParam<'select', 1> = {}) {
    const targets = Array.isArray(value) ? value : [value];
    const toSelect: any[] = this.em.Styles.select(targets, opts);
    this.selected.reset(this.__getCommonSelectors(toSelect));
    const selTags = this.selectorTags;
    const res = toSelect
      .filter((i) => i)
      .map((sel) =>
        isComponent(sel) ? sel : isRule(sel) && !sel.get('selectorsAdd') ? sel : sel.getSelectorsString(),
      );
    selTags && selTags.componentChanged({ targets: res });
    return this;
  }

  addSelector(name: SelectorStringObject | Selector, opts = {}, cOpts = {}): Selector {
    let props: any = { ...opts };

    if (isObject(name)) {
      props = name;
    } else {
      props.name = name;
    }

    if (isId(props.name)) {
      props.name = props.name.substr(1);
      props.type = Selector.TYPE_ID;
    } else if (isClass(props.name)) {
      props.name = props.name.substr(1);
    }

    if (props.label && !props.name) {
      props.name = this.escapeName(props.label);
    }

    const { all, em, config } = this;
    const selector = all.get(props);

    if (!selector) {
      const selModel = props instanceof Selector ? props : new Selector(props, { ...cOpts, config, em });
      return all.add(selModel, cOpts);
    }

    return selector;
  }

  getSelector(name: string, type = Selector.TYPE_CLASS): Selector | undefined {
    if (isId(name)) {
      name = name.substr(1);
      type = Selector.TYPE_ID;
    } else if (isClass(name)) {
      name = name.substr(1);
    }

    return this.all.get({ name, type } as any);
  }

  /**
   * Add a new selector to the collection if it does not already exist.
   * You can pass selectors properties or string identifiers.
   * @param {Object|String} props Selector properties or string identifiers, eg. `{ name: 'my-class', label: 'My class' }`, `.my-cls`
   * @param {Object} [opts] Selector options
   * @return {[Selector]}
   * @example
   * const selector = selectorManager.add({ name: 'my-class', label: 'My class' });
   * console.log(selector.toString()) // `.my-class`
   * // Same as
   * const selector = selectorManager.add('.my-class');
   * console.log(selector.toString()) // `.my-class`
   * */
  add(props: SelectorStringObject, opts = {}) {
    const cOpts = isString(props) ? {} : opts;
    // Keep support for arrays but avoid it in docs
    if (isArray(props)) {
      return props.map((item) => this.addSelector(item, opts, cOpts));
    } else {
      return this.addSelector(props, opts, cOpts);
    }
  }

  /**
   * Add class selectors
   * @param {Array|string} classes Array or string of classes
   * @return {Array} Array of added selectors
   * @private
   * @example
   * sm.addClass('class1');
   * sm.addClass('class1 class2');
   * sm.addClass(['class1', 'class2']);
   * // -> [SelectorObject, ...]
   */
  addClass(classes: string | string[]) {
    const added: Selector[] = [];

    if (isString(classes)) {
      classes = classes.trim().split(' ').filter(Boolean);
    }

    classes.forEach((name) => added.push(this.addSelector(name) as Selector));
    return added;
  }

  /**
   * Get the selector by its name/type
   * @param {String} name Selector name or string identifier
   * @returns {[Selector]|null}
   * @example
   * const selector = selectorManager.get('.my-class');
   * // Get Id
   * const selectorId = selectorManager.get('#my-id');
   * */
  get<T extends string | string[]>(name: T, type?: number): T extends string[] ? Selector[] : Selector | undefined {
    // Keep support for arrays but avoid it in docs
    if (isArray(name)) {
      const result: Selector[] = [];
      const selectors = name.map((item) => this.getSelector(item)).filter(Boolean) as Selector[];
      selectors.forEach((item) => result.indexOf(item) < 0 && result.push(item));
      // @ts-ignore
      return result;
    } else {
      // @ts-ignore
      return this.getSelector(name, type)!;
    }
  }

  /**
   * Remove Selector.
   * @param {String|[Selector]} selector Selector instance or Selector string identifier
   * @returns {[Selector]} Removed Selector
   * @example
   * const removed = selectorManager.remove('.myclass');
   * // or by passing the Selector
   * selectorManager.remove(selectorManager.get('.myclass'));
   */
  remove(selector: string | Selector, opts?: RemoveOptions) {
    return this.__remove(selector, opts);
  }

  /**
   * Rename Selector.
   * @param {[Selector]} selector Selector to update.
   * @param {String} name New name for the selector.
   * @returns {[Selector]} Selector containing the passed name.
   * @example
   * const selector = selectorManager.get('myclass');
   * const result = selectorManager.rename(selector, 'myclass2');
   * console.log(result === selector ? 'Selector updated' : 'Selector with this name exists already');
   */
  rename(selector: Selector, name: string, opts?: SetOptions) {
    const newName = this.escapeName(name);
    const result = this.get(newName);

    return result || selector.set({ name: newName, label: name }, opts);
  }

  /**
   * Change the selector state
   * @param {String} value State value
   * @returns {this}
   * @example
   * selectorManager.setState('hover');
   */
  setState(value: string) {
    this.em.setState(value);
    return this;
  }

  /**
   * Get the current selector state value
   * @returns {String}
   */
  getState() {
    return this.em.getState();
  }

  /**
   * Get states
   * @returns {Array<[State]>}
   */
  getStates() {
    return [...this.states.models];
  }

  /**
   * Set a new collection of states
   * @param {Array<Object>} states Array of new states
   * @returns {Array<[State]>}
   * @example
   * const states = selectorManager.setStates([
   *   { name: 'hover', label: 'Hover' },
   *   { name: 'nth-of-type(2n)', label: 'Even/Odd' }
   * ]);
   */
  setStates(states: State[], opts?: any) {
    return this.states.reset(
      states.map((state) => new State(state)),
      opts,
    );
  }

  /**
   * Get commonly selected selectors, based on all selected components.
   * @returns {Array<[Selector]>}
   * @example
   * const selected = selectorManager.getSelected();
   * console.log(selected.map(s => s.toString()))
   */
  getSelected() {
    return this.__getCommon();
  }

  /**
   * Get selected selectors.
   * @returns {Array<[Selector]>}
   * @example
   * const selected = selectorManager.getSelectedAll();
   * console.log(selected.map(s => s.toString()))
   */
  getSelectedAll() {
    return [...this.selected.models];
  }

  /**
   * Add new selector to all selected components.
   * @param {Object|String} props Selector properties or string identifiers, eg. `{ name: 'my-class', label: 'My class' }`, `.my-cls`
   * @example
   * selectorManager.addSelected('.new-class');
   */
  addSelected(props: SelectorStringObject) {
    const added = this.add(props);
    this.em.getSelectedAll().forEach((target) => {
      target.getSelectors().add(added);
    });
    // TODO: update selected collection
  }

  /**
   * Remove a common selector from all selected components.
   * @param {String|[Selector]} selector Selector instance or Selector string identifier
   * @example
   * selectorManager.removeSelected('.myclass');
   */
  removeSelected(selector: Selector) {
    this.em.getSelectedAll().forEach((trg) => {
      !selector.get('protected') && trg && trg.getSelectors().remove(selector);
    });
  }

  duplicateSelected(selector: Selector, opts: { suffix?: string } = {}) {
    const { em } = this;
    const commonSelectors = this.getSelected();
    if (commonSelectors.indexOf(selector) < 0) return;

    const state = this.getState();
    const media = em.getCurrentMedia();
    const rule = em.Css.get(commonSelectors, state, media);
    const styleToApply = rule?.getStyle();

    em.getSelectedAll().forEach((component) => {
      const selectors = component.getSelectors();
      if (selectors.includes(selector)) {
        const suffix = opts.suffix || ' copy';
        const label = selector.getLabel();
        const newSelector = this.addSelector(`${label}${suffix}`);
        const at = selectors.indexOf(selector);
        selectors.remove(selector);
        selectors.add(newSelector, { at });
      }
    });

    if (styleToApply) {
      const newRule = em.Css.add(this.getSelected(), state, media);
      newRule.setStyle(styleToApply);
    }
  }

  /**
   * Get the array of currently selected targets.
   * @returns {Array<[Component]|[CssRule]>}
   * @example
   * const targetsToStyle = selectorManager.getSelectedTargets();
   * console.log(targetsToStyle.map(target => target.getSelectorsString()))
   */
  getSelectedTargets(): StyleableModel[] {
    return this.em.Styles.getSelectedAll();
  }

  /**
   * Update component-first option.
   * If the component-first is enabled, all the style changes will be applied on selected components (ID rules) instead
   * of selectors (which would change styles on all components with those classes).
   * @param {Boolean} value
   */
  setComponentFirst(value: boolean) {
    this.getConfig().componentFirst = value;
    this.model.set({ cFirst: value });
  }

  /**
   * Get the value of component-first option.
   * @return {Boolean}
   */
  getComponentFirst() {
    return this.getConfig().componentFirst!;
  }

  /**
   * Get all selectors
   * @name getAll
   * @function
   * @return {Collection<[Selector]>}
   * */

  /**
   * Return escaped selector name
   * @param {String} name Selector name to escape
   * @returns {String} Escaped name
   * @private
   */
  escapeName(name: string) {
    const { escapeName } = this.getConfig();
    return escapeName ? escapeName(name) : Selector.escapeName(name);
  }

  /**
   * Render class selectors. If an array of selectors is provided a new instance of the collection will be rendered
   * @param {Array<Object>} selectors
   * @return {HTMLElement}
   * @private
   */
  render(selectors: any[]) {
    const { selectorTags } = this;
    const config = this.getConfig();
    const el = selectorTags?.el;
    this.selected.reset(selectors);
    this.selectorTags = new ClassTagsView({
      el,
      collection: this.selected,
      //@ts-ignore
      module: this,
      config,
    });

    return this.selectorTags.render().el;
  }

  destroy() {
    const { selectorTags, model } = this;
    model.stopListening();
    this.__update.cancel();
    this.__destroy();
    selectorTags?.remove();
    this.selectorTags = undefined;
  }

  // Need for the IStorableModule to run the clenup
  load() {}
  store() {}

  /**
   * Get common selectors from the current selection.
   * @return {Array<Selector>}
   * @private
   */
  __getCommon() {
    return this.__getCommonSelectors(this.em.getSelectedAll());
  }

  __getCommonSelectors(components: Component[], opts = {}) {
    const selectors = components.map((cmp) => cmp.getSelectors && cmp.getSelectors().getValid(opts)).filter(Boolean);
    return this.__common(...selectors);
  }

  __common(...args: any): Selector[] {
    if (!args.length) return [];
    if (args.length === 1) return args[0];
    if (args.length === 2) return args[0].filter((item: any) => args[1].indexOf(item) >= 0);

    return (
      args
        .slice(1)
        //@ts-ignore
        .reduce((acc, item) => this.__common(acc, item), args[0])
    );
  }

  __updateSelectedByComponents() {
    this.selected.reset(this.__getCommon());
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/selector_manager/types.ts

```typescript
/**{START_EVENTS}*/
export enum SelectorEvents {
  /**
   * @event `selector:add` Selector added. The Selector is passed as an argument to the callback.
   * @example
   * editor.on('selector:add', (selector) => { ... });
   */
  add = 'selector:add',

  /**
   * @event `selector:remove` Selector removed. The Selector is passed as an argument to the callback.
   * @example
   * editor.on('selector:remove', (selector) => { ... });
   */
  remove = 'selector:remove',

  /**
   * @event `selector:remove:before` Before selector remove. The Selector is passed as an argument to the callback.
   * @example
   * editor.on('selector:remove:before', (selector) => { ... });
   */
  removeBefore = 'selector:remove:before',

  /**
   * @event `selector:update` Selector updated. The Selector and the object containing changes are passed as arguments to the callback.
   * @example
   * editor.on('selector:update', (selector, changes) => { ... });
   */
  update = 'selector:update',

  /**
   * @event `selector:state` States changed. An object containing all the available data about the triggered event is passed as an argument to the callback.
   * @example
   * editor.on('selector:state', (state) => { ... });
   */
  state = 'selector:state',

  /**
   * @event `selector:custom` Custom selector event. An object containing states, selected selectors, and container is passed as an argument.
   * @example
   * editor.on('selector:custom', ({ states, selected, container }) => { ... });
   */
  custom = 'selector:custom',

  /**
   * @event `selector` Catch-all event for all the events mentioned above. An object containing all the available data about the triggered event is passed as an argument to the callback.
   * @example
   * editor.on('selector', ({ event, selector, changes, ... }) => { ... });
   */
  all = 'selector',
}
/**{END_EVENTS}*/

export type SelectorStringObject = string | { name?: string; label?: string; type?: number };

// need this to avoid the TS documentation generator to break
export default SelectorEvents;
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/selector_manager/config/config.ts

```typescript
/* eslint-disable */
export interface SelectorManagerConfig {
  /**
   * Style prefix.
   * @default 'clm-'
   */
  stylePrefix?: string;

  /**
   * Specify the element to use as a container, string (query) or HTMLElement.
   * With the empty value, nothing will be rendered.
   * @default ''
   */
  appendTo?: string | HTMLElement;

  /**
   * Default selectors.
   * @default []
   */
  selectors?: any[];

  /**
   * Default states.
   * @default [{ name: 'hover' }, { name: 'active' }, { name: 'nth-of-type(2n)' }]
   */
  states?: any[];

  /**
   * Custom selector name escaping strategy.
   * @example
   * escapeName: name => name.replace(' ', '_'),
   */
  escapeName?: (name: string) => string;

  /**
   * Custom selected name strategy (the string you see after 'Selected').
   * @example
   * selectedName: ({ result, state, target }) => `${result} - ID: ${target.getId()}`,
   */
  selectedName?: (props: { result: string; state: any; target: any }) => string;

  /**
   * Icon used to add new selector
   */
  iconAdd?: string;

  /**
   * Icon used to sync styles.
   */
  iconSync?: string;

  /**
   * Icon to show when the selector is enabled.
   */
  iconTagOn?: string;

  /**
   * Icon to show when the selector is disabled.
   */
  iconTagOff?: string;

  /**
   * Icon used to remove the selector.
   */
  iconTagRemove?: string;

  /**
   * Custom render function for the Selector Manager.
   * @example
   * render: ({ el, labelHead, labelStates, labelInfo, }) => {
   *  // You can use the default `el` to extend/edit the current
   *  // DOM element of the Selector Manager
   *  const someEl = document.createElement('div');
   *  // ...
   *  el.appendChild(someEl);
   *  // no need to return anything from the function
   *
   *  // Create and return a new DOM element
   *  const newEl = document.createElement('div');
   *  // ...
   *  return newEl;
   *
   *  // Return an HTML string for a completely different layout.
   *  // Use `data-*` attributes to make the module recognize some elements:
   *  // `data-states` - Where to append state `<option>` elements (or just write yours)
   *  // `data-selectors` - Where to append selectors
   *  // `data-input` - Input element which is used to add new selectors
   *  // `data-add` - Element which triggers the add of a new selector on click
   *  // `data-sync-style` - Element which triggers the sync of styles (visible with `componentFirst` enabled)
   *  // `data-selected` - Where to print selected selectors
   *  return `
   *    <div class="my-sm-header">
   *     <div>${labelHead}</div>
   *     <div>
   *       <select data-states>
   *         <option value="">${labelStates}</option>
   *       </select>
   *     </div>
   *    </div>
   *    <div class="my-sm-body">
   *      <div data-selectors></div>
   *      <input data-input/>
   *      <span data-add>Add</span>
   *      <span data-sync-style>Sync</span>
   *    </div>
   *    <div class="my-sm-info">
   *      <div>${labelInfo}</div>
   *      <div data-selected></div>
   *    </div>
   * `;
   * }
   */
  render?: (props: any) => string;

  /**
   * When you select a component in the canvas the selected Model (Component or CSS Rule)
   * is passed to the StyleManager which will be then able to be styled, these are the cases:
   * - Selected component doesn't have any classes: Component will be passed
   * - Selected component has at least one class: The CSS Rule will be passed
   *
   * With this option enabled, also in the second case, the Component will be passed.
   * This method allows to avoid styling classes directly and make, for example, some
   * unintended changes below the visible canvas area (when components share same classes).
   * @default false
   */
  componentFirst?: boolean;

  /**
   * Avoid rendering the default Selector Manager UI.
   * @default false
   */
  custom?: boolean;
}

const config: () => SelectorManagerConfig = () => ({
  stylePrefix: 'clm-',
  appendTo: '',
  selectors: [],
  states: [{ name: 'hover' }, { name: 'active' }, { name: 'nth-of-type(2n)' }],
  iconAdd: '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>',
  iconSync:
    '<svg viewBox="0 0 24 24"><path d="M12 18c-3.31 0-6-2.69-6-6 0-1 .25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4m0-11V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8z"></path></svg>',
  iconTagOn:
    '<svg viewBox="0 0 24 24"><path d="M19 19H5V5h10V3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8h-2m-11.09-.92L6.5 11.5 11 16 21 6l-1.41-1.42L11 13.17l-3.09-3.09z"></path></svg>',
  iconTagOff:
    '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"></path></svg>',
  iconTagRemove:
    '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>',
  componentFirst: false,
  custom: false,
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: Selector.ts]---
Location: grapesjs-dev/packages/core/src/selector_manager/model/Selector.ts

```typescript
import { result, forEach, keys } from 'underscore';
import { Model } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { SelectorManagerConfig } from '../config/config';

const TYPE_CLASS = 1;
const TYPE_ID = 2;

export interface SelectorProps {
  name: string;
  label?: string;
  type?: number;
  active?: boolean;
  private?: boolean;
  protected?: boolean;
}

export interface SelectorPropsCustom extends SelectorProps {
  [key: string]: unknown;
}

export interface SelectorOptions {
  config?: SelectorManagerConfig;
  em?: EditorModel;
}

/**
 * @typedef Selector
 * @property {String} name Selector name, eg. `my-class`
 * @property {String} label Selector label, eg. `My Class`
 * @property {Number} [type=1] Type of the selector. 1 (class) | 2 (id)
 * @property {Boolean} [active=true] If not active, it's not selectable by the Style Manager.
 * @property {Boolean} [private=false] If true, it can't be seen by the Style Manager, but it will be rendered in the canvas and in export code.
 * @property {Boolean} [protected=false] If true, it can't be removed from the attached component.
 */
export default class Selector extends Model<SelectorPropsCustom> {
  defaults() {
    return {
      name: '',
      label: '',
      type: TYPE_CLASS,
      active: true,
      private: false,
      protected: false,
      _undo: true,
    };
  }

  // Type selectors: https://developer.mozilla.org/it/docs/Web/CSS/CSS_Selectors
  static readonly TYPE_CLASS = TYPE_CLASS;
  static readonly TYPE_ID = TYPE_ID;

  em?: EditorModel;

  /**
   * @hideconstructor
   */
  constructor(props: SelectorPropsCustom, opts: SelectorOptions = {}) {
    super(props, opts);
    const { config = {} } = opts;
    const name = this.get('name');
    const label = this.get('label');

    if (!name) {
      this.set('name', label);
    } else if (!label) {
      this.set('label', name);
    }

    const namePreEsc = this.get('name')!;
    const { escapeName } = config;
    const nameEsc = escapeName ? escapeName(namePreEsc) : Selector.escapeName(namePreEsc);
    this.set('name', nameEsc);
    this.em = opts.em;
  }

  isId() {
    return this.get('type') === TYPE_ID;
  }

  isClass() {
    return this.get('type') === TYPE_CLASS;
  }

  getFullName(opts: any = {}) {
    const { escape } = opts;
    const name = this.get('name');
    let pfx = '';

    switch (this.get('type')) {
      case TYPE_CLASS:
        pfx = '.';
        break;
      case TYPE_ID:
        pfx = '#';
        break;
    }

    return pfx + (escape ? escape(name) : name);
  }

  /**
   * Get selector as a string.
   * @returns {String}
   * @example
   * // Given such selector: { name: 'my-selector', type: 2 }
   * console.log(selector.toString());
   * // -> `#my-selector`
   */
  toString() {
    return this.getFullName();
  }

  /**
   * Get selector name.
   * @returns {String}
   * @example
   * // Given such selector: { name: 'my-selector', label: 'My selector' }
   * console.log(selector.getName());
   * // -> `my-selector`
   */
  getName() {
    return this.get('name') || '';
  }

  /**
   * Get selector label.
   * @returns {String}
   * @example
   * // Given such selector: { name: 'my-selector', label: 'My selector' }
   * console.log(selector.getLabel());
   * // -> `My selector`
   */
  getLabel() {
    return this.get('label') || '';
  }

  /**
   * Update selector label.
   * @param {String} label New label
   * @example
   * // Given such selector: { name: 'my-selector', label: 'My selector' }
   * selector.setLabel('New Label')
   * console.log(selector.getLabel());
   * // -> `New Label`
   */
  setLabel(label: string) {
    return this.set('label', label);
  }

  /**
   * Get selector active state.
   * @returns {Boolean}
   */
  getActive() {
    return !!this.get('active');
  }

  /**
   * Update selector active state.
   * @param {Boolean} value New active state
   */
  setActive(value: boolean) {
    return this.set('active', value);
  }

  toJSON(opts = {}) {
    const { em } = this;
    let obj = Model.prototype.toJSON.call(this, [opts]);
    const defaults = result(this, 'defaults');

    if (em?.getConfig().avoidDefaults) {
      forEach(defaults, (value, key) => {
        if (obj[key] === value) {
          delete obj[key];
        }
      });

      if (obj.label === obj.name) {
        delete obj.label;
      }

      const objLen = keys(obj).length;

      if (objLen === 1 && obj.name) {
        obj = obj.name;
      }

      if (objLen === 2 && obj.name && obj.type) {
        obj = this.getFullName();
      }
    }

    return obj;
  }

  /**
   * Escape string
   * @param {string} name
   * @return {string}
   * @private
   */
  static escapeName(name: string) {
    return `${name}`.trim().replace(/\s+/g, '-');
  }
}

Selector.prototype.idAttribute = 'name';
```

--------------------------------------------------------------------------------

---[FILE: Selectors.ts]---
Location: grapesjs-dev/packages/core/src/selector_manager/model/Selectors.ts

```typescript
import { filter } from 'underscore';
import { Collection } from '../../common';
import Selector from './Selector';

const combine = (tail: string[], curr: string): string[] => {
  return tail.reduce(
    (acc, item, n) => {
      return acc.concat(combine(tail.slice(n + 1), `${curr}${item}`));
    },
    [curr],
  );
};

export interface FullNameOptions {
  combination?: boolean;
  array?: boolean;
}

export default class Selectors extends Collection<Selector> {
  modelId(attr: any) {
    return `${attr.name}_${attr.type || Selector.TYPE_CLASS}`;
  }

  getStyleable() {
    return filter(this.models, (item) => item.getActive() && !item.get('private'));
  }

  getValid({ noDisabled }: any = {}) {
    return filter(this.models, (item) => !item.get('private')).filter((item) => (noDisabled ? item.get('active') : 1));
  }

  getFullString(collection?: Selector[] | null, opts: { sort?: boolean } = {}) {
    const result: string[] = [];
    const coll = collection || this;
    coll.forEach((selector) => result.push(selector.getFullName(opts)));
    opts.sort && result.sort();
    return result.join('').trim();
  }

  getFullName<T extends FullNameOptions>(opts: T = {} as T) {
    const { combination, array } = opts;
    let result: string[] = [];
    const sels = this.map((s) => s.getFullName(opts)).sort();

    if (combination) {
      sels.forEach((sel, n) => {
        result = result.concat(combine(sels.slice(n + 1), sel));
      });
    } else {
      result = sels;
    }

    return (array ? result : combination ? result.join(',') : result.join('')) as T['array'] extends true
      ? string[]
      : string;
  }
}

Selectors.prototype.model = Selector;
```

--------------------------------------------------------------------------------

---[FILE: State.ts]---
Location: grapesjs-dev/packages/core/src/selector_manager/model/State.ts

```typescript
import { Model } from '../../common';

/**
 * @typedef State
 * @property {String} name State name, eg. `hover`, `nth-of-type(2n)`
 * @property {String} label State label, eg. `Hover`, `Even/Odd`
 */
export default class State extends Model {
  defaults() {
    return {
      name: '',
      label: '',
    };
  }

  /**
   * Get state name
   * @returns {String}
   */
  getName(): string {
    return this.get('name');
  }

  /**
   * Get state label. If label was not provided, the name will be returned.
   * @returns {String}
   */
  getLabel(): string {
    return this.get('label') || this.getName();
  }
}
State.prototype.idAttribute = 'name';
```

--------------------------------------------------------------------------------

````
