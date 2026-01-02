---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 65
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 65 of 97)

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

---[FILE: PropertyNumberView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/PropertyNumberView.ts

```typescript
import PropertyView from './PropertyView';

export default class PropertyNumberView extends PropertyView {
  inputInst?: any;

  templateInput(m: any) {
    return '';
  }

  init() {
    const model = this.model;
    this.listenTo(model, 'change:unit', this.onValueChange);
    this.listenTo(model, 'change:units', this.render);
  }

  setValue(v: string) {
    // handled by this.inputInst
  }

  onRender() {
    const { ppfx, model, el } = this;

    if (!this.inputInst) {
      const { input } = model as any;
      input.ppfx = ppfx;
      input.render();
      const fields = el.querySelector(`.${ppfx}fields`)!;
      fields.appendChild(input.el);
      this.input = input.inputEl.get(0);
      this.inputInst = input;
    }
  }

  clearCached() {
    PropertyView.prototype.clearCached.apply(this, arguments as any);
    this.inputInst = null;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertyRadioView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/PropertyRadioView.ts

```typescript
import PropertySelectView from './PropertySelectView';
import PropertyRadio from '../model/PropertyRadio';

export default class PropertyRadioView extends PropertySelectView {
  templateInput() {
    const { ppfx } = this;
    return `<div class="${ppfx}field ${ppfx}field-radio"></div>`;
  }

  onRender() {
    const { pfx, ppfx } = this;
    const model = this.model as PropertyRadio;
    const itemCls = `${ppfx}radio-item-label`;
    const prop = model.getName();
    const options = model.getOptions();
    const clsInput = `${pfx}radio ${pfx}radio-${prop}`;
    const { cid } = model;

    if (!this.input) {
      const optionsRes: string[] = [];

      options.forEach((opt) => {
        const cls = opt.className ? `${opt.className} ${pfx}icon ${itemCls}` : '';
        const id = model.getOptionId(opt);
        const elId = `${prop}-${id}-${cid}`;
        const labelEl = cls ? '' : model.getOptionLabel(id);
        const titleAttr = opt.title ? `title="${opt.title}"` : '';
        const checked = model.getValue() === id ? 'checked' : '';
        optionsRes.push(`
          <div class="${ppfx}radio-item">
            <input type="radio" class="${clsInput}" id="${elId}" name="${prop}-${cid}" value="${id}" ${checked}/>
            <label class="${cls || itemCls}" ${titleAttr} for="${elId}">${labelEl}</label>
          </div>
        `);
      });

      const inputHld = this.el.querySelector(`.${ppfx}field`)!;
      inputHld.innerHTML = `<div class="${ppfx}radio-items">${optionsRes.join('')}</div>`;
      this.input = inputHld.firstChild as HTMLInputElement;
    }
  }

  __setValueInput(value: string) {
    const { model } = this;
    const id = value || model.getDefaultValue();
    const inputIn = this.getInputEl()?.querySelector(`[value="${id}"]`) as HTMLInputElement;
    inputIn && (inputIn.checked = true);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertySelectView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/PropertySelectView.ts

```typescript
import PropertySelect from '../model/PropertySelect';
import PropertyView from './PropertyView';

export default class PropertySelectView extends PropertyView {
  templateInput() {
    const { pfx, ppfx } = this;
    return `
      <div class="${ppfx}field ${ppfx}select">
        <span id="${pfx}input-holder"></span>
        <div class="${ppfx}sel-arrow">
          <div class="${ppfx}d-s-arrow"></div>
        </div>
      </div>
    `;
  }

  constructor(o: any) {
    super(o);
    this.listenTo(this.model, 'change:options', this.updateOptions);
  }

  updateOptions() {
    delete this.input;
    this.onRender();
  }

  onRender() {
    const { pfx } = this;
    const model = this.model as PropertySelect;
    const options = model.getOptions();

    if (!this.input) {
      const optionsRes: string[] = [];

      options.forEach((option) => {
        const id = model.getOptionId(option);
        const name = model.getOptionLabel(id);
        const style = option.style ? option.style.replace(/"/g, '&quot;') : '';
        const styleAttr = style ? `style="${style}"` : '';
        const value = id.replace(/"/g, '&quot;');
        optionsRes.push(`<option value="${value}" ${styleAttr}>${name}</option>`);
      });

      const inputH = this.el.querySelector(`#${pfx}input-holder`)!;
      inputH.innerHTML = `<select>${optionsRes.join('')}</select>`;
      this.input = inputH.firstChild as HTMLInputElement;
    }
  }

  __setValueInput(value: string) {
    const model = this.model as PropertySelect;
    const input = this.getInputEl();
    const firstOpt = model.getOptions()[0];
    const firstId = firstOpt ? model.getOptionId(firstOpt) : '';
    input && (input.value = value || firstId);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertySliderView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/PropertySliderView.ts

```typescript
import PropertyNumber from '../model/PropertyNumber';
import PropertyNumberView from './PropertyNumberView';

export default class PropertySliderView extends PropertyNumberView {
  slider?: HTMLInputElement;

  events() {
    return {
      ...PropertyNumberView.prototype.events(),
      'change [type=range]': 'inputValueChanged',
      'input [type=range]': 'inputValueChangedSoft',
      change: '',
    };
  }

  templateInput(model: PropertyNumber) {
    const { ppfx } = this;
    return `
      <div class="${ppfx}field ${ppfx}field-range">
        <input type="range" min="${model.get('min')}" max="${model.get('max')}" step="${model.get('step')}"/>
      </div>
    `;
  }

  getSliderEl() {
    if (!this.slider) {
      this.slider = this.el.querySelector('input[type=range]')!;
    }

    return this.slider;
  }

  inputValueChanged(ev: Event) {
    ev.stopPropagation();
    this.model.upValue(this.getSliderEl().value);
  }

  inputValueChangedSoft(ev: Event) {
    ev.stopPropagation();
    this.model.upValue(this.getSliderEl().value, { partial: true });
  }

  setValue(value: string) {
    const { model } = this;
    const parsed = model.parseValue(value);
    // @ts-ignore
    this.getSliderEl().value = value === '' ? model.getDefaultValue() : parseFloat(parsed.value);
    PropertyNumberView.prototype.setValue.apply(this, arguments as any);
  }

  onRender() {
    PropertyNumberView.prototype.onRender.apply(this, arguments as any);

    // @ts-ignore
    if (!this.model.get('showInput')) {
      this.inputInst.el.style.display = 'none';
    }
  }

  clearCached() {
    PropertyNumberView.prototype.clearCached.apply(this, arguments as any);
    delete this.slider;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertyStackView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/PropertyStackView.ts

```typescript
import PropertyCompositeView from './PropertyCompositeView';
import PropertiesView from './PropertiesView';
import LayersView from './LayersView';
import PropertyStack from '../model/PropertyStack';

export default class PropertyStackView extends PropertyCompositeView {
  // @ts-ignore
  model: PropertyStack;
  layersView?: LayersView;

  events() {
    return {
      ...PropertyCompositeView.prototype.events(),
      'click [data-add-layer]': 'addLayer',
      change: '',
    };
  }

  templateInput() {
    const { pfx, em } = this;
    const icons = em?.getConfig().icons;
    const iconPlus = icons?.plus || '+';
    return `
      <div class="${pfx}field ${pfx}stack">
        <button type="button" id="${pfx}add" data-add-layer>
          ${iconPlus}
        </button>
        <div data-layers-wrapper></div>
      </div>
    `;
  }

  init() {
    const { model } = this;
    this.listenTo(model.layers, 'change reset', this.updateStatus);
    this.listenTo(model, 'change:isEmptyValue', this.updateStatus);
  }

  addLayer() {
    this.model.addLayer({}, { at: 0 });
  }

  /**
   * There is no need to handle input update by the property itself,
   * this will be done by layers
   * @private
   */
  setValue() {}

  remove() {
    this.layersView?.remove();
    PropertyCompositeView.prototype.remove.apply(this, arguments as any);
    return this;
  }

  clearCached() {
    PropertyCompositeView.prototype.clearCached.apply(this, arguments as any);
    delete this.layersView;
  }

  onRender() {
    const { model, el, config } = this;
    const props = model.get('properties')!;

    if (props.length && !this.props) {
      const propsView = new PropertiesView({
        config: {
          ...config,
          highlightComputed: false,
          highlightChanged: false,
        },
        // @ts-ignore
        collection: props,
        parent: this,
      });
      propsView.render();

      const layersView = new LayersView({
        collection: model.layers,
        // @ts-ignore
        config,
        propertyView: this,
      });
      layersView.render();

      const fieldEl = el.querySelector('[data-layers-wrapper]')!;
      fieldEl.appendChild(layersView.el);
      this.props = propsView;
      this.layersView = layersView;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertyView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/PropertyView.ts

```typescript
import { bindAll, isUndefined, debounce } from 'underscore';
import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { isObject } from '../../utils/mixins';
import Property from '../model/Property';
import { StyleProps } from '../../domain_abstract/model/StyleableModel';

const clearProp = 'data-clear-style';

export interface ICustomPropertyView {
  create?: (data: ReturnType<PropertyView['_getClbOpts']>) => any;
  destroy?: (data: ReturnType<PropertyView['_getClbOpts']>) => any;
  update?: (data: ReturnType<PropertyView['_getClbOpts']> & { value: string }) => any;
  emit?: (data: ReturnType<PropertyView['_getClbOpts']>, ...args: any) => any;
  unset?: (data: ReturnType<PropertyView['_getClbOpts']>) => any;
}

export type CustomPropertyView<T> = ICustomPropertyView & T & ThisType<T & PropertyView>;

export default class PropertyView extends View<Property> {
  em: EditorModel;
  pfx: string;
  ppfx: string;
  config: any;
  parent?: PropertyView;
  __destroyFn!: Function;
  create?: Function;
  destroy?: Function;
  update?: Function;
  emit?: Function;
  unset?: Function;
  clearEl?: HTMLElement;
  createdEl?: HTMLElement;
  input?: HTMLInputElement;
  $input?: any;

  constructor(o = {}) {
    super(o);
    bindAll(this, '__change', '__updateStyle');
    // @ts-ignore
    const config = o.config || {};
    const { em } = config;
    this.config = config;
    this.em = em;
    this.pfx = config.stylePrefix || '';
    this.ppfx = config.pStylePrefix || '';
    this.__destroyFn = this.destroy ? this.destroy.bind(this) : () => {};
    const { model } = this;
    // @ts-ignore
    model.view = this;

    // Put a sligh delay on debounce in order to execute the update
    // post styleManager.__upProps trigger.
    this.onValueChange = debounce(this.onValueChange.bind(this), 10);
    this.updateStatus = debounce(this.updateStatus.bind(this), 0);

    this.listenTo(model, 'destroy remove', this.remove);
    this.listenTo(model, 'change:visible', this.updateVisibility);
    this.listenTo(model, 'change:name change:className change:full', this.render);
    this.listenTo(model, 'change:value', this.onValueChange);
    this.listenTo(model, 'change:parentTarget', this.updateStatus);
    this.listenTo(em, 'change:device', this.onValueChange);

    // @ts-ignore
    const init = this.init && this.init.bind(this);
    init && init();
  }

  events() {
    return {
      change: 'inputValueChanged',
      [`click [${clearProp}]`]: 'clear',
    };
  }

  template(model: any) {
    const { pfx, ppfx } = this;
    return `
      <div class="${pfx}label" data-sm-label></div>
      <div class="${ppfx}fields" data-sm-fields></div>
    `;
  }

  templateLabel(model: Property) {
    const { pfx, em } = this;
    const { parent } = model;
    const { icon = '', info = '' } = model.attributes;
    const icons = em?.getConfig().icons;
    const iconClose = icons?.close || '';

    return `
      <span class="${pfx}icon ${icon}" title="${info}">
        ${model.getLabel()}
      </span>
      ${!parent ? `<div class="${pfx}clear" style="display: none" ${clearProp}>${iconClose}</div>` : ''}
    `;
  }

  templateInput(model: Property) {
    return `
      <div class="${this.ppfx}field">
        <input placeholder="${model.getDefaultValue()}"/>
      </div>
    `;
  }

  remove() {
    View.prototype.remove.apply(this, arguments as any);
    // @ts-ignore
    ['em', 'input', '$input', 'view'].forEach((i) => (this[i] = null));
    this.__destroyFn(this._getClbOpts());
    return this;
  }

  /**
   * Triggers when the status changes. The status indicates if the value of
   * the proprerty is changed or inherited
   * @private
   */
  updateStatus() {
    const { model, pfx, ppfx, config } = this;
    const updatedCls = `${ppfx}four-color`;
    const computedCls = `${ppfx}color-warn`;
    const labelEl = this.$el.children(`.${pfx}label`);
    const clearStyleEl = this.getClearEl();
    const clearStyle = clearStyleEl ? clearStyleEl.style : ({} as CSSStyleDeclaration);
    labelEl.removeClass(`${updatedCls} ${computedCls}`);
    clearStyle.display = 'none';

    if (model.hasValue({ noParent: true }) && config.highlightChanged) {
      labelEl.addClass(updatedCls);
      config.clearProperties && (clearStyle.display = '');
    } else if (model.hasValue() && config.highlightComputed) {
      labelEl.addClass(computedCls);
    }

    this.parent?.updateStatus();
  }

  /**
   * Clear the property from the target
   */
  clear(ev: Event) {
    ev && ev.stopPropagation();
    this.model.clear();
  }

  /**
   * Get clear element
   * @return {HTMLElement}
   */
  getClearEl() {
    if (!this.clearEl) {
      this.clearEl = this.el.querySelector(`[${clearProp}]`)!;
    }

    return this.clearEl;
  }

  /**
   * Triggers when the value of element input/s is changed, so have to update
   * the value of the model which will propogate those changes to the target
   */
  inputValueChanged(ev: any) {
    ev && ev.stopPropagation();
    // Skip the default update in case a custom emit method is defined
    if (this.emit) return;
    this.model.upValue(ev.target.value);
  }

  onValueChange(m: any, val: any, opt: any = {}) {
    this.setValue(this.model.getFullValue(undefined, { skipImportant: true }));
    this.updateStatus();
  }

  /**
   * Update the element input.
   * Usually the value is a result of `model.getFullValue()`
   * @param {String} value The value from the model
   * */
  setValue(value: string) {
    const { model } = this;
    const result = isUndefined(value) || value === '' ? model.getDefaultValue() : value;
    if (this.update) return this.__update(result);
    this.__setValueInput(result);
  }

  __setValueInput(value: string) {
    const input = this.getInputEl();
    input && (input.value = value);
  }

  getInputEl() {
    if (!this.input) {
      this.input = this.el.querySelector('input')!;
    }

    return this.input;
  }

  updateVisibility() {
    this.el.style.display = this.model.isVisible() ? '' : 'none';
  }

  clearCached() {
    delete this.clearEl;
    delete this.input;
    delete this.$input;
  }

  __unset() {
    const unset = this.unset && this.unset.bind(this);
    unset && unset(this._getClbOpts());
  }

  __update(value: string) {
    const update = this.update && this.update.bind(this);
    update &&
      update({
        ...this._getClbOpts(),
        value,
      });
  }

  __change(...args: any) {
    const emit = this.emit && this.emit.bind(this);
    emit && emit(this._getClbOpts(), ...args);
  }

  __updateStyle(value: string | StyleProps, { complete, partial, ...opts }: any = {}) {
    const { model } = this;
    const final = complete !== false && partial !== true;

    if (isObject(value)) {
      model.__upTargetsStyle(value as StyleProps, { avoidStore: !final });
    } else {
      model.upValue(value, { partial: !final });
    }
  }

  _getClbOpts() {
    const { model, el, createdEl } = this;
    return {
      el,
      createdEl,
      property: model,
      props: model.attributes,
      change: this.__change,
      updateStyle: this.__updateStyle,
    };
  }

  render() {
    this.clearCached();
    const { pfx, model, el, $el } = this;
    const name = model.getName();
    const type = model.getType();
    const cls = model.get('className') || '';
    const className = `${pfx}property`;
    // Support old integer classname
    const clsType = type === 'number' ? `${pfx}${type} ${pfx}integer` : `${pfx}${type}`;

    this.createdEl && this.__destroyFn(this._getClbOpts());
    $el.empty().append(this.template(model));
    $el.find('[data-sm-label]').append(this.templateLabel(model));
    const create = this.create && this.create.bind(this);
    this.createdEl = create && create(this._getClbOpts());
    $el.find('[data-sm-fields]').append(this.createdEl || this.templateInput(model));

    el.className = `${className} ${clsType} ${className}__${name} ${cls}`.trim();
    el.className += model.isFull() ? ` ${className}--full` : '';

    const onRender = this.onRender && this.onRender.bind(this);
    onRender && onRender();
    this.setValue(model.getValue());
    return this;
  }

  onRender() {}
}
```

--------------------------------------------------------------------------------

---[FILE: SectorsView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/SectorsView.ts

```typescript
import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { appendAtIndex } from '../../utils/dom';
import { StyleManagerConfig } from '../config/config';
import Sector from '../model/Sector';
import Sectors from '../model/Sectors';
import SectorView from './SectorView';

export default class SectorsView extends View {
  pfx: string;
  ppfx: string;
  config: StyleManagerConfig;
  module: any;

  constructor(
    o: { module?: any; config?: StyleManagerConfig; el?: HTMLElement; em?: EditorModel; collection?: Sectors } = {},
  ) {
    // @ts-ignore
    super(o);
    const { module, config } = o;
    const coll = this.collection;
    this.pfx = config?.stylePrefix || '';
    this.ppfx = config?.pStylePrefix || '';
    this.config = config!;
    this.module = module!;
    this.listenTo(coll, 'add', this.addTo);
    this.listenTo(coll, 'reset', this.render);
  }

  remove() {
    View.prototype.remove.apply(this, arguments as any);
    ['config', 'module', 'em'].forEach(
      (i) =>
        // @ts-ignore
        (this[i] = {}),
    );
    return this;
  }

  addTo(model: Sector, c: any, opts = {}) {
    this.addToCollection(model, null, opts);
  }

  addToCollection(model: Sector, fragmentEl: DocumentFragment | null, opts: { at?: number } = {}) {
    const { config, el } = this;
    const appendTo = fragmentEl || el;
    const rendered = new SectorView({ model, config }).render().el;
    appendAtIndex(appendTo, rendered, opts.at);

    return rendered;
  }

  render() {
    const { $el, pfx, ppfx } = this;
    $el.empty();
    const frag = document.createDocumentFragment();
    this.collection.each((model) => this.addToCollection(model, frag));
    $el.append(frag);
    $el.addClass(`${pfx}sectors ${ppfx}one-bg ${ppfx}two-color`);
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: SectorView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/SectorView.ts

```typescript
import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import html from '../../utils/html';
import { StyleManagerConfig } from '../config/config';
import Sector from '../model/Sector';
import PropertiesView from './PropertiesView';

export default class SectorView extends View<Sector> {
  em: EditorModel;
  config: StyleManagerConfig;
  pfx: string;

  constructor(o: { config: StyleManagerConfig; model?: Sector }) {
    super(o);
    const config = o.config || {};
    const { model } = this;
    // @ts-ignore
    const { em } = config;
    this.config = config;
    this.em = em;
    this.pfx = config.stylePrefix || '';
    this.listenTo(model, 'destroy remove', this.remove);
    this.listenTo(model, 'change:open', this.updateOpen);
    this.listenTo(model, 'change:visible', this.updateVisibility);
  }

  template({ pfx, label }: { pfx?: string; label: string }) {
    const icons = this.em?.getConfig().icons;
    const iconCaret = icons?.caret || '';
    const clsPfx = `${pfx}sector-`;

    return html`
      <div class="${clsPfx}title" data-sector-title>
        <div class="${clsPfx}caret">$${iconCaret}</div>
        <div class="${clsPfx}label">${label}</div>
      </div>
    `;
  }

  events() {
    return {
      'click [data-sector-title]': 'toggle',
    };
  }

  updateOpen() {
    const { $el, model, pfx } = this;
    const isOpen = model.isOpen();
    $el[isOpen ? 'addClass' : 'removeClass'](`${pfx}open`);
    this.getPropertiesEl().style.display = isOpen ? '' : 'none';
  }

  updateVisibility() {
    this.el.style.display = this.model.isVisible() ? '' : 'none';
  }

  getPropertiesEl() {
    const { $el, pfx } = this;
    return $el.find(`.${pfx}properties`).get(0)!;
  }

  toggle() {
    const { model } = this;
    model.setOpen(!model.get('open'));
  }

  renderProperties() {
    const { model, config } = this;
    const objs = model.get('properties');

    if (objs) {
      // @ts-ignore
      const view = new PropertiesView({ collection: objs, config });
      this.$el.append(view.render().el);
    }
  }

  render() {
    const { pfx, model, $el } = this;
    const id = model.getId();
    const label = model.getName();
    $el.html(this.template({ pfx, label }));
    this.renderProperties();
    $el.attr('class', `${pfx}sector ${pfx}sector__${id} no-select`);
    this.updateOpen();
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/trait_manager/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  traitManager: {
 *    // options
 *  }
 * })
 * ```
 *
 *
 * Once the editor is instantiated you can use the API below and listen to the events. Before using these methods, you should get the module from the instance.
 *
 * ```js
 * // Listen to events
 * editor.on('trait:value', () => { ... });
 *
 * // Use the Trait Manager API
 * const tm = editor.Traits;
 * tm.select(...)
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * [Component]: component.html
 * [Trait]: trait.html
 *
 * @module Traits
 */

import { bindAll, debounce } from 'underscore';
import { Module } from '../abstract';
import { Model } from '../common';
import Component from '../dom_components/model/Component';
import EditorModel from '../editor/model/Editor';
import defConfig from './config/config';
import {
  CustomTrait,
  TraitCustomData,
  TraitManagerConfigModule,
  TraitModuleStateProps,
  TraitViewTypes,
  TraitsByCategory,
  TraitsEvents,
} from './types';
import TraitButtonView from './view/TraitButtonView';
import TraitCheckboxView from './view/TraitCheckboxView';
import TraitColorView from './view/TraitColorView';
import TraitNumberView from './view/TraitNumberView';
import TraitSelectView from './view/TraitSelectView';
import TraitView from './view/TraitView';
import TraitsView from './view/TraitsView';
import Category, { getItemsByCategory } from '../abstract/ModuleCategory';
import Trait from './model/Trait';

export default class TraitManager extends Module<TraitManagerConfigModule> {
  __ctn?: HTMLElement;
  view?: TraitsView;

  TraitsView = TraitsView;
  events = TraitsEvents;
  state = new Model<TraitModuleStateProps>({ traits: [] });
  types: TraitViewTypes = {
    text: TraitView,
    number: TraitNumberView,
    select: TraitSelectView,
    checkbox: TraitCheckboxView,
    color: TraitColorView,
    button: TraitButtonView,
  };

  /**
   * Get configuration object
   * @name getConfig
   * @function
   * @returns {Object}
   */

  /**
   * Initialize module
   * @private
   */
  constructor(em: EditorModel) {
    super(em, 'TraitManager', defConfig() as any);
    const { state, config, events } = this;
    const ppfx = config.pStylePrefix;
    ppfx && (config.stylePrefix = `${ppfx}${config.stylePrefix}`);
    bindAll(this, '__onSelect');

    const upAll = debounce(() => this.__upSel(), 0);
    const update = debounce(() => this.__onUp(), 0);
    state.listenTo(em, 'component:toggled', upAll);
    state.listenTo(em, events.value, update);
    state.on('change:traits', this.__onSelect);

    this.debounced = [upAll, update];
  }

  /**
   * Select traits from a component.
   * @param {[Component]} component
   * @example
   * tm.select(someComponent);
   */
  select(component?: Component) {
    const traits = component?.getTraits() || [];
    this.state.set({ component, traits });
    this.__trgCustom();
  }

  /**
   * Get trait categories from the currently selected component.
   * @returns {Array<Category>}
   * @example
   * const traitCategories: Category[] = tm.getCategories();
   *
   */
  getCategories(): Category[] {
    const cmp = this.getComponent();
    const categories = cmp?.traits.categories?.models || [];
    return [...categories];
  }

  /**
   * Get traits from the currently selected component.
   * @returns {Array<[Trait]>}
   * @example
   * const currentTraits: Trait[] = tm.getTraits();
   */
  getTraits() {
    return this.getCurrent();
  }

  /**
   * Get traits by category from the currently selected component.
   * @example
   * tm.getTraitsByCategory();
   * // Returns an array of items of this type
   * // > { category?: Category; items: Trait[] }
   *
   * // NOTE: The item without category is the one containing traits without category.
   *
   * // You can also get the same output format by passing your own array of Traits
   * const myFilteredTraits: Trait[] = [...];
   * tm.getTraitsByCategory(myFilteredTraits);
   */
  getTraitsByCategory(traits?: Trait[]): TraitsByCategory[] {
    return getItemsByCategory<Trait>(traits || this.getTraits());
  }

  /**
   * Get component from the currently selected traits.
   * @example
   * tm.getComponent();
   * // Component {}
   */
  getComponent() {
    return this.state.attributes.component;
  }

  /**
   * Add new trait type.
   * More about it here: [Define new Trait type](https://grapesjs.com/docs/modules/Traits.html#define-new-trait-type).
   * @param {string} name Type name.
   * @param {Object} methods Object representing the trait.
   */
  addType<T>(name: string, methods: CustomTrait<T>) {
    const baseView = this.getType('text');
    //@ts-ignore
    this.types[name] = baseView.extend(methods);
  }

  /**
   * Get trait type
   * @param {string} name Type name
   * @returns {Object}
   * @private
   * const traitView = tm.getType('text');
   */
  getType(name: string) {
    return this.getTypes()[name];
  }

  /**
   * Get all trait types
   * @returns {Object}
   * @private
   */
  getTypes() {
    return this.types;
  }

  /**
   *
   * Get Traits viewer
   * @private
   */
  getTraitsViewer() {
    return this.view;
  }

  getCurrent() {
    return this.state.get('traits') || [];
  }

  render() {
    let { view } = this;
    const { em } = this;
    view = new TraitsView(
      {
        el: view?.el,
        collection: [],
        editor: em,
        config: this.getConfig(),
      },
      this.getTypes(),
    );
    this.view = view;
    return view.el;
  }

  postRender() {
    this.__appendTo();
  }

  __onSelect() {
    const { em, events, state } = this;
    const { component, traits } = state.attributes;
    em.trigger(events.select, { component, traits });
  }

  __trgCustom(opts: TraitCustomData = {}) {
    const { em, events, __ctn } = this;
    this.__ctn = __ctn || opts.container;
    em.trigger(events.custom, this.__customData());
  }

  __customData(): TraitCustomData {
    return { container: this.__ctn };
  }

  __upSel() {
    this.select(this.em.getSelected());
  }

  __onUp() {
    this.select(this.getComponent());
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/types.ts

```typescript
import { CategoryProperties, ItemsByCategory } from '../abstract/ModuleCategory';
import Component from '../dom_components/model/Component';
import Editor from '../editor';
import EditorModel from '../editor/model/Editor';
import { TraitManagerConfig } from './config/config';
import Trait from './model/Trait';
import TraitView from './view/TraitView';

export interface TraitViewTypes {
  [id: string]: { new (o: any): TraitView };
}

export interface ITraitView {
  noLabel?: TraitView['noLabel'];
  eventCapture?: TraitView['eventCapture'];
  templateInput?: TraitView['templateInput'];
  onEvent?: TraitView['onEvent'];
  onUpdate?: TraitView['onUpdate'];
  createInput?: TraitView['createInput'];
  createLabel?: TraitView['createLabel'];
}

export type CustomTrait<T> = ITraitView & T & ThisType<T & TraitView>;

export interface TraitModuleStateProps {
  component?: Component;
  traits: Trait[];
}

export interface TraitsByCategory extends ItemsByCategory<Trait> {}

export interface TraitManagerConfigModule extends TraitManagerConfig {
  pStylePrefix?: string;
  em: EditorModel;
}

export interface TraitCustomData {
  container?: HTMLElement;
}

export interface TraitProperties {
  /**
   * Trait type, defines how the trait should be rendered.
   * Possible values: `text` (default), `number`, `select`, `checkbox`, `color`, `button`
   */
  type?: string;

  /**
   * The name of the trait used as a key for the attribute/property.
   * By default, the name is used as attribute name or property in case `changeProp` in enabled.
   */
  name?: string;

  /**
   * Trait id, eg. `my-trait-id`.
   * If not specified, the `name` will be used as id.
   */
  id?: string | number;

  /**
   * Trait category.
   * @default ''
   */
  category?: string | CategoryProperties;

  /**
   * The trait label to show for the rendered trait.
   */
  label?: string | false;

  /**
   * If `true`, the trait value is applied on the component property, otherwise, on component attributes.
   * @default false
   */
  changeProp?: boolean;

  /**
   * Instead of relying on component props/attributes, define your own
   * logic on how to get the trait value.
   */
  getValue?: (props: { editor: Editor; trait: Trait; component: Component }) => any;

  /**
   * In conjunction with the `getValue`, define your own logic for updating the trait value.
   */
  setValue?: (props: {
    value: any;
    editor: Editor;
    trait: Trait;
    component: Component;
    partial: boolean;
    options: TraitSetValueOptions;
    emitUpdate: () => void;
  }) => void;

  /**
   * Custom true value for checkbox type.
   * @default 'true'
   */
  valueTrue?: string;

  /**
   * Custom false value for checkbox type.
   * * @default 'false'
   */
  valueFalse?: string;

  /**
   * Minimum number value for number type.
   */
  min?: number;

  /**
   * Maximum number value for number type.
   */
  max?: number;
  unit?: string;

  /**
   * Number of steps for number type.
   */
  step?: number;
  value?: any;
  target?: Component;
  default?: any;

  /**
   * Placeholder to show inside the default input (if the UI type allows it).
   */
  placeholder?: string;

  /**
   * Array of options for the select type.
   */
  options?: TraitOption[];

  /**
   * Label text to use for the button type.
   */
  text?: string;
  labelButton?: string;

  /**
   * Command to use for the button type.
   */
  command?: string | ((editor: Editor, trait: Trait) => any);

  full?: boolean;
  attributes?: Record<string, any>;
}

export interface TraitSetValueOptions {
  partial?: boolean;
  [key: string]: unknown;
}

export interface TraitGetValueOptions {
  /**
   * Get the value based on type.
   * With this option enabled, the returned value is normalized based on the
   * trait type (eg. the checkbox will always return a boolean).
   * @default false
   */
  useType?: boolean;

  /**
   * If false, return the value
   * If true and the value is a data resolver, return the data resolver props
   * @default false
   */
  skipResolve?: boolean;
}

export interface TraitOption {
  id: string;
  label?: string;
  [key: string]: unknown;
}

export type TraitsEvent = `${TraitsEvents}`;

/**{START_EVENTS}*/
export enum TraitsEvents {
  /**
   * @event `trait:select` New traits selected (eg. by changing a component).
   * @example
   * editor.on('trait:select', ({ traits, component }) => { ... });
   */
  select = 'trait:select',

  /**
   * @event `trait:value` Trait value updated.
   * @example
   * editor.on('trait:value', ({ trait, component, value }) => { ... });
   */
  value = 'trait:value',

  /**
   * @event `trait:category:update` Trait category updated.
   * @example
   * editor.on('trait:category:update', ({ category, changes }) => { ... });
   */
  categoryUpdate = 'trait:category:update',

  /**
   * @event `trait:custom` Event to use in case of [custom Trait Manager UI](https://grapesjs.com/docs/modules/Traits.html#custom-trait-manager).
   * @example
   * editor.on('trait:custom', ({ container }) => { ... });
   */
  custom = 'trait:custom',

  /**
   * @event `trait` Catch-all event for all the events mentioned above. An object containing all the available data about the triggered event is passed as an argument to the callback.
   * @example
   * editor.on('trait', ({ event, model, ... }) => { ... });
   */
  all = 'trait',
}
/**{END_EVENTS}*/

// need this to avoid the TS documentation generator to break
export default TraitsEvents;
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/config/config.ts

```typescript
export interface TraitManagerConfig {
  /**
   * Style prefix.
   * @default 'trt-'
   */
  stylePrefix?: string;

  /**
   * Specify the element to use as a container, string (query) or HTMLElement.
   * With the empty value, nothing will be rendered.
   * @default ''
   */
  appendTo?: string | HTMLElement;

  /**
   * Avoid rendering the default Trait Manager UI.
   * More about it here: [Custom Trait Manager](https://grapesjs.com/docs/modules/Traits.html#custom-trait-manager).
   * @default false
   */
  custom?: boolean;

  optionsTarget?: Record<string, any>[];
}

const config: () => TraitManagerConfig = () => ({
  stylePrefix: 'trt-',
  appendTo: '',
  optionsTarget: [{ value: false }, { value: '_blank' }],
  custom: false,
});

export default config;
```

--------------------------------------------------------------------------------

````
