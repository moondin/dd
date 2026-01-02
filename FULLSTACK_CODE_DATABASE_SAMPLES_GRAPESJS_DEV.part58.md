---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 58
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 58 of 97)

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

---[FILE: ClassTagsView.ts]---
Location: grapesjs-dev/packages/core/src/selector_manager/view/ClassTagsView.ts

```typescript
import { isEmpty, isArray, isString, debounce } from 'underscore';
import { View } from '../../common';
import ClassTagView from './ClassTagView';
import html from '../../utils/html';
import EditorModel from '../../editor/model/Editor';
import SelectorManager from '..';
import State from '../model/State';
import Component from '../../dom_components/model/Component';
import Selector from '../model/Selector';
import Selectors from '../model/Selectors';
import CssRule from '../../css_composer/model/CssRule';
import { ComponentsEvents } from '../../dom_components/types';

export default class ClassTagsView extends View<Selector> {
  template({ labelInfo, labelHead, iconSync, iconAdd, pfx, ppfx }: any) {
    return html` <div id="${pfx}up" class="${pfx}header">
        <div id="${pfx}label" class="${pfx}header-label">${labelHead}</div>
        <div id="${pfx}status-c" class="${pfx}header-status">
          <span id="${pfx}input-c" data-states-c>
            <div class="${ppfx}field ${ppfx}select">
              <span id="${ppfx}input-holder">
                <select id="${pfx}states" data-states></select>
              </span>
              <div class="${ppfx}sel-arrow">
                <div class="${ppfx}d-s-arrow"></div>
              </div>
            </div>
          </span>
        </div>
      </div>
      <div id="${pfx}tags-field" class="${ppfx}field">
        <div id="${pfx}tags-c" data-selectors></div>
        <input id="${pfx}new" data-input />
        <span id="${pfx}add-tag" class="${pfx}tags-btn ${pfx}tags-btn__add" data-add> $${iconAdd} </span>
        <span class="${pfx}tags-btn ${pfx}tags-btn__sync" style="display: none" data-sync-style> $${iconSync} </span>
      </div>
      <div class="${pfx}sels-info">
        <div class="${pfx}label-sel">${labelInfo}:</div>
        <div class="${pfx}sels" data-selected></div>
      </div>`;
  }

  events() {
    return {
      'change [data-states]': 'stateChanged',
      'click [data-add]': 'startNewTag',
      'focusout [data-input]': 'endNewTag',
      'keyup [data-input]': 'onInputKeyUp',
      'click [data-sync-style]': 'syncStyle',
    };
  }

  $input?: JQuery<HTMLElement>;
  $addBtn?: JQuery<HTMLElement>;
  $classes?: JQuery<HTMLElement>;
  $btnSyncEl?: JQuery<HTMLElement>;
  $states?: JQuery<HTMLElement>;
  $statesC?: JQuery<HTMLElement>;
  em: EditorModel;
  target: EditorModel;
  module: SelectorManager;

  pfx: string;
  ppfx: string;
  stateInputId: string;
  stateInputC: string;
  config: any;
  states: State[];

  constructor(o: any = {}) {
    super(o);
    this.config = o.config || {};
    this.pfx = this.config.stylePrefix || '';
    this.ppfx = this.config.pStylePrefix || '';
    this.className = this.pfx + 'tags';
    this.stateInputId = this.pfx + 'states';
    this.stateInputC = this.pfx + 'input-c';
    this.states = this.config.states || [];
    const em = this.config.em as EditorModel;
    const coll = this.collection;
    this.target = em;
    const md = em.Selectors;
    this.module = md;
    this.em = em;
    this.componentChanged = debounce(this.componentChanged.bind(this), 0);
    this.checkSync = debounce(this.checkSync.bind(this), 0);
    const eventCmpUpdate = ComponentsEvents.update;
    const evClsUp = `${eventCmpUpdate}:classes`;
    const toList = `component:toggled ${evClsUp}`;
    const toListCls = `${evClsUp} ${eventCmpUpdate}:attributes:id change:state`;
    this.listenTo(em, toList, this.componentChanged);
    this.listenTo(em, 'styleManager:update', this.componentChanged);
    this.listenTo(em, toListCls, this.__handleStateChange);
    this.listenTo(em, 'styleable:change change:device', this.checkSync);
    this.listenTo(coll, 'add', this.addNew);
    this.listenTo(coll, 'reset', this.renderClasses);
    this.listenTo(coll, 'remove', this.tagRemoved);
    this.listenTo(
      md.getAll(),
      md.events.state,
      debounce(() => this.renderStates(), 0),
    );
    this.delegateEvents();
  }

  syncStyle() {
    const { em } = this;
    const target = this.getTarget();
    const cssC = em.Css;
    const opts = { noDisabled: 1 };
    const selectors = this.getCommonSelectors({ opts });
    const state = em.get('state');
    const mediaText = em.getCurrentMedia();
    const ruleComponents: CssRule[] = [];
    const rule = cssC.get(selectors, state, mediaText) || cssC.add(selectors, state, mediaText);
    let style;

    this.getTargets().forEach((target) => {
      const ruleComponent = cssC.getIdRule(target.getId(), {
        state,
        mediaText,
      })!;
      style = ruleComponent.getStyle();
      ruleComponent.setStyle({});
      ruleComponents.push(ruleComponent);
    });

    style && rule.addStyle(style);
    em.trigger('component:toggled');
    em.trigger('component:sync-style', {
      component: target,
      selectors,
      mediaText,
      rule,
      ruleComponents,
      state,
    });
  }

  /**
   * Triggered when a tag is removed from collection
   * @param {Object} model Removed model
   * @private
   */
  tagRemoved(model?: State) {
    this.updateStateVis();
  }

  /**
   * Add new model
   * @param {Object} model
   * @private
   */
  addNew(model: State) {
    this.addToClasses(model);
  }

  /**
   * Start tag creation
   * @param {Object} e
   * @private
   */
  startNewTag() {
    this.$addBtn?.css({ display: 'none' });
    this.$input?.show().focus();
  }

  /**
   * End tag creation
   * @param {Object} e
   * @private
   */
  endNewTag() {
    this.$addBtn?.css({ display: '' });
    this.$input?.hide().val('');
  }

  /**
   * Checks what to do on keyup event
   * @param  {Object} e
   * @private
   */
  onInputKeyUp(e: KeyboardEvent) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.addNewTag(this.$input?.val());
    } else if (e.keyCode === 27) {
      this.endNewTag();
    }
  }

  checkStates() {
    const state = this.em.getState();
    const statesEl = this.getStates();
    statesEl && statesEl.val(state);
  }

  /**
   * Triggered when component is changed
   * @param  {Object} e
   * @public
   */
  componentChanged({ targets }: any = {}) {
    this.updateSelection(targets);
  }

  updateSelection(targets: Component | Component[]) {
    let trgs = targets || this.getTargets();
    trgs = isArray(trgs) ? trgs : [trgs];
    let selectors: Selector[] = [];

    if (trgs && trgs.length) {
      selectors = this.getCommonSelectors({ targets: trgs });
      //@ts-ignore TODO This parameters are not in use why do we have them?
      this.checkSync({ validSelectors: selectors });
    }

    this.collection.reset(selectors);
    this.updateStateVis(trgs);
    this.module.__trgCustom();
    return selectors;
  }

  getCommonSelectors({ targets, opts = {} }: any = {}) {
    const trgs = targets || this.getTargets();
    return this.module.__getCommonSelectors(trgs, opts);
  }

  _commonSelectors(...args: any) {
    return this.module.__common(...args);
  }

  checkSync() {
    const { $btnSyncEl, config, collection } = this;
    const target = this.getTarget();
    let hasStyle;

    if (target && config.componentFirst && collection.length) {
      const style = target.getStyle();
      hasStyle = !isEmpty(style);
    }

    $btnSyncEl && $btnSyncEl[hasStyle ? 'show' : 'hide']();
  }

  getTarget() {
    return this.target.getSelected();
  }

  getTargets() {
    return this.target.getSelectedAll();
  }

  /**
   * Update states visibility. Hides states in case there is no tags
   * inside collection
   * @private
   */
  updateStateVis(targets?: Component[] | Component) {
    const em = this.em;
    const avoidInline = em && em.getConfig().avoidInlineStyle;
    const display = this.collection.length || avoidInline ? '' : 'none';
    this.getStatesC().css('display', display);
    this.updateSelector(targets);
  }

  __handleStateChange() {
    this.updateSelector(this.getTargets());
  }

  /**
   * Update selector helper
   * @return {this}
   * @private
   */
  updateSelector(targets?: Component[] | Component) {
    const elSel = this.el.querySelector('[data-selected]');
    const result: string[] = [];
    let trgs = targets || this.getTargets();
    trgs = isArray(trgs) ? trgs : [trgs];

    trgs.forEach((target) => result.push(this.__getName(target)));
    elSel && (elSel.innerHTML = result.join(', '));
    this.checkStates();
  }

  __getName(target: Component): string {
    const { pfx, config, em } = this;
    const { selectedName, componentFirst } = config;
    let result;

    if (isString(target)) {
      result = html`<span class="${pfx}sel-gen">${target}</span>`;
    } else {
      const sel = target?.getSelectors();
      if (!sel) return '';
      const selectors = sel.getStyleable();
      const state = em.get('state');
      const idRes = target.getId
        ? html`<span class="${pfx}sel-cmp">${target.getName()}</span>
            <span class="${pfx}sel-id">#${target.getId()}</span>`
        : '';
      result = (this.collection as Selectors).getFullString(selectors);
      result = result ? html`<span class="${pfx}sel-rule">${result}</span>` : target.get('selectorsAdd') || idRes;
      result = componentFirst && idRes ? idRes : result;
      result += state ? html`<span class="${pfx}sel-state">:${state}</span>` : '';
      result = selectedName ? selectedName({ result, state, target }) : result;
    }

    return result && `<span class="${pfx}sel">${result}</span>`;
  }

  /**
   * Triggered when the select with states is changed
   * @param  {Object} e
   * @private
   */
  stateChanged(ev: any) {
    const { em } = this;
    const { value } = ev.target;
    em.set('state', value);
  }

  /**
   * Add new tag to collection, if possible, and to the component
   * @param  {Object} e
   * @private
   */
  addNewTag(value: any) {
    const label = value.trim();
    if (!label) return;
    this.module.addSelected({ label });
    this.endNewTag();
    // this.updateStateVis(); // Check if required
  }

  /**
   * Add new object to collection
   * @param   {Object} model  Model
   * @param   {Object} fragmentEl   Fragment collection
   * @return {Object} Object created
   * @private
   * */
  addToClasses(model: State, fragmentEl?: DocumentFragment) {
    const fragment = fragmentEl;
    const classes = this.getClasses();
    const rendered = new ClassTagView({
      model,
      config: this.config,
      coll: this.collection,
      module: this.module,
    }).render().el;

    fragment ? fragment.appendChild(rendered) : classes.append(rendered);

    return rendered;
  }

  /**
   * Render the collection of classes
   * @private
   */
  renderClasses() {
    const frag = document.createDocumentFragment();
    const classes = this.getClasses();
    classes.empty();
    this.collection.each((model) => this.addToClasses(model, frag));
    classes.append(frag);
  }

  /**
   * Return classes element
   * @return {HTMLElement}
   * @private
   */
  getClasses() {
    return this.$el.find('[data-selectors]');
  }

  /**
   * Return states element
   * @return {HTMLElement}
   * @private
   */
  getStates() {
    if (!this.$states) {
      const el = this.$el.find('[data-states]');
      this.$states = el[0] && el;
    }
    return this.$states;
  }

  /**
   * Return states container element
   * @return {HTMLElement}
   * @private
   */
  getStatesC() {
    if (!this.$statesC) this.$statesC = this.$el.find('#' + this.stateInputC);
    return this.$statesC;
  }

  renderStates() {
    const { module, em } = this;
    const labelStates = em.t('selectorManager.emptyState');
    const options = module
      .getStates()
      .map((state) => {
        const label = em.t(`selectorManager.states.${state.id}`) || state.getLabel() || state.id;
        return `<option value="${state.id}">${label}</option>`;
      })
      .join('');

    const statesEl = this.getStates();
    statesEl && statesEl.html(`<option value="">${labelStates}</option>${options}`);
    this.checkStates();
  }

  render() {
    const { em, pfx, ppfx, config, $el, el } = this;
    const { render, iconSync, iconAdd } = config;
    const tmpOpts = {
      iconSync,
      iconAdd,
      labelHead: em.t('selectorManager.label'),
      labelInfo: em.t('selectorManager.selected'),
      ppfx,
      pfx,
      el,
    };
    $el.html(this.template(tmpOpts));
    const renderRes = render && render(tmpOpts);
    renderRes && renderRes !== el && $el.empty().append(renderRes);
    this.$input = $el.find('[data-input]');
    this.$addBtn = $el.find('[data-add]');
    this.$classes = $el.find('#' + pfx + 'tags-c');
    this.$btnSyncEl = $el.find('[data-sync-style]');
    this.$input.hide();
    this.renderStates();
    this.renderClasses();
    $el.attr('class', `${this.className} ${ppfx}one-bg ${ppfx}two-color`);
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ClassTagView.ts]---
Location: grapesjs-dev/packages/core/src/selector_manager/view/ClassTagView.ts

```typescript
import { View } from '../../common';
import Selector from '../model/Selector';
import html from '../../utils/html';
import EditorModel from '../../editor/model/Editor';
import SelectorManager from '..';
import { SelectorManagerConfig } from '../config/config';

const inputProp = 'contentEditable';

export default class ClassTagView extends View<Selector> {
  template() {
    const { pfx, model, config } = this;
    const label = model.get('label') || '';

    return html`
      <span id="${pfx}checkbox" class="${pfx}tag-status" data-tag-status></span>
      <span id="${pfx}tag-label" data-tag-name>${label}</span>
      <span id="${pfx}close" class="${pfx}tag-close" data-tag-remove> $${config.iconTagRemove!} </span>
    `;
  }

  events() {
    return {
      'click [data-tag-remove]': 'removeTag',
      'click [data-tag-status]': 'changeStatus',
      'dblclick [data-tag-name]': 'startEditTag',
      'focusout [data-tag-name]': 'endEditTag',
    };
  }
  config: SelectorManagerConfig;
  module: SelectorManager;
  coll: any;
  pfx: string;
  ppfx: string;
  em: EditorModel;
  inputEl?: HTMLElement;

  constructor(o: any = {}) {
    super(o);
    const config = o.config || {};
    this.config = config;
    this.module = o.module;
    this.coll = o.coll || null;
    this.pfx = config.stylePrefix || '';
    this.ppfx = config.pStylePrefix || '';
    this.em = config.em;
    this.listenTo(this.model, 'change:active', this.updateStatus);
  }

  /**
   * Returns the element which containes the anme of the tag
   * @return {HTMLElement}
   */
  getInputEl() {
    if (!this.inputEl) {
      this.inputEl = this.el.querySelector('[data-tag-name]') as HTMLElement;
    }

    return this.inputEl;
  }

  /**
   * Start editing tag
   * @private
   */
  startEditTag() {
    const { em } = this;
    const inputEl = this.getInputEl();
    inputEl[inputProp] = 'true';
    inputEl.focus();
    em?.setEditing(true);
  }

  /**
   * End editing tag. If the class typed already exists the
   * old one will be restored otherwise will be changed
   * @private
   */
  endEditTag() {
    const { model, em } = this;
    const inputEl = this.getInputEl();
    const label = inputEl.textContent || '';
    const sm = em?.Selectors;
    inputEl[inputProp] = 'false';
    em?.setEditing(false);

    if (sm && sm.rename(model, label) !== model) {
      inputEl.innerText = model.getLabel();
    }
  }

  /**
   * Update status of the tag
   * @private
   */
  changeStatus() {
    const { model } = this;
    model.set('active', !model.getActive());
  }

  /**
   * Remove tag from the selected component
   * @param {Object} e
   * @private
   */
  removeTag() {
    this.module.removeSelected(this.model);
  }

  /**
   * Update status of the checkbox
   * @private
   */
  updateStatus() {
    const { model, $el, config } = this;
    const { iconTagOn, iconTagOff } = config;
    const $chk = $el.find('[data-tag-status]');

    if (model.get('active')) {
      $chk.html(iconTagOn!);
      $el.removeClass('opac50');
    } else {
      $chk.html(iconTagOff!);
      $el.addClass('opac50');
    }
  }

  render() {
    const { pfx, ppfx, $el, model } = this;
    const mainCls = `${pfx}tag`;
    const classes = [`${mainCls} ${ppfx}three-bg`];
    model.get('protected') && classes.push(`${mainCls}-protected`);
    $el.html(this.template());
    $el.attr('class', classes.join(' '));
    this.updateStatus();
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/storage_manager/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/storage_manager/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  storageManager: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API and listen to its events. Before using these methods, you should get the module from the instance.
 *
 * ```js
 * // Listen to events
 * editor.on('storage:start', () => { ... });
 *
 * // Use the API
 * const storageManager = editor.Storage;
 * storageManager.add(...);
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * ## Methods
 * * [getConfig](#getconfig)
 * * [isAutosave](#isautosave)
 * * [setAutosave](#setautosave)
 * * [getStepsBeforeSave](#getstepsbeforesave)
 * * [setStepsBeforeSave](#setstepsbeforesave)
 * * [getStorages](#getstorages)
 * * [getCurrent](#getcurrent)
 * * [getCurrentStorage](#getcurrentstorage)
 * * [setCurrent](#setcurrent)
 * * [getStorageOptions](#getstorageoptions)
 * * [add](#add)
 * * [get](#get)
 * * [store](#store)
 * * [load](#load)
 *
 * @module Storage
 */

import { isEmpty, isFunction } from 'underscore';
import { Module } from '../abstract';
import defConfig, { StorageManagerConfig } from './config/config';
import LocalStorage from './model/LocalStorage';
import RemoteStorage from './model/RemoteStorage';
import EditorModel from '../editor/model/Editor';
import IStorage, { StorageOptions, ProjectData } from './model/IStorage';
import StorageEvents from './types';

export type { StorageOptions, ProjectData } from './model/IStorage';

export type StorageEvent = `${StorageEvents}`;

type StorageEventType = 'store' | 'load';

const STORAGE_LOCAL = 'local';
const STORAGE_REMOTE = 'remote';

export default class StorageManager extends Module<
  StorageManagerConfig & { name?: string; _disable?: boolean; currentStorage?: string }
> {
  storages: Record<string, IStorage> = {};
  events = StorageEvents;

  constructor(em: EditorModel) {
    super(em, 'StorageManager', defConfig());
    const { config } = this;
    if (config._disable) config.type = undefined;
    this.storages = {};
    this.add(STORAGE_LOCAL, new LocalStorage());
    this.add(STORAGE_REMOTE, new RemoteStorage());
    this.setCurrent(config.type!);
  }

  /**
   * Get configuration object
   * @name getConfig
   * @function
   * @return {Object}
   */

  /**
   * Check if autosave is enabled.
   * @returns {Boolean}
   * */
  isAutosave() {
    return !!this.config.autosave;
  }

  /**
   * Set autosave value.
   * @param  {Boolean} value
   * */
  setAutosave(value: boolean) {
    this.config.autosave = !!value;
    return this;
  }

  /**
   * Returns number of steps required before trigger autosave.
   * @returns {Number}
   * */
  getStepsBeforeSave() {
    return this.config.stepsBeforeSave!;
  }

  /**
   * Set steps required before trigger autosave.
   * @param {Number} value
   * */
  setStepsBeforeSave(value: number) {
    this.config.stepsBeforeSave = value;
    return this;
  }

  /**
   * Add new storage.
   * @param {String} type Storage type
   * @param {Object} storage Storage definition
   * @param {Function} storage.load Load method
   * @param  {Function} storage.store Store method
   * @example
   * storageManager.add('local2', {
   *   async load(storageOptions) {
   *     // ...
   *   },
   *   async store(data, storageOptions) {
   *     // ...
   *   },
   * });
   * */
  add<T extends StorageOptions>(type: string, storage: IStorage<T>) {
    this.storages[type] = storage as IStorage;
    return this;
  }

  /**
   * Return storage by type.
   * @param {String} type Storage type
   * @returns {Object|null}
   * */
  get<T extends StorageOptions>(type: string): IStorage<T> | undefined {
    return this.storages[type];
  }

  /**
   * Get all storages.
   * @returns {Object}
   * */
  getStorages() {
    return this.storages;
  }

  /**
   * Get current storage type.
   * @returns {String}
   * */
  getCurrent() {
    return this.config.currentStorage!;
  }

  /**
   * Set current storage type.
   * @param {String} type Storage type
   * */
  setCurrent(type: string) {
    this.getConfig().currentStorage = type;
    return this;
  }

  getCurrentStorage() {
    return this.get(this.getCurrent());
  }

  /**
   * Get storage options by type.
   * @param {String} type Storage type
   * @returns {Object}
   * */
  getStorageOptions(type: string) {
    return this.getCurrentOptions(type);
  }

  /**
   * Store data in the current storage.
   * @param {Object} data Project data.
   * @param {Object} [options] Storage options.
   * @returns {Object} Stored data.
   * @example
   * const data = editor.getProjectData();
   * await storageManager.store(data);
   * */
  async store<T extends StorageOptions>(data: ProjectData, options: T = {} as T) {
    const st = this.getCurrentStorage();
    const opts = { ...this.getCurrentOptions(), ...options };
    const recovery = this.getRecoveryStorage();
    const recoveryOpts = this.getCurrentOptions(STORAGE_LOCAL);

    try {
      await this.__exec(st!, opts, data);
      recovery && (await this.__exec(recovery, recoveryOpts, {}));
    } catch (error) {
      if (recovery) {
        await this.__exec(recovery, recoveryOpts, data);
      } else {
        throw error;
      }
    }

    return data;
  }

  /**
   * Load resource from the current storage by keys
   * @param {Object} [options] Storage options.
   * @returns {Object} Loaded data.
   * @example
   * const data = await storageManager.load();
   * editor.loadProjectData(data);
   * */
  async load<T extends StorageOptions>(options: T = {} as T) {
    const st = this.getCurrentStorage();
    const opts = { ...this.getCurrentOptions(), ...options };
    const recoveryStorage = this.getRecoveryStorage();
    let result: ProjectData | undefined;

    if (recoveryStorage) {
      const recoveryData = await this.__exec(recoveryStorage, this.getCurrentOptions(STORAGE_LOCAL));
      if (!isEmpty(recoveryData)) {
        try {
          await this.__askRecovery();
          result = recoveryData;
        } catch (error) {}
      }
    }

    if (!result) {
      result = await this.__exec(st!, opts);
    }

    return result || {};
  }

  __askRecovery() {
    const { em } = this;
    const recovery = this.getRecovery();

    return new Promise((res, rej) => {
      if (isFunction(recovery)) {
        recovery(res, rej, em?.getEditor());
      } else {
        confirm(em?.t('storageManager.recover')) ? res(null) : rej();
      }
    });
  }

  getRecovery(): StorageManagerConfig['recovery'] {
    return this.config.recovery;
  }

  getRecoveryStorage() {
    const recovery = this.getRecovery();
    return recovery && this.getCurrent() === STORAGE_REMOTE && this.get(STORAGE_LOCAL);
  }

  async __exec(storage: IStorage, opts: StorageOptions, data?: ProjectData) {
    const ev = data ? 'store' : 'load';
    const { onStore, onLoad } = this.getConfig();
    let result;

    if (!storage) {
      return data || {};
    }

    this.onStart(ev, data);

    try {
      const editor = this.em?.getEditor();
      let response: any;

      if (data) {
        let toStore = (onStore && (await onStore(data, editor))) || data;
        toStore = (opts.onStore && (await opts.onStore(toStore, editor))) || toStore;
        response = await storage.store(toStore, opts);
        result = data;
      } else {
        response = await storage.load(opts);
        result = this.__clearKeys(response);
        result = (opts.onLoad && (await opts.onLoad(result, editor))) || result;
        result = (onLoad && (await onLoad(result, editor))) || result;
      }
      this.onAfter(ev, result, response);
      this.onEnd(ev, result, response);
    } catch (error) {
      this.onError(ev, error);
      throw error;
    }

    return result;
  }

  __clearKeys(data: ProjectData = {}) {
    const config = this.getConfig();
    const reg = new RegExp(`^${config.id}`);
    const result: ProjectData = {};

    for (let itemKey in data) {
      const itemKeyR = itemKey.replace(reg, '');
      result[itemKeyR] = data[itemKey];
    }

    return result;
  }

  getCurrentOptions(type?: string): StorageOptions {
    const config = this.getConfig();
    const current = type || this.getCurrent();
    return config.options![current] || {};
  }

  /**
   * On start callback
   * @private
   */
  onStart(type: StorageEventType, data?: ProjectData) {
    const { em } = this;
    if (em) {
      const ev = type === 'load' ? StorageEvents.startLoad : StorageEvents.startStore;
      em.trigger(StorageEvents.start, type, data);
      em.trigger(ev, data);
    }
  }

  /**
   * On after callback (before passing data to the callback)
   * @private
   */
  onAfter(type: StorageEventType, data: ProjectData, response: any) {
    const { em } = this;
    if (em) {
      const evAfter = type === 'load' ? StorageEvents.afterLoad : StorageEvents.afterStore;
      em.trigger(StorageEvents.after);
      em.trigger(evAfter, data, response);
      const ev = type === 'load' ? StorageEvents.load : StorageEvents.store;
      em.trigger(ev, data, response);
    }
  }

  /**
   * On end callback
   * @private
   */
  onEnd(type: StorageEventType, data: ProjectData, response?: any) {
    const { em } = this;
    if (em) {
      const ev = type === 'load' ? StorageEvents.endLoad : StorageEvents.endStore;
      em.trigger(StorageEvents.end, type, data, response);
      em.trigger(ev, data, response);
    }
  }

  /**
   * On error callback
   * @private
   */
  onError(type: StorageEventType, error: any) {
    const { em } = this;
    if (em) {
      const ev = type === 'load' ? StorageEvents.errorLoad : StorageEvents.errorStore;
      em.trigger(StorageEvents.error, error, type);
      em.trigger(ev, error);
      this.onEnd(type, error);
    }
  }

  /**
   * Check if autoload is possible
   * @return {Boolean}
   * @private
   * */
  canAutoload() {
    const storage = this.getCurrentStorage();
    return !!storage && !!this.config.autoload;
  }

  destroy() {
    this.storages = {};
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/storage_manager/types.ts

```typescript
/**{START_EVENTS}*/
export enum StorageEvents {
  /**
   * @event `storage:start` Storage request start.
   * @example
   * editor.on('storage:start', (type) => {
   *  console.log('Storage start');
   * });
   */
  start = 'storage:start',

  /**
   * @event `storage:start:store` Storage store request start. The project JSON object to store is passed as an argument (which you can edit).
   * @example
   * editor.on('storage:start:store', (data) => {
   *  console.log('Storage start store');
   * });
   */
  startStore = 'storage:start:store',

  /**
   * @event `storage:start:load` Storage load request start.
   * @example
   * editor.on('storage:start:load', () => {
   *  console.log('Storage start load');
   * });
   */
  startLoad = 'storage:start:load',

  /**
   * @event `storage:load` Storage loaded the project. The loaded project is passed as an argument.
   * @example
   * editor.on('storage:load', (data, res) => {
   *  console.log('Storage loaded the project');
   * });
   */
  load = 'storage:load',

  /**
   * @event `storage:store` Storage stored the project. The stored project is passed as an argument.
   * @example
   * editor.on('storage:store', (data, res) => {
   *  console.log('Storage stored the project');
   * });
   */
  store = 'storage:store',

  /**
   * @event `storage:after` Storage request completed. Triggered right after `storage:load`/`storage:store`.
   * @example
   * editor.on('storage:after', (type) => {
   *  console.log('Storage request completed');
   * });
   */
  after = 'storage:after',
  afterStore = 'storage:after:store',
  afterLoad = 'storage:after:load',

  /**
   * @event `storage:end` Storage request ended. This event triggers also in case of errors.
   * @example
   * editor.on('storage:end', (type) => {
   *  console.log('Storage request ended');
   * });
   */
  end = 'storage:end',

  /**
   * @event `storage:end:store` Storage store request ended. This event triggers also in case of errors.
   * @example
   * editor.on('storage:end:store', () => {
   *  console.log('Storage store request ended');
   * });
   */
  endStore = 'storage:end:store',

  /**
   * @event `storage:end:load` Storage load request ended. This event triggers also in case of errors.
   * @example
   * editor.on('storage:end:load', () => {
   *  console.log('Storage load request ended');
   * });
   */
  endLoad = 'storage:end:load',

  /**
   * @event `storage:error` Error on storage request.
   * @example
   * editor.on('storage:error', (err, type) => {
   *  console.log('Storage error');
   * });
   */
  error = 'storage:error',

  /**
   * @event `storage:error:store` Error on store request.
   * @example
   * editor.on('storage:error:store', (err) => {
   *  console.log('Error on store');
   * });
   */
  errorStore = 'storage:error:store',

  /**
   * @event `storage:error:load` Error on load request.
   * @example
   * editor.on('storage:error:load', (err) => {
   *  console.log('Error on load');
   * });
   */
  errorLoad = 'storage:error:load',
}
/**{END_EVENTS}*/

// need this to avoid the TS documentation generator to break
export default StorageEvents;
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/storage_manager/config/config.ts

```typescript
import { LiteralUnion } from '../../common';
import Editor from '../../editor';
import { ProjectData } from '../model/IStorage';
import { LocalStorageConfig } from '../model/LocalStorage';
import { RemoteStorageConfig } from '../model/RemoteStorage';

export interface StorageManagerConfig {
  /**
   * Prefix identifier that will be used inside storing and loading.
   * @default 'gjs-'
   * @deprecated
   */
  id?: string;

  /**
   * Default storage type.
   * Available by default: 'local' | 'remote'
   * @default 'local'
   */
  type?: LiteralUnion<'local' | 'remote', string>;

  /**
   * Enable/disable autosaving.
   * @default true
   */
  autosave?: boolean;

  /**
   * Enable/disable autoload of data on editor init.
   * @default true
   */
  autoload?: boolean;

  /**
   * If autosave enabled, indicates how many steps (general changes to structure)
   * need to be done before save. Useful with remoteStorage to reduce remote calls
   * @default 1
   */
  stepsBeforeSave?: number;

  /**
   * In case the `remote` storage is selected, and this options is enabled, the project
   * will be stored on the `local` storage in case the remote one fails.
   * The local data are cleared on every successful remote save. When the remote storage
   * fails (eg. network issue) and the editor is reloaded, a dialog with the possibility to
   * recovery previous data will be shown.
   * @default false
   * @example
   * // Enable recovery with default confirm dialog
   * recovery: true,
   * // Enable recovery with a custom dialog
   * recovery: (accept, cancel, editor) => {
   *   confirm('Recover data?') ? accept() : cancel();
   * },
   */
  recovery?: boolean | ((accept: Function, cancel: Function, editor: Editor) => void);

  /**
   * Callback triggered before the store call (can be asynchronous).
   * This can be used to enrich the project data to store.
   * @default data => data
   */
  onStore?: (data: ProjectData, editor: Editor) => ProjectData;

  /**
   * Callback triggered after the load call (can be asynchronous).
   * @default data => data
   */
  onLoad?: (data: ProjectData, editor: Editor) => ProjectData;

  /**
   * Default storage options.
   */
  options?: {
    local?: LocalStorageConfig;
    remote?: RemoteStorageConfig;
    [key: string]: any;
  };
}

const config: () => StorageManagerConfig = () => ({
  id: 'gjs-',
  type: 'local',
  autosave: true,
  autoload: true,
  stepsBeforeSave: 1,
  recovery: false,
  onStore: (data) => data,
  onLoad: (data) => data,
  options: {
    local: {
      key: 'gjsProject',
      checkLocal: true,
    },
    remote: {
      headers: {},
      urlStore: '',
      urlLoad: '',
      contentTypeJson: true,
      fetchOptions: '',
      credentials: 'include',
      onStore: (data) => data,
      onLoad: (result) => result,
    },
  },
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: IStorage.ts]---
Location: grapesjs-dev/packages/core/src/storage_manager/model/IStorage.ts

```typescript
export interface StorageOptions {
  [key: string]: any;
}

export interface ProjectData {
  [key: string]: any;
}

export default interface IStorage<T extends StorageOptions = {}> {
  load: (options: T) => Promise<ProjectData>;
  store: (data: ProjectData, options: T) => Promise<any>;
  [key: string]: any;
}
```

--------------------------------------------------------------------------------

---[FILE: LocalStorage.ts]---
Location: grapesjs-dev/packages/core/src/storage_manager/model/LocalStorage.ts

```typescript
import { hasWin } from '../../utils/mixins';
import IStorage, { ProjectData } from './IStorage';

export interface LocalStorageConfig {
  /**
   * Local key identifier of the project.
   * @default 'gjsProject'
   */
  key?: string;

  /**
   * If enabled, checks if browser supports LocalStorage.
   * @default true
   */
  checkLocal?: boolean;
}

export default class LocalStorage implements IStorage<LocalStorageConfig> {
  async store(data: ProjectData, opts: LocalStorageConfig = {}) {
    if (this.hasLocal(opts, true)) {
      localStorage.setItem(opts.key!, JSON.stringify(data));
    }
    return data;
  }

  async load(opts: LocalStorageConfig = {}) {
    let result = {};

    if (this.hasLocal(opts, true)) {
      result = JSON.parse(localStorage.getItem(opts.key!) || '{}');
    }

    return result;
  }

  hasLocal(opts: LocalStorageConfig = {}, thr?: boolean) {
    if (opts.checkLocal && (!hasWin() || !localStorage)) {
      if (thr) throw new Error('localStorage not available');
      return false;
    }

    return true;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: RemoteStorage.ts]---
Location: grapesjs-dev/packages/core/src/storage_manager/model/RemoteStorage.ts

```typescript
import Editor from '../../editor';
import { isUndefined, isFunction, isString } from 'underscore';
import fetch from '../../utils/fetch';
import IStorage, { ProjectData } from './IStorage';
import { ObjectAny } from '../../common';

export interface RemoteStorageConfig {
  /**
   * Custom headers.
   * @default {}
   */
  headers?: ObjectAny;

  /**
   * Endpoint URL where to store data project.
   */
  urlStore?: string;

  /**
   * Endpoint URL where to load data project.
   */
  urlLoad?: string;

  /**
   * Use JSON contentType.
   * @default true
   */
  contentTypeJson?: boolean;

  /**
   * Credentials option for the fetch API.
   * @default 'include'
   */
  credentials?: RequestCredentials;

  /**
   * Pass custom options to fetch API (remote storage)
   * You can pass a simple object: { someOption: 'someValue' }
   * or a function which returns and object to add:
   * @example
   * fetchOptions: currentOpts => {
   *  return currentOpts.method === 'POST' ?  { method: 'PATCH' } : {};
   * },
   */
  fetchOptions?: string | ((opts: RequestInit) => RequestInit);

  /**
   * The remote storage sends the project data as a body of the request.
   * You can use this method to update the body before the store call in order to align
   * with your API requirements.
   * @default data => data
   */
  onStore?: (data: ProjectData, editor: Editor) => ProjectData;

  /**
   * The remote storage loads the project data directly from the request response.
   * You can use this method to properly extract the project data from the response.
   * @default data => data
   */
  onLoad?: (data: ProjectData, editor: Editor) => ProjectData;
}

export default class RemoteStorage implements IStorage<RemoteStorageConfig> {
  async store(data: ProjectData, opts: RemoteStorageConfig = {}) {
    return await this.request(opts.urlStore!, this.__props(opts, data), opts);
  }

  async load(opts: RemoteStorageConfig = {}) {
    return await this.request(opts.urlLoad!, this.__props(opts), opts);
  }

  request(url: string, props: RequestInit = {}, opts: RemoteStorageConfig = {}) {
    return fetch(url, props)
      .then((res: any) => {
        const result = res.text();
        const isOk = ((res.status / 200) | 0) === 1;
        return isOk ? result : result.then(Promise.reject);
      })
      .then((text: string) => {
        const parsable = text && isString(text);
        return opts.contentTypeJson && parsable ? JSON.parse(text) : text;
      });
  }

  __props(opts: RemoteStorageConfig = {}, data?: ProjectData): RequestInit {
    const typeJson = opts.contentTypeJson;
    const headers = opts.headers || {};
    const fetchOpts = opts.fetchOptions || {};
    const reqHead = 'X-Requested-With';
    const typeHead = 'Content-Type';
    let body;

    if (isUndefined(headers[reqHead])) {
      headers[reqHead] = 'XMLHttpRequest';
    }

    if (isUndefined(headers[typeHead]) && typeJson) {
      headers[typeHead] = 'application/json; charset=utf-8';
    }

    if (data) {
      if (typeJson) {
        body = JSON.stringify(data);
      } else {
        body = new FormData();

        for (let key in data) {
          body.append(key, data[key]);
        }
      }
    }

    const result: RequestInit = {
      method: body ? 'POST' : 'GET',
      credentials: opts.credentials,
      headers,
      body,
    };

    return {
      ...result,
      ...(isFunction(fetchOpts) ? fetchOpts(result) : fetchOpts),
    };
  }
}
```

--------------------------------------------------------------------------------

````
