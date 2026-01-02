---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 38
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 38 of 97)

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

---[FILE: StyleableModel.ts]---
Location: grapesjs-dev/packages/core/src/domain_abstract/model/StyleableModel.ts

```typescript
import { isArray, isObject, isString, keys } from 'underscore';
import { Model, ObjectAny, ObjectHash, SetOptions } from '../../common';
import ParserHtml from '../../parser/model/ParserHtml';
import Selectors from '../../selector_manager/model/Selectors';
import { shallowDiff } from '../../utils/mixins';
import EditorModel from '../../editor/model/Editor';
import CssRuleView from '../../css_composer/view/CssRuleView';
import ComponentView from '../../dom_components/view/ComponentView';
import Frame from '../../canvas/model/Frame';
import { ToCssOptions } from '../../css_composer/model/CssRule';
import { ModelDataResolverWatchers } from '../../dom_components/model/ModelDataResolverWatchers';
import { DataCollectionStateMap } from '../../data_sources/model/data_collection/types';
import { DataWatchersOptions } from '../../dom_components/model/ModelResolverWatcher';
import { DataResolverProps } from '../../data_sources/types';
import { _StringKey } from 'backbone';

export type StyleProps = Record<string, string | string[] | DataResolverProps>;

export interface UpdateStyleOptions extends SetOptions, DataWatchersOptions {
  partial?: boolean;
  addStyle?: StyleProps;
  inline?: boolean;
  noEvent?: boolean;
}

export type StyleableView = ComponentView | CssRuleView;

const parserHtml = ParserHtml();

export const getLastStyleValue = (value: string | string[]) => {
  return isArray(value) ? value[value.length - 1] : value;
};

export interface StyleableModelProperties extends ObjectHash {
  selectors?: any;
  style?: StyleProps | string;
}

export interface GetStyleOpts {
  skipResolve?: boolean;
}

type WithDataResolvers<T> = {
  [P in keyof T]?: T[P] | DataResolverProps;
};

export default class StyleableModel<T extends StyleableModelProperties = any> extends Model<T, UpdateStyleOptions> {
  em?: EditorModel;
  views: StyleableView[] = [];
  dataResolverWatchers: ModelDataResolverWatchers<T>;
  collectionsStateMap: DataCollectionStateMap = {};
  opt: { em?: EditorModel };

  constructor(attributes: T, options: { em?: EditorModel } = {}) {
    const em = options.em!;
    const dataResolverWatchers = new ModelDataResolverWatchers<T>(undefined, { em });
    super(attributes, { ...options, dataResolverWatchers });
    dataResolverWatchers.bindModel(this);
    this.dataResolverWatchers = dataResolverWatchers;
    this.em = options.em;
    this.opt = options;
  }

  get<A extends _StringKey<T>>(attributeName: A, opts?: { skipResolve?: boolean }): T[A] | undefined {
    if (opts?.skipResolve) return this.dataResolverWatchers.getValueOrResolver('props')[attributeName];

    return super.get(attributeName);
  }

  set<A extends keyof T>(
    keyOrAttributes: A,
    valueOrOptions?: T[A] | DataResolverProps,
    optionsOrUndefined?: UpdateStyleOptions,
  ): this;
  set(keyOrAttributes: WithDataResolvers<T>, options?: UpdateStyleOptions): this;
  set<A extends keyof T>(
    keyOrAttributes: WithDataResolvers<T>,
    valueOrOptions?: T[A] | DataResolverProps | UpdateStyleOptions,
    optionsOrUndefined?: UpdateStyleOptions,
  ): this {
    const defaultOptions: UpdateStyleOptions = {
      skipWatcherUpdates: false,
      fromDataSource: false,
    };

    let attributes: WithDataResolvers<T>;
    let options: UpdateStyleOptions & { dataResolverWatchers?: ModelDataResolverWatchers<T> };

    if (typeof keyOrAttributes === 'object') {
      attributes = keyOrAttributes;
      options = (valueOrOptions as UpdateStyleOptions) || defaultOptions;
    } else if (typeof keyOrAttributes === 'string') {
      attributes = { [keyOrAttributes]: valueOrOptions } as Partial<T>;
      options = optionsOrUndefined || defaultOptions;
    } else {
      attributes = {};
      options = defaultOptions;
    }

    this.dataResolverWatchers = this.dataResolverWatchers ?? options.dataResolverWatchers;
    const evaluatedValues = this.dataResolverWatchers.addProps(attributes, options) as Partial<T>;

    return super.set(evaluatedValues, options);
  }

  /**
   * Parse style string to an object
   * @param  {string} str
   * @returns
   */
  parseStyle(str: string) {
    return parserHtml.parseStyle(str);
  }

  /**
   * Trigger style change event with a new object instance
   * @param {Object} prop
   * @return {Object}
   */
  extendStyle(prop: ObjectAny): ObjectAny {
    return { ...this.getStyle('', { skipResolve: true }), ...prop };
  }

  /**
   * Get style object
   * @return {Object}
   */
  getStyle(opts?: GetStyleOpts): StyleProps;
  getStyle(prop: '' | undefined, opts?: GetStyleOpts): StyleProps;
  getStyle<K extends keyof StyleProps>(prop: K, opts?: GetStyleOpts): StyleProps[K] | undefined;
  getStyle(
    prop?: keyof StyleProps | '' | ObjectAny,
    opts: GetStyleOpts = {},
  ): StyleProps | StyleProps[keyof StyleProps] | undefined {
    const rawStyle = this.get('style');
    const parsedStyle: StyleProps = isString(rawStyle)
      ? this.parseStyle(rawStyle)
      : isObject(rawStyle)
        ? { ...rawStyle }
        : {};

    delete parsedStyle.__p;

    const shouldReturnFull = !prop || prop === '' || isObject(prop);

    if (!opts.skipResolve) {
      return shouldReturnFull ? parsedStyle : parsedStyle[prop];
    }

    const unresolvedStyles: StyleProps = this.dataResolverWatchers.getValueOrResolver('styles', parsedStyle);

    return shouldReturnFull ? unresolvedStyles : unresolvedStyles[prop];
  }

  /**
   * Set new style object
   * @param {Object|string} prop
   * @param {Object} opts
   * @return {Object} Applied properties
   */
  setStyle(prop: string | ObjectAny = {}, opts: UpdateStyleOptions = {}) {
    if (isString(prop)) {
      prop = this.parseStyle(prop);
    }

    const propOrig = this.getStyle('', { skipResolve: true });

    if (opts.partial || opts.avoidStore) {
      opts.avoidStore = true;
      prop.__p = true;
    } else {
      delete prop.__p;
    }

    const propNew = { ...prop };
    let newStyle = { ...propNew };

    keys(newStyle).forEach((key) => {
      // Remove empty style properties
      if (newStyle[key] === '') {
        delete newStyle[key];
        return;
      }
    });

    this.set({ style: newStyle }, opts);
    newStyle = this.attributes['style'] as StyleProps;

    const changedKeys = Object.keys(shallowDiff(propOrig, propNew));
    const diff: ObjectAny = changedKeys.reduce((acc, key) => {
      return {
        ...acc,
        [key]: newStyle[key],
      };
    }, {});
    // Delete the property used for partial updates
    delete diff.__p;

    keys(diff).forEach((pr) => {
      const { em } = this;
      if (opts.noEvent) {
        return;
      }

      this.trigger(`change:style:${pr}`);
      if (em) {
        em.trigger('styleable:change', this, pr, opts);
        em.trigger(`styleable:change:${pr}`, this, pr, opts);
      }
    });

    return newStyle;
  }

  getView(frame?: Frame) {
    let { views, em } = this;
    const frm = frame || em?.getCurrentFrameModel();
    return frm ? views.find((v) => v.frameView === frm.view) : views[0];
  }

  setView(view: StyleableView) {
    let { views } = this;
    !views.includes(view) && views.push(view);
  }

  removeView(view: StyleableView) {
    const { views } = this;
    views.splice(views.indexOf(view), 1);
  }

  updateView() {
    this.views.forEach((view) => view.updateStyles());
  }

  /**
   * Add style property
   * @param {Object|string} prop
   * @param {string} value
   * @example
   * this.addStyle({color: 'red'});
   * this.addStyle('color', 'blue');
   */
  addStyle(prop: string | ObjectAny, value: any = '', opts: UpdateStyleOptions = {}) {
    if (typeof prop == 'string') {
      prop = {
        [prop]: value,
      };
    } else {
      opts = value || {};
    }

    opts.addStyle = prop;
    prop = this.extendStyle(prop);
    this.setStyle(prop, opts);
  }

  /**
   * Remove style property
   * @param {string} prop
   */
  removeStyle(prop: string) {
    let style = this.getStyle();
    delete style[prop];
    this.setStyle(style);
  }

  /**
   * Returns string of style properties
   * @param {Object} [opts={}] Options
   * @return {String}
   */
  styleToString(opts: ToCssOptions = {}) {
    const result: string[] = [];
    const style = opts.style || (this.getStyle(opts as any) as StyleProps);
    const imp = opts.important;

    for (let prop in style) {
      const important = isArray(imp) ? imp.indexOf(prop) >= 0 : imp;
      const firstChars = prop.substring(0, 2);
      const isPrivate = firstChars === '__';

      if (isPrivate) continue;

      const value = style[prop];
      const values = isArray(value) ? (value as string[]) : [value];

      (values as string[]).forEach((val: string) => {
        const value = `${val}${important ? ' !important' : ''}`;
        value && result.push(`${prop}:${value};`);
      });
    }

    return result.join('');
  }

  getSelectors() {
    return (this.get('selectors') || this.get('classes')) as Selectors;
  }

  getSelectorsString(opts?: ObjectAny) {
    // @ts-ignore
    return this.selectorsToString ? this.selectorsToString(opts) : this.getSelectors().getFullString();
  }

  onCollectionsStateMapUpdate(collectionsStateMap: DataCollectionStateMap) {
    this.collectionsStateMap = collectionsStateMap;
    this.dataResolverWatchers.onCollectionsStateMapUpdate();
  }

  clone(attributes?: Partial<T>, opts?: any): typeof this {
    const props = this.dataResolverWatchers.getProps(this.attributes);
    const mergedProps = { ...props, ...attributes };
    const mergedOpts = { ...this.opt, ...opts };

    const ClassConstructor = this.constructor as new (attributes: any, opts?: any) => typeof this;

    return new ClassConstructor(mergedProps, mergedOpts);
  }

  toJSON(opts?: ObjectAny, attributes?: Partial<T>) {
    if (opts?.fromUndo) return { ...super.toJSON(opts) };
    const mergedProps = { ...this.attributes, ...attributes };
    const obj = this.dataResolverWatchers.getProps(mergedProps);

    return obj;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TypeableCollection.ts]---
Location: grapesjs-dev/packages/core/src/domain_abstract/model/TypeableCollection.ts

```typescript
// @ts-nocheck TODO extend View
import { isFunction } from 'underscore';
import { View, Model } from '../../common';

const TypeableCollection = {
  types: [],

  initialize(models, opts = {}) {
    const { em } = opts;
    this.em = em;
    this.opts = opts;
    this.model = (attrs = {}, options = {}) => {
      let Model, View, type;

      if (attrs && attrs.type) {
        const baseType = this.getBaseType();
        type = this.getType(attrs.type);
        Model = type ? type.model : baseType.model;
        View = type ? type.view : baseType.view;
      } else {
        const typeFound = this.recognizeType(attrs);
        type = typeFound.type;
        Model = type.model;
        View = type.view;
        attrs = typeFound.attributes;
      }

      const model = new Model(attrs, { ...options, em });
      model.typeView = View;
      // As we're using a dynamic model function, backbone collection is unable to
      // get `model.prototype.idAttribute`
      this.model.prototype = Model.prototype;
      return model;
    };
    const init = this.init && this.init.bind(this);
    init && init();
  },

  /**
   * Recognize type by any value
   * @param  {mixed} value
   * @return {Object} Found type
   */
  recognizeType(value) {
    const types = this.getTypes();

    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      let typeFound = type.isType(value);
      typeFound = typeof typeFound == 'boolean' && typeFound ? { type: type.id } : typeFound;

      if (typeFound) {
        return {
          type,
          attributes: typeFound,
        };
      }
    }

    // If, for any reason, the type is not found it'll return the base one
    return {
      type: this.getBaseType(),
      attributes: value,
    };
  },

  /**
   * Returns the base type (last object in the stack)
   * @return {Object}
   */
  getBaseType() {
    const types = this.getTypes();
    return types[types.length - 1];
  },

  /**
   * Get types
   * @return {Array}
   */
  getTypes() {
    return this.types;
  },

  /**
   * Get type
   * @param {string} id Type ID
   * @return {Object} Type definition
   */
  getType(id) {
    const types = this.getTypes();

    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      if (type.id === id) {
        return type;
      }
    }
  },

  /**
   * Add new type
   * @param {string} id Type ID
   * @param {Object} definition Definition of the type. Each definition contains
   *                            `model` (business logic), `view` (presentation logic)
   *                            and `isType` function which recognize the type of the
   *                            passed entity
   * addType('my-type', {
   *  model: {},
   *  view: {},
   *  isType: (value) => {},
   * })
   */
  addType(id, definition) {
    const type = this.getType(id);
    const baseType = this.getBaseType();
    const ModelInst = type ? type.model : baseType.model;
    const ViewInst = type ? type.view : baseType.view;
    let { model, view, isType } = definition;
    model = model instanceof Model || isFunction(model) ? model : ModelInst.extend(model || {});
    view = view instanceof View || isFunction(view) ? view : ViewInst.extend(view || {});

    // New API
    if (this.extendViewApi && !definition.model && !definition.view) {
      view = view.extend(definition);
    }

    if (type) {
      type.model = model;
      type.view = view;
      type.isType = isType || type.isType;
    } else {
      definition.id = id;
      definition.model = model;
      definition.view = view;
      definition.isType =
        isType ||
        function (value) {
          if (value && value.type == id) {
            return true;
          }
        };
      this.getTypes().unshift(definition);
    }
  },
};

export default TypeableCollection;
```

--------------------------------------------------------------------------------

---[FILE: Input.ts]---
Location: grapesjs-dev/packages/core/src/domain_abstract/ui/Input.ts

```typescript
import { View, $ } from '../../common';
import EditorModel from '../../editor/model/Editor';

export default class Input extends View {
  ppfx!: string;
  em!: EditorModel;
  opts!: any;
  inputEl?: any;

  template() {
    return `<span class="${this.holderClass()}"></span>`;
  }

  inputClass() {
    return `${this.ppfx}field`;
  }

  holderClass() {
    return `${this.ppfx}input-holder`;
  }

  constructor(opts: any = {}) {
    super(opts);
    const ppfx = opts.ppfx || '';
    this.opts = opts;
    this.ppfx = ppfx;
    this.em = opts.target || {};
    !opts.onChange && this.listenTo(this.model, 'change:value', this.handleModelChange);
  }

  /**
   * Fired when the element of the property is updated
   */
  elementUpdated() {
    this.model.trigger('el:change');
  }

  /**
   * Set value to the input element
   * @param {string} value
   */
  setValue(value: string, opts?: any) {
    const model = this.model;
    let val = value || model.get('defaults');
    const input = this.getInputEl();
    input && (input.value = val);
  }

  /**
   * Updates the view when the model is changed
   * */
  handleModelChange(model: any, value: string, opts: any) {
    this.setValue(value, opts);
  }

  /**
   * Handled when the view is changed
   */
  handleChange(e: Event) {
    e.stopPropagation();
    const value = this.getInputEl().value;
    this.__onInputChange(value);
    this.elementUpdated();
  }

  __onInputChange(value: string) {
    this.model.set({ value }, { fromInput: 1 });
  }

  /**
   * Get the input element
   * @return {HTMLElement}
   */
  getInputEl() {
    if (!this.inputEl) {
      const { model, opts } = this;
      const type = opts.type || 'text';
      const plh = model.get('placeholder') || model.get('defaults') || model.get('default') || '';
      this.inputEl = $(`<input type="${type}" placeholder="${plh}">`);
    }

    return this.inputEl.get(0);
  }

  render() {
    this.inputEl = null;
    const el = this.$el;
    el.addClass(this.inputClass());
    el.html(this.template());
    el.find(`.${this.holderClass()}`).append(this.getInputEl());
    return this;
  }
}

Input.prototype.events = {
  // @ts-ignore
  change: 'handleChange',
};
```

--------------------------------------------------------------------------------

---[FILE: InputColor.ts]---
Location: grapesjs-dev/packages/core/src/domain_abstract/ui/InputColor.ts

```typescript
import { isUndefined } from 'underscore';
import ColorPicker from '../../utils/ColorPicker';
import $ from '../../utils/cash-dom';
import Input from './Input';

$ && ColorPicker($);

const getColor = (color: any) => {
  const name = color.getFormat() === 'name' && color.toName();
  const cl = color.getAlpha() == 1 ? color.toHexString() : color.toRgbString();
  return name || cl.replace(/ /g, '');
};

export default class InputColor extends Input {
  colorEl?: any;
  movedColor?: string;
  noneColor?: boolean;
  model!: any;

  template() {
    const ppfx = this.ppfx;
    return `
      <div class="${this.holderClass()}"></div>
      <div class="${ppfx}field-colorp">
        <div class="${ppfx}field-colorp-c" data-colorp-c>
          <div class="${ppfx}checker-bg"></div>
        </div>
      </div>
    `;
  }

  inputClass() {
    const ppfx = this.ppfx;
    return `${ppfx}field ${ppfx}field-color`;
  }

  holderClass() {
    return `${this.ppfx}input-holder`;
  }

  remove() {
    super.remove();
    this.colorEl.spectrum('destroy');
    return this;
  }

  handleChange(e: any) {
    e.stopPropagation();
    const { value } = e.target;
    if (isUndefined(value)) return;
    this.__onInputChange(value);
  }

  __onInputChange(val: string) {
    const { model, opts } = this;
    const { onChange } = opts;
    let value = val;
    const colorEl = this.getColorEl();

    // Check the color by using the ColorPicker's parser
    if (colorEl) {
      colorEl.spectrum('set', value);
      const tc = colorEl.spectrum('get');
      const color = value && getColor(tc);
      color && (value = color);
    }

    onChange ? onChange(value) : model.set({ value }, { fromInput: 1 });
  }

  /**
   * Set value to the model
   * @param {string} val
   * @param {Object} opts
   */
  setValue(val: string, opts: any = {}) {
    const { model } = this;
    const def = !isUndefined(opts.def) ? opts.def : model.get('defaults');
    const value = !isUndefined(val) ? val : !isUndefined(def) ? def : '';
    const inputEl = this.getInputEl();
    const colorEl = this.getColorEl();
    const valueClr = value != 'none' ? value : '';
    inputEl.value = value;
    colorEl.get(0).style.backgroundColor = valueClr;

    // This prevents from adding multiple thumbs in spectrum
    if (opts.fromTarget || (opts.fromInput && !opts.avoidStore)) {
      colorEl.spectrum('set', valueClr);
      this.noneColor = value == 'none';
      this.movedColor = valueClr;
    }
  }

  /**
   * Get the color input element
   * @return {HTMLElement}
   */
  getColorEl() {
    if (!this.colorEl) {
      const { em, model, opts } = this;
      const ppfx = this.ppfx;
      const { onChange } = opts;

      const colorEl = $(`<div class="${this.ppfx}field-color-picker"></div>`);
      const cpStyle = colorEl.get(0)!.style;
      const colorPickerConfig = (em && em.getConfig && em.getConfig().colorPicker) || {};

      this.movedColor = '';
      let changed = false;
      let previousColor: string;
      this.$el.find('[data-colorp-c]').append(colorEl);

      const handleChange = (value: string, complete = true) => {
        if (onChange) {
          onChange(value, !complete);
        } else {
          complete && model.setValueFromInput(0, false); // for UndoManager
          model.setValueFromInput(value, complete);
        }
      };

      // @ts-ignore
      colorEl.spectrum({
        color: model.getValue() || false,
        containerClassName: `${ppfx}one-bg ${ppfx}two-color ${ppfx}editor-sp`,
        maxSelectionSize: 8,
        showPalette: true,
        showAlpha: true,
        chooseText: 'Ok',
        cancelText: '⨯',
        palette: [],

        // config expanded here so that the functions below are not overridden
        ...colorPickerConfig,
        ...(model.get('colorPicker') || {}),

        move: (color: any) => {
          const cl = getColor(color);
          this.movedColor = cl;
          cpStyle.backgroundColor = cl;
          handleChange(cl, false);
        },
        change: (color: any) => {
          changed = true;
          const cl = getColor(color);
          cpStyle.backgroundColor = cl;
          handleChange(cl);
          this.noneColor = false;
        },
        show: (color: any) => {
          changed = false;
          this.movedColor = '';
          previousColor = onChange ? model.getValue({ noDefault: true }) : getColor(color);
        },
        hide: () => {
          if (!changed && (previousColor || onChange)) {
            if (this.noneColor) {
              previousColor = '';
            }
            cpStyle.backgroundColor = previousColor;
            // @ts-ignore
            colorEl.spectrum('set', previousColor);
            handleChange(previousColor, false);
          }
        },
      });

      if (em && em.on!) {
        this.listenTo(em, 'component:selected', () => {
          this.movedColor && handleChange(this.movedColor);
          changed = true;
          this.movedColor = '';
          // @ts-ignore
          colorEl.spectrum('hide');
        });
      }

      this.colorEl = colorEl;
    }
    return this.colorEl;
  }

  render() {
    Input.prototype.render.call(this);
    // This will make the color input available on render
    this.getColorEl();
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: InputNumber.ts]---
Location: grapesjs-dev/packages/core/src/domain_abstract/ui/InputNumber.ts

```typescript
import { bindAll, indexOf, isUndefined } from 'underscore';
import { off, on } from '../../utils/dom';
import Input from './Input';

export default class InputNumber extends Input {
  doc: Document;
  unitEl?: any;
  moved?: boolean;
  prValue?: number;
  current?: { y: number; val: string };

  template() {
    const ppfx = this.ppfx;
    return `
      <span class="${ppfx}input-holder"></span>
      <span class="${ppfx}field-units"></span>
      <div class="${ppfx}field-arrows" data-arrows>
        <div class="${ppfx}field-arrow-u" data-arrow-up></div>
        <div class="${ppfx}field-arrow-d" data-arrow-down></div>
      </div>
    `;
  }

  inputClass() {
    const ppfx = this.ppfx;
    return this.opts.contClass || `${ppfx}field ${ppfx}field-integer`;
  }

  constructor(opts = {}) {
    super(opts);
    bindAll(this, 'moveIncrement', 'upIncrement');
    this.doc = document;
    this.listenTo(this.model, 'change:unit', this.handleModelChange);
  }

  /**
   * Set value to the model
   * @param {string} value
   * @param {Object} opts
   */
  setValue(value: string, opts?: any) {
    const opt = opts || {};
    const valid = this.validateInputValue(value, { deepCheck: 1 });
    const validObj = { value: valid.value, unit: '' };

    // If found some unit value
    if (valid.unit || valid.force) {
      validObj.unit = valid.unit;
    }

    this.model.set(validObj, opt);

    // Generally I get silent when I need to reflect data to view without
    // reupdating the target
    if (opt.silent) {
      this.handleModelChange();
    }
  }

  /**
   * Handled when the view is changed
   */
  handleChange(e: Event) {
    e.stopPropagation();
    this.setValue(this.getInputEl().value);
    this.elementUpdated();
  }

  /**
   * Handled when the view is changed
   */
  handleUnitChange(e: Event) {
    e.stopPropagation();
    const value = this.getUnitEl().value;
    this.model.set('unit', value);
    this.elementUpdated();
  }

  /**
   * Handled when user uses keyboard
   */
  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.upArrowClick();
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.downArrowClick();
    }
  }

  /**
   * Fired when the element of the property is updated
   */
  elementUpdated() {
    this.model.trigger('el:change');
  }

  /**
   * Updates the view when the model is changed
   * */
  handleModelChange() {
    const model = this.model;
    this.getInputEl().value = model.get('value');
    const unitEl = this.getUnitEl();
    unitEl && (unitEl.value = model.get('unit') || '');
  }

  /**
   * Get the unit element
   * @return {HTMLElement}
   */
  getUnitEl() {
    if (!this.unitEl) {
      const model = this.model;
      const units = model.get('units') || [];

      if (units.length) {
        const options = ['<option value="" disabled hidden>-</option>'];

        units.forEach((unit: string) => {
          const selected = unit == model.get('unit') ? 'selected' : '';
          options.push(`<option ${selected}>${unit}</option>`);
        });

        const temp = document.createElement('div');
        temp.innerHTML = `<select class="${this.ppfx}input-unit">${options.join('')}</select>`;
        this.unitEl = temp.firstChild;
      }
    }

    return this.unitEl;
  }

  /**
   * Invoked when the up arrow is clicked
   * */
  upArrowClick() {
    const { model } = this;
    const step = model.get('step');
    let value = parseFloat(this.getInputEl().value);
    this.setValue(this.normalizeValue(value + step));
    this.elementUpdated();
  }

  /**
   * Invoked when the down arrow is clicked
   * */
  downArrowClick() {
    const { model } = this;
    const step = model.get('step');
    const value = parseFloat(this.getInputEl().value);
    this.setValue(this.normalizeValue(value - step));
    this.elementUpdated();
  }

  /**
   * Change easily integer input value with click&drag method
   * @param Event
   *
   * @return void
   * */
  downIncrement(e: MouseEvent) {
    e.preventDefault();
    this.moved = false;
    var value = this.model.get('value') || 0;
    value = this.normalizeValue(value);
    this.current = { y: e.pageY, val: value };
    on(this.doc, 'mousemove', this.moveIncrement as any);
    on(this.doc, 'mouseup', this.upIncrement);
  }

  /** While the increment is clicked, moving the mouse will update input value
   * @param Object
   *
   * @return bool
   * */
  moveIncrement(ev: MouseEvent) {
    this.moved = true;
    const model = this.model;
    const step = model.get('step');
    const data = this.current!;
    var pos = this.normalizeValue(data.val + (data.y - ev.pageY) * step);
    const { value, unit } = this.validateInputValue(pos);
    this.prValue = value;
    model.set({ value, unit }, { avoidStore: 1 });
    return false;
  }

  /**
   * Stop moveIncrement method
   * */
  upIncrement() {
    const model = this.model;
    const step = model.get('step');
    off(this.doc, 'mouseup', this.upIncrement);
    off(this.doc, 'mousemove', this.moveIncrement as any);

    if (this.prValue && this.moved) {
      var value = this.prValue - step;
      // @ts-ignore
      model.set('value', value, { avoidStore: 1 }).set('value', value + step);
      this.elementUpdated();
    }
  }

  normalizeValue(value: any, defValue = 0) {
    const model = this.model;
    const step = model.get('step');
    let stepDecimals = 0;

    if (isNaN(value)) {
      return defValue;
    }

    value = parseFloat(value);

    if (Math.floor(value) !== value) {
      const side = step.toString().split('.')[1];
      stepDecimals = side ? side.length : 0;
    }

    return stepDecimals ? parseFloat(value.toFixed(stepDecimals)) : value;
  }

  /**
   * Validate input value
   * @param {String} value Raw value
   * @param {Object} opts Options
   * @return {Object} Validated string
   */
  validateInputValue(value?: any, opts: any = {}) {
    var force = 0;
    var opt = opts || {};
    var model = this.model;
    const defValue = ''; //model.get('defaults');
    var val = !isUndefined(value) ? value : defValue;
    var units = opts.units || model.get('units') || [];
    var unit = model.get('unit') || (units.length && units[0]) || '';
    var max = !isUndefined(opts.max) ? opts.max : model.get('max');
    var min = !isUndefined(opts.min) ? opts.min : model.get('min');
    var limitlessMax = !!model.get('limitlessMax');
    var limitlessMin = !!model.get('limitlessMin');

    if (opt.deepCheck) {
      var fixed = model.get('fixedValues') || [];

      if (val === '') unit = '';

      if (val) {
        // If the value is one of the fixed values I leave it as it is
        var regFixed = new RegExp('^' + fixed.join('|'), 'g');
        if (fixed.length && regFixed.test(val)) {
          val = val.match(regFixed)[0];
          unit = '';
          force = 1;
        } else {
          var valCopy = val + '';
          val += ''; // Make it suitable for replace
          val = parseFloat(val.replace(',', '.'));
          val = !isNaN(val) ? val : defValue;
          var uN = valCopy.replace(val, '');
          // Check if exists as unit
          if (indexOf(units, uN) >= 0) unit = uN;
        }
      }
    }

    // Apply constraints only if val is a valid number
    if (!isNaN(val) && val !== '') {
      if (!limitlessMax && !isUndefined(max) && max !== '') val = val > max ? max : val;
      if (!limitlessMin && !isUndefined(min) && min !== '') val = val < min ? min : val;
    }

    return {
      force,
      value: val,
      unit,
    };
  }

  render() {
    Input.prototype.render.call(this);
    this.unitEl = null;
    const unit = this.getUnitEl();
    unit && this.$el.find(`.${this.ppfx}field-units`).get(0)!.appendChild(unit);
    return this;
  }
}

InputNumber.prototype.events = {
  // @ts-ignore
  'change input': 'handleChange',
  'change select': 'handleUnitChange',
  'click [data-arrow-up]': 'upArrowClick',
  'click [data-arrow-down]': 'downArrowClick',
  'mousedown [data-arrows]': 'downIncrement',
  keydown: 'handleKeyDown',
};
```

--------------------------------------------------------------------------------

---[FILE: DomainViews.ts]---
Location: grapesjs-dev/packages/core/src/domain_abstract/view/DomainViews.ts

```typescript
import { includes } from 'underscore';
import { ObjectAny, View } from '../../common';

export default class DomainViews extends View {
  config?: any;
  items: any[];
  ns?: string;
  itemView?: any;

  // Defines the View per type
  itemsView = '' as any;

  itemType = 'type';

  reuseView = false;

  constructor(opts: any = {}, config?: any, autoAdd = false) {
    super(opts);
    this.config = config || opts.config || {};
    autoAdd && this.listenTo(this.collection, 'add', this.addTo);
    this.items = [];
  }

  /**
   * Add new model to the collection
   * @param {Model} model
   * @private
   * */
  addTo(model: any) {
    this.add(model);
  }

  itemViewNotFound(type: string) {
    const { config, ns } = this;
    const { em } = config;
    const warn = `${ns ? `[${ns}]: ` : ''}'${type}' type not found`;
    em && em.logWarning(warn);
  }

  /**
   * Render new model inside the view
   * @param {Model} model
   * @param {Object} fragment Fragment collection
   * @private
   * */
  add(model: any, fragment?: DocumentFragment) {
    const { config, reuseView, items } = this;
    const itemsView = (this.itemsView || {}) as ObjectAny;
    const inputTypes = [
      'button',
      'checkbox',
      'color',
      'date',
      'datetime-local',
      'email',
      'file',
      'hidden',
      'image',
      'month',
      'number',
      'password',
      'radio',
      'range',
      'reset',
      'search',
      'submit',
      'tel',
      'text',
      'time',
      'url',
      'week',
    ];
    var frag = fragment || null;
    var itemView = this.itemView;
    var typeField = model.get(this.itemType);
    let view;

    if (itemsView[typeField]) {
      itemView = itemsView[typeField];
    } else if (typeField && !itemsView[typeField] && !includes(inputTypes, typeField)) {
      this.itemViewNotFound(typeField);
    }

    if (model.view && reuseView) {
      view = model.view;
    } else {
      view = new itemView({ model, config }, config);
    }

    items && items.push(view);
    const rendered = view.render().el;

    if (frag) frag.appendChild(rendered);
    else this.$el.append(rendered);
  }

  render() {
    var frag = document.createDocumentFragment();
    this.clearItems();
    this.$el.empty();

    if (this.collection.length)
      this.collection.each(function (model) {
        // @ts-ignore
        this.add(model, frag);
      }, this);

    this.$el.append(frag);
    this.onRender();
    return this;
  }

  onRender() {}
  onRemoveBefore(items?: any, opts?: any) {}
  onRemove(items?: any, opts?: any) {}

  remove(opts = {}) {
    const { items } = this;
    this.onRemoveBefore(items, opts);
    this.clearItems();
    super.remove();
    this.onRemove(items, opts);
    return this;
  }

  clearItems() {
    const items = this.items || [];
    // TODO Traits do not update the target anymore
    // items.forEach(item => item.remove());
    // this.items = [];
  }
}

// Default view
DomainViews.prototype.itemView = '';
```

--------------------------------------------------------------------------------

````
