---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 53
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 53 of 97)

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

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/navigator/config/config.ts

```typescript
export interface LayerManagerConfig {
  stylePrefix?: string;

  /**
   * Specify the element to use as a container, string (query) or HTMLElement.
   * With the empty value, nothing will be rendered.
   * @default ''
   */
  appendTo?: string | HTMLElement;

  /**
   * Enable/Disable globally the possibility to sort layers.
   * @default true
   */
  sortable?: boolean;

  /**
   * Enable/Disable globally the possibility to hide layers.
   * @default true
   */
  hidable?: boolean;

  /**
   * Hide textnodes.
   * @default true
   */
  hideTextnode?: boolean;

  /**
   * Indicate a query string of the element to be selected as the root of layers.
   * By default the root is the wrapper.
   * @default ''
   */
  root?: string;

  /**
   * Indicates if the wrapper is visible in layers.
   * @default true
   */
  showWrapper?: boolean;

  /**
   * Show hovered components in canvas.
   * @default true
   */
  showHover?: boolean;

  /**
   * Scroll to selected component in Canvas when it's selected in Layers.
   * true, false or `scrollIntoView`-like options,
   * `block: 'nearest'` avoids the issue of window scrolling.
   * @default { behavior: 'smooth', block: 'nearest' }
   */
  scrollCanvas?: boolean | ScrollIntoViewOptions;

  /**
   * Scroll to selected component in Layers when it's selected in Canvas.
   * @default { behavior: 'auto', block: 'nearest' }
   */
  scrollLayers?: boolean | ScrollIntoViewOptions;

  /**
   * Highlight when a layer component is hovered.
   * @default true
   */
  highlightHover?: boolean;

  /**
   * Avoid rendering the default layer manager.
   * @default false
   */
  custom?: boolean;

  /**
   * WARNING: Experimental option.
   * A callback triggered once the component layer is initialized.
   * Useful to trigger updates on some component prop change.
   * @example
   * onInit({ component, render, listenTo }) {
   *  listenTo(component, 'change:some-prop', render);
   * };
   */
  onInit?: () => void;

  /**
   * WARNING: Experimental option.
   * A callback triggered once the component layer is rendered.
   * A callback useful to update the layer DOM on some component change
   * @example
   * onRender({ component, el }) { // el is the DOM of the layer
   *  if (component.get('some-prop')) {
   *    // do changes using the `el` DOM
   *  }
   * }
   */
  onRender?: () => void;

  /**
   * Extend Layer view object (view/ItemView.js)
   * @example
   * extend: {
   *   setName(name) {
   *     // this.model is the component of the layer
   *     this.model.set('another-prop-for-name', name);
   *   },
   * },
   */
  extend?: Record<string, any>;
}

const config: () => LayerManagerConfig = () => ({
  stylePrefix: '',
  appendTo: '',
  sortable: true,
  hidable: true,
  hideTextnode: true,
  root: '',
  showWrapper: true,
  showHover: true,
  scrollCanvas: { behavior: 'smooth', block: 'nearest' },
  scrollLayers: { behavior: 'auto', block: 'nearest' },
  highlightHover: true,
  custom: false,
  onInit: () => {},
  onRender: () => {},
  extend: {},
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: ItemsView.ts]---
Location: grapesjs-dev/packages/core/src/navigator/view/ItemsView.ts

```typescript
import { isUndefined } from 'underscore';
import { View } from '../../common';
import Component from '../../dom_components/model/Component';
import EditorModel from '../../editor/model/Editor';
import ItemView from './ItemView';
import Components from '../../dom_components/model/Components';
import LayerManager from '..';
import { DragDirection } from '../../utils/sorter/types';
import LayersComponentNode from '../../utils/sorter/LayersComponentNode';
import ComponentSorter from '../../utils/sorter/ComponentSorter';

export default class ItemsView extends View {
  items: ItemView[];
  opt: {
    sorter: ComponentSorter<LayersComponentNode>;
    [k: string]: any;
  };
  config: any;
  parentView: ItemView;
  module: LayerManager;
  /** @ts-ignore */
  collection!: Components;

  constructor(opt: any = {}) {
    super(opt);
    this.items = [];
    this.opt = opt;
    const config = opt.config || {};
    this.config = config;
    this.module = opt.module;
    this.parentView = opt.parentView;
    const pfx = config.stylePrefix || '';
    const ppfx = config.pStylePrefix || '';
    const coll = this.collection;
    this.listenTo(coll, 'add', this.addTo);
    this.listenTo(coll, 'reset resetNavigator', this.render);
    this.listenTo(coll, 'remove', this.removeChildren);
    this.className = `${pfx}layers`;
    const em = config.em as EditorModel;

    if (config.sortable && !this.opt.sorter) {
      const utils = em.Utils;
      const container = config.sortContainer || this.el;
      const placeholderElement = this.createPlaceholder(pfx);
      this.opt.sorter = new utils.ComponentSorter({
        em,
        treeClass: LayersComponentNode,
        containerContext: {
          container: container,
          containerSel: `.${this.className}`,
          itemSel: `.${pfx}layer`,
          pfx: config.pStylePrefix,
          document: document,
          placeholderElement: placeholderElement,
        },
        dragBehavior: {
          dragDirection: DragDirection.Vertical,
          nested: true,
        },
      });
    }

    // For the sorter
    this.$el.data('collection', coll);
    opt.parent && this.$el.data('model', opt.parent);
  }

  /**
   * Create placeholder
   * @return {HTMLElement}
   */
  private createPlaceholder(pfx: string) {
    const el = document.createElement('div');
    const ins = document.createElement('div');
    this.el.parentNode;
    el.className = pfx + 'placeholder';
    el.style.display = 'none';
    el.style.pointerEvents = 'none';
    ins.className = pfx + 'placeholder-int';
    el.appendChild(ins);

    return el;
  }

  removeChildren(removed: Component) {
    const view = removed.viewLayer;
    if (!view) return;
    view.remove();
    delete removed.viewLayer;
  }

  /**
   * Add to collection
   * @param Object Model
   *
   * @return Object
   * */
  addTo(model: Component) {
    this.addToCollection(model, null, this.collection.indexOf(model));
  }

  /**
   * Add new object to collection
   * @param  Object  Model
   * @param  Object   Fragment collection
   * @param  integer  Index of append
   *
   * @return Object Object created
   * */
  addToCollection(model: Component, fragment: DocumentFragment | null, index?: number) {
    const { parentView, opt, config, el } = this;
    const { ItemView, opened, module, level, sorter } = opt;
    const item: ItemView =
      model.viewLayer ||
      new ItemView({
        ItemView,
        level,
        model,
        parentView,
        config,
        sorter,
        opened,
        module,
      });
    const rendered = item.render().el;

    if (fragment) {
      fragment.appendChild(rendered);
    } else {
      const parent = el;
      const children = parent.childNodes;

      if (!isUndefined(index)) {
        const lastIndex = children.length == index;

        // If the added model is the last of collection
        // need to change the logic of append
        if (lastIndex) {
          index--;
        }

        // In case the added is new in the collection index will be -1
        if (lastIndex || !children.length) {
          parent.appendChild(rendered);
        } else {
          parent.insertBefore(rendered, children[index]);
        }
      } else {
        parent.appendChild(rendered);
      }
    }
    this.items.push(item);
    return rendered;
  }

  remove(...args: []) {
    View.prototype.remove.apply(this, args);
    this.items.map((i) => i.remove());
    return this;
  }

  render() {
    const { el, module } = this;
    const frag = document.createDocumentFragment();
    el.innerHTML = '';
    this.collection
      .map((cmp) => module.__getLayerFromComponent(cmp))
      .forEach((model) => this.addToCollection(model, frag));
    el.appendChild(frag);
    el.className = this.className!;
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ItemView.ts]---
Location: grapesjs-dev/packages/core/src/navigator/view/ItemView.ts

```typescript
import { bindAll, isString } from 'underscore';
import { View, ViewOptions } from '../../common';
import Component from '../../dom_components/model/Component';
import ComponentView from '../../dom_components/view/ComponentView';
import EditorModel from '../../editor/model/Editor';
import { isEnterKey, isEscKey } from '../../utils/dom';
import LayerManager from '../index';
import ItemsView from './ItemsView';
import { getOnComponentDrag, getOnComponentDragEnd, getOnComponentDragStart } from '../../commands';
import Sorter from '../../utils/sorter/Sorter';
import LayersComponentNode from '../../utils/sorter/LayersComponentNode';

export type ItemViewProps = ViewOptions & {
  ItemView: ItemView;
  level: number;
  config: any;
  opened: {};
  model: Component;
  module: LayerManager;
  sorter: any;
  parentView: ItemView;
};

const inputProp = 'contentEditable';
const dataToggleMove = 'data-toggle-move';

export default class ItemView extends View {
  events() {
    return {
      [`mousedown [${dataToggleMove}]`]: 'startSort',
      [`touchstart [${dataToggleMove}]`]: 'startSort',
      'click [data-toggle-visible]': 'toggleVisibility',
      'click [data-toggle-open]': 'toggleOpening',
      'click [data-toggle-select]': 'handleSelect',
      'mouseover [data-toggle-select]': 'handleHover',
      'mouseout [data-toggle-select]': 'handleHoverOut',
      'dblclick [data-name]': 'handleEdit',
      'keydown [data-name]': 'handleEditKey',
      'focusout [data-name]': 'handleEditEnd',
    };
  }

  template(model: Component) {
    const { pfx, ppfx, config, clsNoEdit, module, opt, em } = this;
    const { hidable } = config;
    const count = module.getComponents(model).length;
    const addClass = !count ? this.clsNoChild : '';
    const clsTitle = `${this.clsTitle} ${addClass}`;
    const clsTitleC = `${this.clsTitleC}`;
    const clsInput = `${this.inputNameCls} ${clsNoEdit} ${ppfx}no-app`;
    const level = opt.level || 0;
    const gut = `${level * 10}px`;
    const name = model.getName();
    const icon = model.getIcon();
    const clsBase = `${pfx}layer`;
    const { icons } = em?.getConfig();
    const { move, eye, eyeOff, chevron } = icons!;

    return `
      <div class="${pfx}layer-item ${ppfx}one-bg" data-toggle-select>
        <div class="${pfx}layer-item-left">
          ${
            hidable
              ? `<i class="${pfx}layer-vis" data-toggle-visible>
                <i class="${pfx}layer-vis-on">${eye}</i>
                <i class="${pfx}layer-vis-off">${eyeOff}</i>
              </i>`
              : ''
          }
          <div class="${clsTitleC}">
            <div class="${clsTitle}" style="padding-left: ${gut}">
              <div class="${pfx}layer-title-inn" title="${name}">
                <i class="${this.clsCaret}" data-toggle-open>${chevron}</i>
                  ${icon ? `<span class="${clsBase}__icon">${icon}</span>` : ''}
                <span class="${clsInput}" data-name>${name}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="${pfx}layer-item-right">
          <div class="${this.clsCount}" data-count>${count || ''}</div>
          <div class="${this.clsMove}" ${dataToggleMove}>${move || ''}</div>
        </div>
      </div>
      <div class="${this.clsChildren}"></div>
    `;
  }

  public get em(): EditorModel {
    return this.module.em;
  }

  public get ppfx(): string {
    return this.em.getConfig().stylePrefix!;
  }

  public get pfx(): string {
    return this.config.stylePrefix;
  }

  opt: ItemViewProps;
  module: LayerManager;
  config: any;
  sorter: Sorter<Component, LayersComponentNode>;
  /** @ts-ignore */
  model!: Component;
  parentView: ItemView;
  items?: ItemsView;
  inputNameCls: string;
  clsTitleC: string;
  clsTitle: string;
  clsCaret: string;
  clsCount: string;
  clsMove: string;
  clsChildren: string;
  clsNoChild: string;
  clsEdit: string;
  clsNoEdit: string;
  _rendered?: boolean;
  caret?: JQuery<HTMLElement>;
  inputName?: HTMLElement;

  constructor(opt: ItemViewProps) {
    super(opt);
    bindAll(this, '__render');
    this.opt = opt;
    this.module = opt.module;
    this.config = opt.config || {};
    this.sorter = opt.sorter || '';
    this.parentView = opt.parentView;
    const { model, pfx, ppfx } = this;
    const type = model.get('type') || 'default';
    this.className = `${pfx}layer ${pfx}layer__t-${type} no-select ${ppfx}two-color`;
    this.inputNameCls = `${ppfx}layer-name`;
    this.clsTitleC = `${pfx}layer-title-c`;
    this.clsTitle = `${pfx}layer-title`;
    this.clsCaret = `${pfx}layer-caret`;
    this.clsCount = `${pfx}layer-count`;
    this.clsMove = `${pfx}layer-move`;
    this.clsChildren = `${pfx}layer-children`;
    this.clsNoChild = `${pfx}layer-no-chld`;
    this.clsEdit = `${this.inputNameCls}--edit`;
    this.clsNoEdit = `${this.inputNameCls}--no-edit`;
    this.initComponent();
  }

  initComponent() {
    const { model, config } = this;
    const { onInit } = config;
    const components = model.components();
    this.listenTo(components, 'remove add reset', this.checkChildren);
    [
      ['change:status', this.updateStatus],
      ['change:open', this.updateOpening],
      ['change:layerable', this.updateLayerable],
      ['change:style:display', this.updateVisibility],
      ['change:draggable', this.updateMove],
      ['rerender:layer', this.render],
      ['change:name change:custom-name', this.updateName],
      // @ts-ignore
    ].forEach((item) => this.listenTo(model, item[0], item[1]));
    this.$el.data('model', model);
    this.$el.data('collection', components);
    model.viewLayer = this;
    onInit.bind(this)({
      component: model,
      render: this.__render,
      listenTo: this.listenTo,
    });
  }

  updateName() {
    this.getInputName().innerText = this.model.getName();
  }

  getVisibilityEl() {
    return this.getItemContainer().find('[data-toggle-visible]');
  }

  updateVisibility() {
    const { pfx, model, module } = this;
    const hClass = `${pfx}layer-hidden`;
    const hidden = !module.isVisible(model);
    const method = hidden ? 'addClass' : 'removeClass';
    this.$el[method](hClass);
    this.getVisibilityEl()[method](`${pfx}layer-off`);
  }

  updateMove() {
    const { model, config } = this;
    const el = this.getItemContainer().find(`[${dataToggleMove}]`)[0];
    if (el) {
      const isDraggable = model.get('draggable') && config.sortable;
      el.style.display = isDraggable ? '' : 'none';
    }
  }

  /**
   * Toggle visibility
   * @param	Event
   *
   * @return 	void
   * */
  toggleVisibility(ev?: MouseEvent) {
    ev?.stopImmediatePropagation();
    const { module, model } = this;
    module.setVisible(model, !module.isVisible(model));
  }

  /**
   * Handle the edit of the component name
   */
  handleEdit(ev?: MouseEvent) {
    ev?.stopPropagation();
    const { em, $el, clsNoEdit, clsEdit } = this;
    const inputEl = this.getInputName();
    inputEl[inputProp] = 'true';
    inputEl.focus();
    document.execCommand('selectAll', false);
    em.setEditing(true);
    $el.find(`.${this.inputNameCls}`).removeClass(clsNoEdit).addClass(clsEdit);
  }

  handleEditKey(ev: KeyboardEvent) {
    ev.stopPropagation();
    (isEscKey(ev) || isEnterKey(ev)) && this.handleEditEnd(ev);
  }

  /**
   * Handle with the end of editing of the component name
   */
  handleEditEnd(ev?: KeyboardEvent) {
    ev?.stopPropagation();
    const { em, $el, clsNoEdit, clsEdit, model } = this;
    const inputEl = this.getInputName();
    const name = inputEl.textContent!;
    inputEl.scrollLeft = 0;
    inputEl[inputProp] = 'false';
    model.setName(name);
    em.setEditing(false);
    $el.find(`.${this.inputNameCls}`).addClass(clsNoEdit).removeClass(clsEdit);
    // Ensure to always update the layer name #4544
    this.updateName();
  }

  /**
   * Get the input containing the name of the component
   * @return {HTMLElement}
   */
  getInputName() {
    if (!this.inputName) {
      this.inputName = this.el.querySelector(`.${this.inputNameCls}`)!;
    }
    return this.inputName;
  }

  /**
   * Update item opening
   *
   * @return void
   * */
  updateOpening() {
    const { $el, model, pfx } = this;
    const clsOpen = 'open';
    const clsChvOpen = `${pfx}layer-open`;
    const caret = this.getCaret();

    if (this.module.isOpen(model)) {
      $el.addClass(clsOpen);
      caret.addClass(clsChvOpen);
    } else {
      $el.removeClass(clsOpen);
      caret.removeClass(clsChvOpen);
    }
  }

  /**
   * Toggle item opening
   * @param {Object}	e
   *
   * @return void
   * */
  toggleOpening(ev?: MouseEvent) {
    const { model, module } = this;
    ev?.stopImmediatePropagation();

    if (!model.get('components')!.length) return;

    module.setOpen(model, !module.isOpen(model));
  }

  /**
   * Handle component selection
   */
  handleSelect(event?: MouseEvent) {
    event?.stopPropagation();
    const { module, model } = this;
    module.setLayerData(model, { selected: true }, { event });
  }

  /**
   * Handle component selection
   */
  handleHover(ev?: MouseEvent) {
    ev?.stopPropagation();
    const { module, model } = this;
    module.setLayerData(model, { hovered: true });
  }

  handleHoverOut(ev?: MouseEvent) {
    ev?.stopPropagation();
    const { module, model } = this;
    module.setLayerData(model, { hovered: false });
  }

  /**
   * Delegate to sorter
   * @param	Event
   * */
  startSort(ev: MouseEvent) {
    ev.stopPropagation();
    const { em, sorter, model } = this;
    // Right or middel click
    if (ev.button && ev.button !== 0) return;

    if (sorter) {
      const toMove = model.delegate?.move?.(model) || model;
      sorter.eventHandlers = {
        legacyOnStartSort: getOnComponentDragStart(em),
        legacyOnMoveClb: getOnComponentDrag(em),
        legacyOnEndMove: getOnComponentDragEnd(em, [toMove]),
        ...sorter.eventHandlers,
      };
      const element = (toMove as any).viewLayer?.el || ev.target;
      sorter.startSort([{ element }]);
    }
  }

  /**
   * Update item on status change
   * @param	Event
   * */
  updateStatus() {
    // @ts-ignore
    ComponentView.prototype.updateStatus.apply(this, [
      {
        avoidHover: !this.config.highlightHover,
        noExtHl: true,
      },
    ]);
  }

  getItemContainer() {
    return this.$el.children('[data-toggle-select]');
  }

  /**
   * Update item aspect after children changes
   *
   * @return void
   * */
  checkChildren() {
    const { model, clsNoChild, module } = this;
    const count = module.getComponents(model).length;
    const itemEl = this.getItemContainer();
    const title = itemEl.find(`.${this.clsTitle}`);
    const countEl = itemEl.find('[data-count]');

    title[count ? 'removeClass' : 'addClass'](clsNoChild);
    countEl.html(`${count || ''}`);
    !count && module.setOpen(model, false);
  }

  getCaret() {
    if (!this.caret || !this.caret.length) {
      this.caret = this.getItemContainer().find(`.${this.clsCaret}`);
    }

    return this.caret;
  }

  setRoot(cmp: Component | string) {
    const model = isString(cmp) ? this.em.getWrapper()?.find(cmp)[0]! : cmp;
    if (!model) return;
    this.stopListening();
    this.model = model;
    this.initComponent();
    this._rendered && this.render();
  }

  updateLayerable() {
    const { parentView } = this;
    const toRerender = parentView || this;
    toRerender.render();
  }

  __clearItems() {
    this.items?.remove();
  }

  remove(...args: []) {
    View.prototype.remove.apply(this, args);
    delete this.model.viewLayer;
    this.__clearItems();
    return this;
  }

  render() {
    const { model, config, pfx, ppfx, opt, sorter } = this;
    this.__clearItems();
    const { opened, module, ItemView } = opt;
    const hidden = !module.__isLayerable(model);
    const el = this.$el.empty();
    const level = opt.level + 1;
    delete this.inputName;
    this.items = new ItemsView({
      ItemView,
      collection: model.get('components'),
      config,
      sorter,
      opened,
      parentView: this,
      parent: model,
      level,
      module,
    });
    const children = this.items.render().$el;

    if (!config.showWrapper && level === 1) {
      el.append(children);
    } else {
      el.html(this.template(model));
      el.find(`.${this.clsChildren}`).append(children);
    }

    !module.isVisible(model) && (this.className += ` ${pfx}hide`);
    hidden && (this.className += ` ${ppfx}hidden`);
    el.attr('class', this.className!);
    this.updateStatus();
    this.updateOpening();
    this.updateVisibility();
    this.updateMove();
    this.__render();
    this._rendered = true;
    return this;
  }

  __render() {
    const { model, config, el } = this;
    const { onRender } = config;
    const opt = { component: model, el };
    onRender.bind(this)(opt);
    this.em.trigger('layer:render', opt);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/pages/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization
 * ```js
 * const editor = grapesjs.init({
 *  ....
 *  pageManager: {
 *    pages: [
 *      {
 *        id: 'page-id',
 *        styles: `.my-class { color: red }`, // or a JSON of styles
 *        component: '<div class="my-class">My element</div>', // or a JSON of components
 *      }
 *   ]
 *  },
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance
 *
 * ```js
 * const pageManager = editor.Pages;
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * [Page]: page.html
 * [Component]: component.html
 *
 * @module Pages
 */

import { isString, bindAll, unique, flatten } from 'underscore';
import { createId } from '../utils/mixins';
import { ModuleModel } from '../abstract';
import { ItemManagerModule } from '../abstract/Module';
import Pages from './model/Pages';
import Page, { PageProperties } from './model/Page';
import EditorModel from '../editor/model/Editor';
import ComponentWrapper from '../dom_components/model/ComponentWrapper';
import { AddOptions, RemoveOptions, SetOptions } from '../common';
import PagesEvents, { AbortOption, PageManagerConfig, SelectableOption } from './types';

const chnSel = 'change:selected';
const typeMain = 'main';

export default class PageManager extends ItemManagerModule<PageManagerConfig, Pages> {
  events = PagesEvents;
  storageKey = 'pages';

  get pages() {
    return this.all;
  }

  model: ModuleModel;

  getAll() {
    // this avoids issues during the TS build (some getAll are inconsistent)
    return [...this.all.models];
  }

  /**
   * Get all pages
   * @name getAll
   * @function
   * @returns {Array<[Page]>}
   * @example
   * const arrayOfPages = pageManager.getAll();
   */

  /**
   * Initialize module
   * @hideconstructor
   * @param {Object} config Configurations
   */
  constructor(em: EditorModel) {
    super(em, 'PageManager', new Pages([], em), PagesEvents);
    bindAll(this, '_onPageChange');
    const model = new ModuleModel(this, { _undo: true });
    this.model = model;
    this.pages.on('reset', this.__onReset, this);
    this.pages.on('all', this.__onChange, this);
    model.on(chnSel, this._onPageChange);
  }

  __onChange(event: string, page: Page, coll: Pages, opts?: any) {
    const { em, events } = this;
    const options = opts || coll;
    em.trigger(events.all, { event, page, options });
  }

  __onReset() {
    const firstPage = this.pages.at(0);
    firstPage && this.select(firstPage);
  }

  onLoad() {
    const { pages, config, em } = this;
    const opt = { silent: true };
    const configPages = config.pages?.map((page) => new Page(page, { em, config })) || [];
    pages.add(configPages, opt);
    const mainPage = !pages.length ? this.add({ type: typeMain }, opt) : this._initPage();
    mainPage && this.select(mainPage, opt);
  }

  _onPageChange(m: any, page: Page, opts: any) {
    const { em, events } = this;
    const lm = em.Layers;
    const mainComp = page.getMainComponent();
    lm && mainComp && lm.setRoot(mainComp);
    em.trigger(events.select, page, m.previous('selected'));
    this.__onChange(chnSel, page, opts);
  }

  postLoad() {
    const { em, model, pages } = this;
    const um = em.UndoManager;
    um.add(model);
    um.add(pages);
    pages.on('add remove reset change', (page, c, o) => {
      const options = o || c;
      em.changesUp(o || c, { page, options });
    });
  }

  /**
   * Add new page
   * @param {Object} props Page properties
   * @param {Object} [opts] Options
   * @returns {[Page]}
   * @example
   * const newPage = pageManager.add({
   *  id: 'new-page-id', // without an explicit ID, a random one will be created
   *  styles: `.my-class { color: red }`, // or a JSON of styles
   *  component: '<div class="my-class">My element</div>', // or a JSON of components
   * });
   */
  add(props: PageProperties, opts: AddOptions & SelectableOption & AbortOption = {}) {
    const { em, events } = this;
    props.id = props.id || this._createId();
    const add = () => {
      const page = this.pages.add(new Page(props, { em: this.em, config: this.config }), opts);
      opts.select && this.select(page);
      return page;
    };
    !opts.silent && em.trigger(events.addBefore, props, add, opts);
    return !opts.abort ? add() : undefined;
  }

  /**
   * Remove page
   * @param {String|[Page]} page Page or page id
   * @returns {[Page]} Removed Page
   * @example
   * const removedPage = pageManager.remove('page-id');
   * // or by passing the page
   * const somePage = pageManager.get('page-id');
   * pageManager.remove(somePage);
   */
  remove(page: string | Page, opts: RemoveOptions & AbortOption = {}) {
    const { em, events } = this;
    const pg = isString(page) ? this.get(page) : page;
    const rm = () => {
      pg && this.pages.remove(pg, opts);
      return pg;
    };
    !opts.silent && em.trigger(events.removeBefore, pg, rm, opts);
    return !opts.abort && rm();
  }

  /**
   * Move a page to a specific index in the pages collection.
   * If the index is out of bounds, the page will not be moved.
   *
   * @param {string|[Page]} page Page or page id to move.
   * @param {Object} [opts] Move options
   * @param {number} [opts.at] The target index where the page should be moved.
   * @returns {Page | undefined} The moved page, or `undefined` if the page does not exist or the index is out of bounds.
   * @example
   * // Move a page to index 2
   * const movedPage = pageManager.move('page-id', { at: 2 });
   * if (movedPage) {
   *   console.log('Page moved successfully:', movedPage);
   * } else {
   *   console.log('Page could not be moved.');
   * }
   */
  move(page: string | Page, opts: AddOptions = {}): Page | undefined {
    const { pages } = this;
    const pg = isString(page) ? this.get(page) : page;
    const { at = 0, ...resOpts } = opts;

    if (!pg) return;

    const currIndex = pages.indexOf(pg);
    const sameIndex = currIndex === at;

    if (at < 0 || at >= pages.length || sameIndex) return;

    this.remove(pg, { ...resOpts, temporary: true });
    pages.add(pg, { ...resOpts, at });

    return pg;
  }

  /**
   * Get page by id
   * @param {String} id Page id
   * @returns {[Page]}
   * @example
   * const somePage = pageManager.get('page-id');
   */
  get(id: string): Page | undefined {
    return this.pages.filter((p) => p.get(p.idAttribute) === id)[0];
  }

  /**
   * Get main page (the first one available)
   * @returns {[Page]}
   * @example
   * const mainPage = pageManager.getMain();
   */
  getMain() {
    const { pages } = this;
    return pages.filter((p) => p.get('type') === typeMain)[0] || pages.at(0);
  }

  /**
   * Get wrapper components (aka body) from all pages and frames.
   * @returns {Array<[Component]>}
   * @example
   * const wrappers = pageManager.getAllWrappers();
   * // Get all `image` components from the project
   * const allImages = wrappers.map(wrp => wrp.findType('image')).flat();
   */
  getAllWrappers(): ComponentWrapper[] {
    const pages = this.getAll();
    return unique(flatten(pages.map((page) => page.getAllFrames().map((frame) => frame.getComponent()))));
  }

  /**
   * Change the selected page. This will switch the page rendered in canvas
   * @param {String|[Page]} page Page or page id
   * @returns {this}
   * @example
   * pageManager.select('page-id');
   * // or by passing the page
   * const somePage = pageManager.get('page-id');
   * pageManager.select(somePage);
   */
  select(page: string | Page, opts: SetOptions = {}) {
    const { em, model, events } = this;
    const pg = isString(page) ? this.get(page) : page;
    if (pg) {
      em.trigger(events.selectBefore, pg, opts);
      model.set('selected', pg, opts);
    }
    return this;
  }

  /**
   * Get the selected page
   * @returns {[Page]}
   * @example
   * const selectedPage = pageManager.getSelected();
   */
  getSelected(): Page | undefined {
    return this.model.get('selected');
  }

  destroy() {
    this.pages.off().reset();
    this.model.stopListening();
    this.model.clear({ silent: true });
    //@ts-ignore
    ['selected', 'model'].map((i) => (this[i] = 0));
  }

  store() {
    return this.getProjectData();
  }

  load(data: any) {
    const result = this.loadProjectData(data, {
      all: this.pages,
      reset: true,
      onResult: (result: PageProperties[], opts: AddOptions) => {
        result.forEach((pageProps) => this.add(pageProps, opts));
        this.__onReset();
      },
    });
    this.pages.forEach((page) => page.getFrames().initRefs());
    return result;
  }

  _initPage() {
    return this.get(this.config.selected!) || this.getMain();
  }

  _createId() {
    const pages = this.getAll();
    const len = pages.length + 16;
    const pagesMap = this.getAllMap();
    let id;

    do {
      id = createId(len);
    } while (pagesMap[id]);

    return id;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/pages/types.ts

```typescript
import { ModuleConfig } from '../abstract/Module';
import { PageProperties } from './model/Page';

export interface PageManagerConfig extends ModuleConfig {
  /**
   * Default pages.
   */
  pages?: PageProperties[];

  /**
   * ID of the page to select on editor load.
   */
  selected?: string;
}

export interface SelectableOption {
  /**
   * Select the page.
   */
  select?: boolean;
}

export interface AbortOption {
  abort?: boolean;
}

/**{START_EVENTS}*/
export enum PagesEvents {
  /**
   * @event `page:add` Added new page. The page is passed as an argument to the callback.
   * @example
   * editor.on('page:add', (page) => { ... });
   */
  add = 'page:add',
  addBefore = 'page:add:before',

  /**
   * @event `page:remove` Page removed. The page is passed as an argument to the callback.
   * @example
   * editor.on('page:remove', (page) => { ... });
   */
  remove = 'page:remove',
  removeBefore = 'page:remove:before',

  /**
   * @event `page:select` New page selected. The newly selected page and the previous one, are passed as arguments to the callback.
   * @example
   * editor.on('page:select', (page, previousPage) => { ... });
   */
  select = 'page:select',
  selectBefore = 'page:select:before',

  /**
   * @event `page:update` Page updated. The updated page and the object containing changes are passed as arguments to the callback.
   * @example
   * editor.on('page:update', (page, changes) => { ... });
   */
  update = 'page:update',

  /**
   * @event `page` Catch-all event for all the events mentioned above. An object containing all the available data about the triggered event is passed as an argument to the callback.
   * @example
   * editor.on('page', ({ event, model, ... }) => { ... });
   */
  all = 'page',
}
/**{END_EVENTS}*/

// need this to avoid the TS documentation generator to break
export default PagesEvents;
```

--------------------------------------------------------------------------------

---[FILE: Page.ts]---
Location: grapesjs-dev/packages/core/src/pages/model/Page.ts

```typescript
import { forEach, result } from 'underscore';
import { PageManagerConfig } from '../types';
import Frames from '../../canvas/model/Frames';
import { Model } from '../../common';
import ComponentWrapper from '../../dom_components/model/ComponentWrapper';
import EditorModel from '../../editor/model/Editor';
import { CssRuleJSON } from '../../css_composer/model/CssRule';
import { ComponentDefinition } from '../../dom_components/model/types';

/** @private */
export interface PageProperties {
  /**
   * Panel id.
   */
  id?: string;

  /**
   * Page name.
   */
  name?: string;

  /**
   * HTML to load as page content.
   */
  component?: string | ComponentDefinition | ComponentDefinition[];

  /**
   * CSS to load with the page.
   */
  styles?: string | CssRuleJSON[];

  [key: string]: unknown;
}

export interface PagePropertiesDefined extends Pick<PageProperties, 'id' | 'name'> {
  frames: Frames;
  [key: string]: unknown;
}

export default class Page extends Model<PagePropertiesDefined> {
  defaults() {
    return {
      name: '',
      frames: [] as unknown as Frames,
      _undo: true,
    };
  }
  em: EditorModel;

  constructor(props: any, opts: { em?: EditorModel; config?: PageManagerConfig } = {}) {
    super(props, opts);
    const { em } = opts;
    const defFrame: any = {};
    this.em = em!;
    if (!props.frames) {
      defFrame.component = props.component;
      defFrame.styles = props.styles;
      ['component', 'styles'].map((i) => this.unset(i));
    }
    const frms: any[] = props.frames || [defFrame];
    const frames = new Frames(em!.Canvas, frms);
    frames.page = this;
    this.set('frames', frames);
    !this.getId() && this.set('id', em?.Pages._createId());
    em?.UndoManager.add(frames);
  }

  onRemove() {
    this.getFrames().reset();
  }

  getFrames() {
    return this.get('frames')!;
  }

  /**
   * Get page id
   * @returns {String}
   */
  getId() {
    return this.id as string;
  }

  /**
   * Get page name
   * @returns {String}
   */
  getName() {
    return this.get('name')!;
  }

  /**
   * Update page name
   * @param {String} name New page name
   * @example
   * page.setName('New name');
   */
  setName(name: string) {
    return this.set({ name });
  }

  /**
   * Get all frames
   * @returns {Array<Frame>}
   * @example
   * const arrayOfFrames = page.getAllFrames();
   */
  getAllFrames() {
    return this.getFrames().models || [];
  }

  /**
   * Get the first frame of the page (identified always as the main one)
   * @returns {Frame}
   * @example
   * const mainFrame = page.getMainFrame();
   */
  getMainFrame() {
    return this.getFrames().at(0);
  }

  /**
   * Get the root component (usually is the `wrapper` component) from the main frame
   * @returns {Component}
   * @example
   * const rootComponent = page.getMainComponent();
   * console.log(rootComponent.toHTML());
   */
  getMainComponent(): ComponentWrapper {
    const frame = this.getMainFrame();
    return frame?.getComponent();
  }

  toJSON(opts = {}) {
    const obj = Model.prototype.toJSON.call(this, opts);
    const defaults = result(this, 'defaults');

    // Remove private keys
    forEach(obj, (value, key) => {
      key.indexOf('_') === 0 && delete obj[key];
    });

    forEach(defaults, (value, key) => {
      if (obj[key] === value) delete obj[key];
    });

    return obj;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Pages.ts]---
Location: grapesjs-dev/packages/core/src/pages/model/Pages.ts

```typescript
import { Collection, RemoveOptions } from '../../common';
import EditorModel from '../../editor/model/Editor';
import Page from './Page';

export default class Pages extends Collection<Page> {
  constructor(models: any, em: EditorModel) {
    super(models);
    this.on('reset', this.onReset);
    this.on('remove', this.onRemove);

    // @ts-ignore We need to inject `em` for pages created on reset from the Storage load
    this.model = (props: {}, opts = {}) => {
      return new Page(props, { ...opts, em });
    };
  }

  onReset(m: Page, opts?: RemoveOptions & { previousModels?: Pages }) {
    opts?.previousModels?.map((p) => this.onRemove(p, this, opts));
  }

  onRemove(removed?: Page, _p?: this, opts: RemoveOptions = {}) {
    // Avoid removing frames if triggered from undo #6142
    if (opts.fromUndo || opts.temporary) return;
    removed?.onRemove();
  }
}
```

--------------------------------------------------------------------------------

````
