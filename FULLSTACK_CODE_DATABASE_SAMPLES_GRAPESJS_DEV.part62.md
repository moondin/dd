---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 62
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 62 of 97)

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

---[FILE: Property.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/model/Property.ts

```typescript
import { isUndefined, isString, isArray, result, keys, each, includes, isFunction } from 'underscore';
import { Model } from '../../common';
import Component from '../../dom_components/model/Component';
import EditorModel from '../../editor/model/Editor';
import { capitalize, camelCase, hasWin } from '../../utils/mixins';
import Sector from './Sector';
import PropertyComposite from './PropertyComposite';
import { StyleProps } from '../../domain_abstract/model/StyleableModel';
import { StyleTarget } from '..';

export type IsVisibleFn = (props: {
  property: Property;
  sector: Sector;
  target: StyleTarget;
  component?: Component;
}) => boolean | void;

/** @private */
export interface PropertyProps {
  name?: string;
  label?: string;
  id?: string;
  property?: string;
  type?: string;
  defaults?: string;
  default?: string;
  info?: string;
  value?: any;
  icon?: string;
  functionName?: string;
  status?: string;
  visible?: boolean;
  fixedValues?: string[];
  className?: string;
  extend?: string;
  onChange?: (data: {
    property: Property;
    from: PartialPropertyProps;
    to: PartialPropertyProps;
    value: any;
    opts: any;
  }) => any;

  /**
   * Pass a custom function to check if the property should be visible.
   *
   * @example
   * isVisible: ({ component }) => {
   *  // Show the property only if the selected component is an image
   *  return component?.is('image');
   * }
   */
  isVisible?: IsVisibleFn;

  /**
   * If true, the property will be forced to be full width
   */
  full?: boolean;

  /**
   * If true to the value will be added '!important'
   */
  important?: boolean;

  /**
   * If true, will be hidden by default and will show up only for targets
   * which require this property (via `stylable-require`)
   * Use case:
   * you can add all SVG CSS properties with toRequire as true
   * and then require them on SVG Components
   */
  toRequire?: boolean;

  /**
   * Specifies dependency on other properties of the selected object.
   * Property is shown only when all conditions are matched.
   *
   * @example
   * // in this case the property is only shown when display is of value 'flex' or 'block' AND position is 'absolute'
   * requires: { display: ['flex', 'block'], position: ['absolute'] };
   */
  requires?: Record<string, any>;

  /**
   * Specifies dependency on properties of the parent of the selected object.
   * Property is shown only when all conditions are matched.
   */
  requiresParent?: any;

  parentTarget?: any;
  __p?: any;
}

export type OptionsUpdate = {
  partial?: boolean;
  noTarget?: boolean;
  __up?: boolean;
  __clear?: boolean;
};

export type OptionsStyle = { camelCase?: boolean };

export interface PropertyPropsCustom extends PropertyProps {
  [key: string]: any;
}

type PartialPropertyProps = Partial<PropertyProps>;

/**
 * @typedef Property
 * @property {String} id Property id, eg. `my-property-id`.
 * @property {String} property Related CSS property name, eg. `text-align`.
 * @property {String} default Defaul value of the property.
 * @property {String} label Label to use in UI, eg. `Text Align`.
 * @property {Function} [onChange] Change callback.
 * \n
 * ```js
 *  onChange: ({ property, from, to }) => {
 *    console.log(`Changed property`, property.getName(), { from, to });
 *  }
 * ```
 *
 */
export default class Property<T extends PropertyPropsCustom = PropertyPropsCustom> extends Model<T> {
  em!: EditorModel;
  parent?: Property;

  static getDefaults() {
    return result(this.prototype, 'defaults');
  }

  /**
   * @private
   * @ts-ignore */
  defaults() {
    return {
      name: '',
      property: '',
      type: '',
      defaults: '',
      info: '',
      value: '',
      icon: '',
      functionName: '',
      status: '',
      visible: true,
      fixedValues: ['initial', 'inherit'],
      full: false,
      important: false,
      toRequire: false,
      requires: undefined,
      requiresParent: null,
      parentTarget: null,
    };
  }

  initialize(props = {}, opts: any = {}) {
    this.em = opts.em;
    const id = this.getId() || '';
    const name: string = this.get('name') || this.get('label') || '';
    // @ts-ignore
    !this.get('property') && this.set('property', (name || id).replace(/ /g, '-'));
    const prop = this.get('property');
    !this.get('id') && this.set('id', prop);
    // @ts-ignore
    !name && this.set('name', capitalize(prop).replace(/-/g, ' '));
    this.on('change', this.__upTargets);
    // @ts-ignore
    Property.callInit(this, props, opts);
  }

  __getParentProp<T = PropertyComposite>(): T {
    // @ts-ignore
    return this.collection?.opts?.parentProp;
  }

  __upTargets(p: this, opts: any = {}): void {
    const { em } = this;
    const sm = em.Styles;
    const name = this.getName();
    const isClear = opts.__clear;
    const value = isClear ? '' : this.__getFullValue(opts);
    const parentProp = this.__getParentProp();

    const to = this.changedAttributes() as PartialPropertyProps;
    const from = keys(to).reduce((a, i) => {
      a[i] = this.previous(i as any);
      return a;
    }, {} as any);

    const kProps = [...keys(this.__getClearProps()), '__p'];
    const toProps = keys(to);
    const applyStyle = !opts.__up && !parentProp && (isClear || kProps.some((k) => toProps.indexOf(k) >= 0));
    const onChange = this.get('onChange');
    const evOpts = { property: this, from, to, value, opts };
    sm.__trgEv(sm.events.propertyUpdate, evOpts);
    onChange && onChange(evOpts);
    applyStyle && this.__upTargetsStyle({ [name]: value }, opts);
  }

  __upTargetsStyle(style: StyleProps, opts: any) {
    const sm = this.em?.get('StyleManager');
    sm?.addStyleTargets({ ...style, __p: !!opts.avoidStore }, opts);
  }

  _up(props: Partial<T>, opts: OptionsUpdate = {}): this {
    if (opts.noTarget) opts.__up = true;
    const { partial, ...rest } = opts;
    // @ts-ignore
    props.__p = !!(rest.avoidStore || partial);
    return this.set(props, { ...rest, avoidStore: props.__p });
  }

  up(props: PartialPropertyProps, opts = {}) {
    // @ts-ignore
    this.set(props, { ...opts, __up: true });
  }

  init() {}

  /**
   * Get property id.
   * @returns {String}
   */
  getId(): string {
    return this.get('id')!;
  }

  /**
   * Get the property type.
   * The type of the property is defined on property creation and based on its value the proper Property class is assigned.
   * The default type is `base`.
   * @returns {String}
   */
  getType(): string {
    return this.get('type')!;
  }

  /**
   * Get name (the CSS property name).
   * @returns {String}
   */
  getName(): string {
    return this.get('property')!;
  }

  /**
   * Get property label.
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.locale=true] Use the locale string from i18n module
   * @returns {String}
   */
  getLabel(opts: { locale?: boolean } = {}) {
    const { locale = true } = opts;
    const id = this.getId();
    const name = this.get('name') || this.get('label');
    return (locale && this.em?.t(`styleManager.properties.${id}`)) || name;
  }

  /**
   * Get property value.
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.noDefault=false] Avoid returning the default value
   * @returns {String}
   */
  getValue(opts: { noDefault?: boolean } = {}) {
    const { noDefault } = opts;
    const val = this.get('value');
    return !this.hasValue() && !noDefault ? this.getDefaultValue() : val;
  }

  /**
   * Check if the property has value.
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.noParent=false] Ignore the value if it comes from the parent target.
   * @returns {Boolean}
   */
  hasValue(opts: { noParent?: boolean } = {}) {
    const { noParent } = opts;
    const parentValue = noParent && this.getParentTarget();
    const val = this.get('value');
    return !isUndefined(val) && val !== '' && !parentValue;
  }

  /**
   * Indicates if the current value is coming from a parent target (eg. another CSSRule).
   * @returns {Boolean}
   */
  hasValueParent() {
    return this.hasValue() && !this.hasValue({ noParent: true });
  }

  /**
   * Get the CSS style object of the property.
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.camelCase] Return property name in camelCase.
   * @return {Object}
   * @example
   * // In case the property is `color` with a value of `red`.
   * console.log(property.getStyle());
   * // { color: 'red' };
   */
  getStyle(opts: OptionsStyle = {}): StyleProps {
    const name = this.getName();
    const key = opts.camelCase ? camelCase(name) : name;
    return { [key]: this.__getFullValue(opts) };
  }

  /**
   * Get the default value.
   * @return {string}
   */
  getDefaultValue() {
    const def = this.get('default');
    return `${!isUndefined(def) ? def : this.get('defaults')}`;
  }

  /**
   * Update the value.
   * The change is also propagated to the selected targets (eg. CSS rule).
   * @param {String} value New value
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.partial=false] If `true` the update on targets won't be considered complete (not stored in UndoManager)
   * @param {Boolean} [opts.noTarget=false] If `true` the change won't be propagated to selected targets.
   */
  upValue(value: string, opts: OptionsUpdate = {}) {
    const parsed = value === null || value === '' ? this.__getClearProps() : this.__parseValue(value, opts);
    return this._up(parsed as Partial<T>, opts);
  }

  /**
   * Check if the property is visible
   * @returns {Boolean}
   */
  isVisible() {
    return !!this.get('visible');
  }

  /**
   * Clear the value.
   * The change is also propagated to the selected targets (eg. the css property is cleared).
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.noTarget=false] If `true` the change won't be propagated to selected targets.
   */
  clear(opts = {}) {
    this._up(this.__getClearProps(), { ...opts, __clear: true });
    return this;
  }

  /**
   * Indicates if the current value comes directly from the selected target and so can be cleared.
   * @returns {Boolean}
   */
  canClear(): boolean {
    const parent = this.getParent();
    return parent ? parent.__canClearProp(this) : this.hasValue({ noParent: true });
  }

  /**
   * If the current property is a sub-property, this will return the parent Property.
   * @returns {[Property]|null}
   */
  getParent() {
    return this.__getParentProp();
  }

  /**
   * Indicates if the property is full-width in UI.
   * @returns {Boolean}
   */
  isFull() {
    return !!this.get('full');
  }

  __parseValue(value: string, opts: any) {
    return this.parseValue(value, opts);
  }

  __getClearProps() {
    return { value: '', important: false } as unknown as Partial<T>;
  }

  /**
   * Update value
   * @param {any} value
   * @param {Boolen} [complete=true] Indicates if it's a final state
   * @param {Object} [opts={}] Options
   * @private
   */
  setValue(value: string, complete = true, opts = {}) {
    const parsed = this.parseValue(value);
    const avoidStore = !complete;
    // @ts-ignore
    !avoidStore && this.set({ value: undefined }, { avoidStore, silent: true });
    this.set(parsed, { avoidStore, ...opts });
  }

  /**
   * Like `setValue` but, in addition, prevents the update of the input element
   * as the changes should come from the input itself.
   * This method is useful with the definition of custom properties
   * @param {any} value
   * @param {Boolen} [complete=true] Indicates if it's a final state
   * @param {Object} [opts={}] Options
   * @private
   * @deprecated
   */
  setValueFromInput(value: string, complete: boolean, opts = {}) {
    this.setValue(value, complete, { ...opts, fromInput: 1 });
  }

  /**
   * Parse a raw value, generally fetched from the target, for this property
   * @param  {string} value Raw value string
   * @return {Object}
   * @private
   * @example
   * // example with an Input type
   * prop.parseValue('translateX(10deg)');
   * // -> { value: 10, unit: 'deg', functionName: 'translateX' }
   *
   */
  parseValue(value: string, opts: { complete?: boolean; numeric?: boolean } = {}): Partial<T> {
    const result = { value } as any;
    const imp = '!important';
    const fn = this.get('functionName') || '';

    if (isString(value) && value.indexOf(imp) !== -1) {
      result.value = value.replace(imp, '').trim();
      result.important = true;
    }

    if (!fn && !opts.complete) {
      return result;
    }

    const args = [];
    const valueStr = `${result.value}`.trim();
    const start = valueStr.indexOf('(') + 1;
    const functionName = fn || valueStr.substring(0, start - 1);

    if (functionName) {
      result.functionName = functionName;
    }

    if (!fn || valueStr.indexOf(`${fn}(`) === 0) {
      const end = valueStr.lastIndexOf(')');
      args.push(start);

      // Will try even if the last closing parentheses is not found
      end >= 0 && args.push(end);

      result.value = String.prototype.substring.apply(valueStr, args as any);
    }

    if (opts.numeric) {
      const num = parseFloat(result.value);
      result.unit = result.value.replace(num, '');
      result.value = num;
    }

    return result;
  }

  /**
   * Helper function to safely split a string of values.
   * Useful when style values are inside functions
   * eg:
   * -> input: 'value(1,2,4), 123, value(4,5)' -- default separator: ','
   * -> output: ['value(1,2,4)', '123', 'value(4,5)']
   * @param {String} values Values to split
   * @param {String} [separator] Separator
   * @private
   */
  // splitValues(values, separator = ',') {
  //   const res = [];
  //   const op = '(';
  //   const cl = ')';
  //   let curr = '';
  //   let acc = 0;

  //   (values || '').split('').forEach(str => {
  //     if (str == op) {
  //       acc++;
  //       curr = curr + op;
  //     } else if (str == cl && acc > 0) {
  //       acc--;
  //       curr = curr + cl;
  //     } else if (str === separator && acc == 0) {
  //       res.push(curr);
  //       curr = '';
  //     } else {
  //       curr = curr + str;
  //     }
  //   });

  //   curr !== '' && res.push(curr);

  //   return res.map(i => i.trim());
  // }

  __getFullValue({ withDefault }: any = {}) {
    return !this.hasValue() && withDefault ? this.getDefaultValue() : this.getFullValue();
  }

  /**
   * Get a complete value of the property.
   * This probably will replace the getValue when all
   * properties models will be splitted
   * @param {String} val Custom value to replace the one on the model
   * @return {string}
   * @private
   */
  getFullValue(val?: string, opts: any = {}) {
    const fn = this.get('functionName');
    const def = this.getDefaultValue();
    let value = isUndefined(val) ? (this.get('value') as string) : val;
    const hasValue = this.hasValue();

    if (value && def && value === def) {
      return def;
    }

    if (fn && hasValue) {
      const fnParameter = fn === 'url' ? `'${value.replace(/'|"/g, '')}'` : value;
      value = `${fn}(${fnParameter})`;
    }

    if (hasValue && this.get('important') && !opts.skipImportant) {
      value = `${value} !important`;
    }

    return value || '';
  }

  __setParentTarget(parentTarget: any) {
    this.up({ parentTarget });
  }

  getParentTarget() {
    return this.get('parentTarget') || null;
  }

  __parseFn(input = '') {
    const start = input.indexOf('(') + 1;
    const end = input.lastIndexOf(')');

    return {
      name: input.substring(0, start - 1).trim(),
      value: String.prototype.substring.apply(input, [start, end >= 0 ? end : undefined]).trim(),
    };
  }

  __checkVisibility({
    target,
    component,
    sector,
    sectors,
  }: {
    target: StyleTarget;
    sector: Sector;
    component?: Component;
    sectors?: Sector[];
  }) {
    const trg = component || target;
    if (!trg) return false;

    const id = this.getId();
    const property = this.getName();
    const { requires, requiresParent, toRequire, isVisible } = this.attributes;
    const unstylable = trg.get('unstylable');
    const stylableReq = trg.get('stylable-require');
    let stylable = trg.get('stylable');

    if (isFunction(isVisible)) {
      return !!isVisible({ property: this, sector, target, component });
    }

    // Stylable could also be an array indicating with which property
    // the target could be styled
    if (isArray(stylable)) {
      stylable = stylable.indexOf(property) >= 0;
    }

    // Check if the property was signed as unstylable
    if (isArray(unstylable)) {
      stylable = unstylable.indexOf(property) < 0;
    }

    // Check if the property is available only if requested
    if (toRequire) {
      stylable = !target || (stylableReq && (stylableReq.indexOf(id) >= 0 || stylableReq.indexOf(property) >= 0));
    }

    // Check if the property is available based on other property's values
    if (sectors && requires) {
      const properties = keys(requires);
      sectors.forEach((sector) => {
        sector.getProperties().forEach((model) => {
          if (includes(properties, model.id)) {
            const values = requires[model.id];
            stylable = stylable && includes(values, model.get('value'));
          }
        });
      });
    }

    // Check if the property is available based on parent's property values
    if (requiresParent) {
      const parent = component && component.parent();
      const parentEl = parent && parent.getEl();
      if (parentEl) {
        const styles: Record<string, any> = hasWin() ? window.getComputedStyle(parentEl) : {};
        each(requiresParent, (values, property) => {
          stylable = stylable && styles[property] && includes(values, styles[property]);
        });
      } else {
        stylable = false;
      }
    }

    return !!stylable;
  }
}

// @ts-ignore
Property.callParentInit = function (property, ctx, props, opts = {}) {
  property.prototype.initialize.apply(ctx, [
    props,
    {
      ...opts,
      skipInit: 1,
    },
  ]);
};

// @ts-ignore
Property.callInit = function (context, props, opts: any = {}) {
  !opts.skipInit && context.init(props, opts);
};
```

--------------------------------------------------------------------------------

---[FILE: PropertyComposite.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/model/PropertyComposite.ts

```typescript
import { isArray, isString, isUndefined, keys } from 'underscore';
import { StyleProps, getLastStyleValue } from '../../domain_abstract/model/StyleableModel';
import { camelCase } from '../../utils/mixins';
import Properties from './Properties';
import Property, { OptionsStyle, OptionsUpdate, PropertyProps } from './Property';
import { PropertyNumberProps } from './PropertyNumber';
import { PropertySelectProps } from './PropertySelect';
import { DataVariableType } from '../../data_sources/model/DataVariable';

export const isNumberType = (type: string) => type === 'integer' || type === 'number';

export type PropValues = Record<string, any>;

export type OptionByName = { byName?: boolean };

export type FromStyle = (style: StyleProps, data: FromStyleData) => PropValues;

export type FromStyleData = { property: Property; name: string; separator: RegExp };

export type ToStyle = (values: PropValues, data: ToStyleData) => StyleProps;

export type ToStyleData = { join: string; name: string; property: Property };

/** @private */
export interface PropertyCompositeProps extends PropertyProps {
  detached?: boolean;
  /**
   * Array of sub properties, eg. `[{ type: 'number', property: 'margin-top' }, ...]`
   */
  properties: (PropertyProps | PropertyNumberProps | PropertySelectProps)[];

  /**
   * Value used to split property values, default `" "`.
   */
  separator?: string;

  /**
   * Value used to join property values, default `" "`.
   */
  join?: string;

  /**
   * Custom logic for getting property values from the target style object.
   */
  fromStyle?: FromStyle;

  /**
   * Custom logic for creating the CSS style object to apply on selected targets.
   */
  toStyle?: ToStyle;
}

/**
 *
 * [Property]: property.html
 *
 *
 * @typedef PropertyComposite
 * @property {Array<Object>} properties Array of sub properties, eg. `[{ type: 'number', property: 'margin-top' }, ...]`
 * @property {Boolean} [detached=false] Indicate if the final CSS property is splitted (detached: `margin-top: X; margin-right: Y; ...`) or combined (not detached: `margin: X Y ...;`)
 * @property {String|RegExp} [separator=' '] Value used to split property values, default `" "`.
 * @property {String} [join=' '] Value used to join property values, default `" "`.
 * @property {Function} [fromStyle] Custom logic for getting property values from the target style object.
 * \n
 * ```js
 *  fromStyle: (style) => {
 *    const margins = parseMarginShorthand(style.margin);
 *    return {
 *      'margin-top': margins.top,
 *      // ...
 *    };
 *  }
 * ```
 * @property {Function} [toStyle] Custom logic for creating the CSS style object to apply on selected targets.
 * \n
 * ```js
 *  toStyle: (values) => {
 *    const top = values['margin-top'] || 0;
 *    const right = values['margin-right'] || 0;
 *    // ...
 *    return {
 *      margin: `${top} ${right} ...`,
 *    };
 *  }
 * ```
 */
export default class PropertyComposite<T extends Record<string, any> = PropertyCompositeProps> extends Property<T> {
  defaults() {
    return {
      ...Property.getDefaults(),
      detached: false,
      properties: [],
      separator: ' ',
      join: null,
      fromStyle: null,
      toStyle: null,
      full: true,
    };
  }

  initialize(props = {}, opts = {}) {
    // @ts-ignore
    Property.callParentInit(Property, this, props, opts);
    const { em } = this;
    const properties = new Properties(this.get('properties') || [], {
      em,
      parentProp: this,
    });
    this.set('properties', properties, { silent: true });
    this.listenTo(properties, 'change', this.__upProperties);
    // @ts-ignore
    Property.callInit(this, props, opts);
  }

  get properties(): Property[] {
    // @ts-ignore
    return this.get('properties')! || [];
  }

  /**
   * Get properties.
   * @returns {Array<[Property]>}
   */
  getProperties(): Property[] {
    // @ts-ignore
    return [...this.get('properties').models];
  }

  /**
   * Get property by id.
   * @param  {String} id Property id.
   * @returns {[Property]|null}
   */
  getProperty(id: string): Property | undefined {
    return this.properties.filter((prop) => prop.getId() === id || prop.getName() === id)[0];
  }

  /**
   * Get property at index.
   * @param  {Number} index
   * @returns {[Property]|null}
   */
  getPropertyAt(index: number) {
    // @ts-ignore
    return this.get('properties').at(index);
  }

  /**
   * Check if the property is detached.
   * @returns {Boolean}
   */
  isDetached() {
    return !!this.get('detached');
  }

  /**
   * Get current values of properties.
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.byName=false] Use property names as a key instead of the id.
   * @returns {Object}
   * @example
   * // In case the property is `margin` with sub properties like `margin-top`, `margin-right`, etc.
   * console.log(property.getValues());
   * // { 'margin-top': '10px', 'margin-right': '20px', ... };
   */
  getValues({ byName }: { byName?: boolean } = {}) {
    return this.getProperties().reduce(
      (res, prop) => {
        const key = byName ? prop.getName() : prop.getId();
        res[key] = `${prop.__getFullValue()}`;
        return res;
      },
      {} as Record<string, any>,
    );
  }

  /**
   * Get property separator.
   * @returns {RegExp}
   */
  getSeparator() {
    return this.getSplitSeparator();
  }

  /**
   * Get the join value.
   * @returns {String}
   */
  getJoin() {
    return this.__getJoin();
  }

  /**
   * Get style object from current properties
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.camelCase] Return property names in camelCase.
   * @returns {Object} Style object
   * @private
   */
  getStyleFromProps(opts: OptionsStyle = {}) {
    const name = this.getName();
    const join = this.__getJoin();
    const toStyle = this.get('toStyle');
    let values = this.getValues();
    let style: StyleProps = {};

    if (toStyle) {
      style = toStyle(values, { join, name, property: this });
    } else {
      values = this.getValues({ byName: true });

      if (this.isDetached()) {
        style = values;
      } else {
        const value = this.getProperties()
          .map((p) => p.__getFullValue({ withDefault: 1 }))
          .filter(Boolean)
          .join(join);
        style = { [name]: value };
      }
    }

    if (this.isDetached()) {
      style[name] = '';
    } else {
      style[name] = style[name] || '';
      style = {
        ...style,
        ...this.getProperties().reduce((acc, prop) => {
          acc[prop.getName()] = '';
          return acc;
        }, {} as StyleProps),
      };
    }

    return opts.camelCase
      ? Object.keys(style).reduce((res, key) => {
          res[camelCase(key)] = style[key];
          return res;
        }, {} as StyleProps)
      : style;
  }

  getSplitSeparator() {
    return new RegExp(`${this.get('separator')}(?![^\\(]*\\))`);
  }

  __upProperties(p: PropertyComposite, opts: any = {}): void {
    if (opts.__up || opts.__clearIn) return;

    const parentProp = this.__getParentProp();
    if (parentProp) return parentProp.__upProperties(this as any, opts);

    this.__upTargetsStyleProps(opts, p);
  }

  __upTargetsStyleProps(opts = {}, prop?: Property) {
    let style = this.getStyleFromProps();

    if (this.isDetached() && prop) {
      const name = prop.getName();
      style = { [name]: style[name] };
    }

    this.__upTargetsStyle(style, opts);
  }

  _up(props: Partial<T>, opts: OptionsUpdate = {}) {
    this.__setProperties(this.__getSplitValue(props.value), opts);
    Property.prototype._up.call(this, props, opts);
    return this;
  }

  getStyle(opts?: { camelCase?: boolean }) {
    return this.getStyleFromProps(opts);
  }

  __getFullValue(opts: any = {}) {
    if (this.isDetached() || opts.__clear) return '';

    const result = this.getStyleFromProps()[this.getName()] || '';

    return getLastStyleValue(result as string);
  }

  __getJoin() {
    const join = this.get('join')!;
    return isString(join) ? join : this.get('separator')!;
  }

  __styleHasProps(style: StyleProps = {}) {
    const name = this.getName();
    const props = this.getProperties();
    const nameProps = props.map((prop) => prop.getName());
    const allNameProps = [name, ...nameProps];
    return allNameProps.some((prop) => !isUndefined(style[prop]) && style[prop] !== '');
  }

  __splitValue(value: string | string[], sep: string | RegExp) {
    return getLastStyleValue(value)
      .split(sep)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  __splitStyleName(style: StyleProps, name: string, sep: string | RegExp) {
    const value = style[name];

    return this.__splitValue((value as string) || '', sep);
  }

  __getSplitValue(value: string | string[] = '', { byName }: OptionByName = {}) {
    const props = this.getProperties();
    const props4Nums = props.length === 4 && props.every((prop) => isNumberType(prop.getType()));
    const values = this.__splitValue(value, this.getSplitSeparator());
    const result: StyleProps = {};

    props.forEach((prop, i) => {
      const value = values[i];
      let res = !isUndefined(value) ? value : ''; // : prop.getDefaultValue();

      if (props4Nums) {
        // Try to get value from a shorthand:
        // 11px -> 11px 11px 11px 11xp
        // 11px 22px -> 11px 22px 11px 22xp
        const len = values.length;
        res = values[i] || values[(i % len) + (len != 1 && len % 2 ? 1 : 0)] || res;
      }

      const key = byName ? prop.getName() : prop.getId();
      result[key] = res || '';
    });

    return result;
  }

  __getPropsFromStyle(style: StyleProps = {}, opts: OptionByName = {}) {
    if (!this.__styleHasProps(style)) return null;

    const { byName } = opts;
    const name = this.getName();
    const props = this.getProperties();
    const sep = this.getSplitSeparator();
    const fromStyle = this.get('fromStyle');
    let result = fromStyle ? fromStyle(style, { property: this, name, separator: sep }) : {};

    if (!fromStyle) {
      // Get props from the main property
      const value = style[name];

      result = this.__getSplitValue((value as string) || '', { byName });

      // Get props from the inner properties
      props.forEach((prop) => {
        const value = style[prop.getName()];
        const key = byName ? prop.getName() : prop.getId();
        if (!isUndefined(value) && value !== '') result[key] = value;
      });
    }

    return result;
  }

  __setProperties(values: Record<string, any> = {}, opts: OptionsUpdate = {}) {
    this.getProperties().forEach((prop) => {
      const value = values[prop.getId()];
      prop.__getFullValue() !== value && prop.upValue(value, opts);
    });

    // Keep track of the values, otherwise clear() will not trigger changes.
    const valuesStr = keys(values)
      .map((k) => values[k])
      .join(' ');
    this.set('value', valuesStr as any, { silent: true });
  }

  clear() {
    this.getProperties().map((p) => p.clear({ __clearIn: !this.isDetached() }));
    Property.prototype.clear.call(this);
    return this;
  }

  hasValue(opts?: Parameters<Property['hasValue']>[0]) {
    return this.getProperties().some((prop) => prop.hasValue(opts));
  }

  getFullValue() {
    return this.__getFullValue();
  }

  __canClearProp(prop: Property) {
    return this.isDetached() && prop.hasValue({ noParent: true });
  }
}
```

--------------------------------------------------------------------------------

````
