---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 64
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 64 of 97)

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

---[FILE: PropertyStack.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/model/PropertyStack.ts

```typescript
import { isArray, isNumber, isString, isUndefined, keys } from 'underscore';
import { StyleProps, getLastStyleValue } from '../../domain_abstract/model/StyleableModel';
import { camelCase } from '../../utils/mixins';
import Layer, { LayerProps, LayerValues } from './Layer';
import Layers from './Layers';
import { OptionsStyle, OptionsUpdate, default as Property, default as PropertyBase } from './Property';
import PropertyComposite, {
  FromStyle,
  FromStyleData,
  PropValues,
  PropertyCompositeProps,
  ToStyle,
  ToStyleData,
  isNumberType,
} from './PropertyComposite';
import PropertyNumber from './PropertyNumber';

const VALUES_REG = /,(?![^\(]*\))/;
const PARTS_REG = /\s(?![^(]*\))/;

type ToStyleDataStack = Omit<ToStyleData, 'property'> & { joinLayers: string; layer: Layer; property: PropertyStack };

type FromStyleDataStack = Omit<FromStyleData, 'property' | 'separator'> & {
  property: PropertyStack;
  separatorLayers: RegExp;
};

export type OptionStyleStack = OptionsStyle & { number?: { min?: number; max?: number }; __clear?: boolean };

/** @private */
export interface PropertyStackProps extends Omit<PropertyCompositeProps, 'toStyle' | 'fromStyle'> {
  layers?: LayerProps[];

  /**
   * The separator used to split layer values.
   */
  layerSeparator?: string | RegExp;

  /**
   * Value used to join layer values.
   */
  layerJoin?: string;

  /**
   * Indicate if the layer should display a preview.
   */
  preview?: boolean;

  /**
   * Custom logic for creating layer labels.
   */
  layerLabel?: (layer: Layer, data: { index: number; values: LayerValues; property: PropertyStack }) => string;

  /**
   * Empty value to apply when all layers are removed.
   * @default 'unset'
   * @example
   * // use simple string
   * emptyValue: 'inherit',
   * // or a function for a custom style object
   * emptyValue: () => ({
   *  color: 'unset',
   *  width: 'auto'
   * }),
   */
  emptyValue?: string | ((data: { property: PropertyStack }) => PropValues);

  toStyle?: (values: PropValues, data: ToStyleDataStack) => ReturnType<ToStyle>;
  fromStyle?: (style: StyleProps, data: FromStyleDataStack) => ReturnType<FromStyle>;
  parseLayer?: (data: { value: string; values: PropValues }) => PropValues;
  selectedLayer?: Layer;
  prepend?: boolean;
  __layers?: PropValues[];
  isEmptyValue?: boolean;
}

/**
 *
 * [Layer]: layer.html
 *
 *
 * @typedef PropertyStack
 * @property {Boolean} [preview=false] Indicate if the layer should display a preview.
 * @property {String|RegExp} [layerSeparator=', '] The separator used to split layer values.
 * @property {String} [layerJoin=', '] Value used to join layer values.
 * @property {Function} [layerLabel] Custom logic for creating layer labels.
 * \n
 * ```js
 *  layerLabel: (layer) => {
 *    const values = layer.getValues();
 *    return `A: ${values['prop-a']} B: ${values['prop-b']}`;
 *  }
 *  ```
 * @property {String|Function} [emptyValue='unset'] Empty value to apply when all layers are removed.
 * \n
 * ```js
 *  // use simple string
 *  emptyValue: 'inherit',
 *  // or a function for a custom style object
 *  emptyValue: () => ({
 *    color: 'unset',
 *    width: 'auto'
 *  }),
 *  ```
 *
 */
export default class PropertyStack extends PropertyComposite<PropertyStackProps> {
  defaults() {
    return {
      ...PropertyComposite.getDefaults(),
      layers: [],
      emptyValue: 'unset',
      layerSeparator: ', ',
      layerJoin: '',
      prepend: 0,
      preview: false,
      layerLabel: null,
      selectedLayer: null,
    };
  }

  initialize(props = {}, opts = {}) {
    // @ts-ignore
    PropertyComposite.callParentInit(PropertyComposite, this, props, opts);
    const layers = this.get('layers');
    const layersColl = new Layers(layers, { prop: this });
    // @ts-ignore
    layersColl.property = this;
    // @ts-ignore
    layersColl.properties = this.get('properties');
    this.set('layers', layersColl as any, { silent: true });
    this.on('change:selectedLayer', this.__upSelected);
    this.listenTo(layersColl, 'add remove', this.__upLayers);
    // @ts-ignore
    PropertyComposite.callInit(this, props, opts);
  }

  get layers() {
    return this.get('layers') as unknown as Layers;
  }

  /**
   * Get all available layers.
   * @returns {Array<[Layer]>}
   */
  getLayers() {
    return this.layers.models;
  }

  /**
   * Check if the property has layers.
   * @returns {Boolean}
   */
  hasLayers() {
    return this.getLayers().length > 0;
  }

  /**
   * Get layer by index.
   * @param {Number} [index=0] Layer index position.
   * @returns {[Layer]|null}
   * @example
   * // Get the first layer
   * const layerFirst = property.getLayer(0);
   * // Get the last layer
   * const layers = this.getLayers();
   * const layerLast = property.getLayer(layers.length - 1);
   */
  getLayer(index = 0): Layer | undefined {
    return this.layers.at(index) || undefined;
  }

  /**
   * Get selected layer.
   * @returns {[Layer] | undefined}
   */
  getSelectedLayer() {
    const layer = this.get('selectedLayer');
    return layer && layer.getIndex() >= 0 ? layer : undefined;
  }

  /**
   * Select layer.
   * Without a selected layer any update made on inner properties has no effect.
   * @param {[Layer]} layer Layer to select
   * @example
   * const layer = property.getLayer(0);
   * property.selectLayer(layer);
   */
  selectLayer(layer: Layer) {
    return this.set('selectedLayer', layer, { __select: true } as any);
  }

  /**
   * Select layer by index.
   * @param {Number} index Index of the layer to select.
   * @example
   * property.selectLayerAt(1);
   */
  selectLayerAt(index = 0) {
    const layer = this.getLayer(index);
    return layer && this.selectLayer(layer);
  }

  /**
   * Move layer by index.
   * @param {[Layer]} layer Layer to move.
   * @param {Number} index New layer index.
   * @example
   * const layer = property.getLayer(1);
   * property.moveLayer(layer, 0);
   */
  moveLayer(layer: Layer, index = 0) {
    const { layers } = this;
    const currIndex = layer ? layer.getIndex() : -1;

    if (currIndex >= 0 && isNumber(index) && index >= 0 && index < layers.length && currIndex !== index) {
      this.removeLayer(layer);
      layers.add(layer, { at: index });
    }
  }

  /**
   * Add new layer to the stack.
   * @param {Object} [props={}] Custom property values to use in a new layer.
   * @param {Object} [opts={}] Options
   * @param {Number} [opts.at] Position index (by default the layer will be appended at the end).
   * @returns {[Layer]} Added layer.
   * @example
   * // Add new layer at the beginning of the stack with custom values
   * property.addLayer({ 'sub-prop1': 'value1', 'sub-prop2': 'value2' }, { at: 0 });
   */
  addLayer(props: LayerValues = {}, opts = {}) {
    const values: LayerValues = {};
    this.getProperties().forEach((prop) => {
      const key = prop.getId();
      const value = props[key];
      values[key] = isUndefined(value) ? prop.getDefaultValue() : value;
    });
    const layer = this.layers.push({ values } as any, opts);

    return layer;
  }

  /**
   * Remove layer.
   * @param {[Layer]} layer Layer to remove.
   * @returns {[Layer]} Removed layer
   * @example
   * const layer = property.getLayer(0);
   * property.removeLayer(layer);
   */
  removeLayer(layer: Layer) {
    return this.layers.remove(layer);
  }

  /**
   * Remove layer by index.
   * @param {Number} index Index of the layer to remove
   * @returns {[Layer]|null} Removed layer
   * @example
   * property.removeLayerAt(0);
   */
  removeLayerAt(index = 0) {
    const layer = this.getLayer(index);
    return layer ? this.removeLayer(layer) : null;
  }

  /**
   * Get the layer label. The label can be customized with the `layerLabel` property.
   * @param {[Layer]} layer
   * @returns {String}
   * @example
   * const layer = this.getLayer(1);
   * const label = this.getLayerLabel(layer);
   */
  getLayerLabel(layer: Layer) {
    let result = '';

    if (layer) {
      const layerLabel = this.get('layerLabel');
      const values = layer.getValues();
      const index = layer.getIndex();

      if (layerLabel) {
        result = layerLabel(layer, { index, values, property: this });
      } else {
        const parts: string[] = [];
        this.getProperties().map((prop) => {
          parts.push(values[prop.getId()]);
        });
        result = parts.filter(Boolean).join(' ');
      }
    }

    return result;
  }

  /**
   * Get style object from the layer.
   * @param {[Layer]} layer
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.camelCase] Return property names in camelCase.
   * @param {Object} [opts.number] Limit the result of the number types, eg. `number: { min: -3, max: 3 }`
   * @returns {Object} Style object
   */
  getStyleFromLayer(layer: Layer, opts: OptionStyleStack = {}) {
    const join = this.__getJoin();
    const joinLayers = this.__getJoinLayers();
    const toStyle = this.get('toStyle');
    const name = this.getName();
    const values = layer.getValues();
    let style: StyleProps;

    if (toStyle) {
      style = toStyle(values, {
        join,
        joinLayers,
        name,
        layer,
        property: this,
      });
    } else {
      const result = this.getProperties().map((prop) => {
        const name = prop.getName();
        const val = values[prop.getId()];
        let value = isUndefined(val) ? prop.getDefaultValue() : val;

        // Limit number values if necessary (useful for previews)
        if (opts.number && isNumberType(prop.getType())) {
          const newVal = (prop as PropertyNumber).parseValue(val, opts.number);
          value = `${newVal.value}${newVal.unit}`;
        }

        return { name, value };
      });
      style = this.isDetached()
        ? result.reduce((acc, item) => {
            acc[item.name] = item.value;
            return acc;
          }, {} as StyleProps)
        : {
            [this.getName()]: result.map((r) => r.value).join(join),
          };
    }

    return opts.camelCase
      ? Object.keys(style).reduce((res, key) => {
          res[camelCase(key)] = style[key];
          return res;
        }, {} as StyleProps)
      : style;
  }

  /**
   * Get preview style object from the layer.
   * If the property has `preview: false` the returned object will be empty.
   * @param {[Layer]} layer
   * @param {Object} [opts={}] Options. Same of `getStyleFromLayer`
   * @returns {Object} Style object
   */
  getStylePreview(layer: Layer, opts: OptionStyleStack = {}) {
    let result = {};
    const preview = this.get('preview');

    if (preview) {
      result = this.getStyleFromLayer(layer, opts);
    }

    return result;
  }

  /**
   * Get layer separator.
   * @return {RegExp}
   */
  getLayerSeparator() {
    const sep = this.get('layerSeparator')!;
    return isString(sep) ? new RegExp(`${sep}(?![^\\(]*\\))`) : sep;
  }

  /**
   * Check if the property is with an empty value.
   * @returns {Boolean}
   */
  hasEmptyValue() {
    return !this.hasLayers() && !!this.attributes.isEmptyValue;
  }

  __upProperties(prop: Property, opts: any = {}) {
    const layer = this.getSelectedLayer();
    if (!layer) return;
    layer.upValues({ [prop.getId()]: prop.__getFullValue() });
    if (opts.__up) return;
    this.__upTargetsStyleProps(opts);
  }

  __upLayers(m: any, c: any, o: any) {
    this.__upTargetsStyleProps(o || c);
  }

  __upTargets(p: this, opts: any = {}): void {
    if (opts.__select) return;
    return PropertyBase.prototype.__upTargets.call(this, p as any, opts);
  }

  __upTargetsStyleProps(opts = {}) {
    this.__upTargetsStyle(this.getStyleFromLayers(opts), opts);
  }

  __upTargetsStyle(style: StyleProps, opts: any) {
    return PropertyBase.prototype.__upTargetsStyle.call(this, style, opts);
  }

  __upSelected({ noEvent }: { noEvent?: boolean } = {}, opts: OptionsUpdate = {}) {
    const sm = this.em.Styles;
    const selected = this.getSelectedLayer();
    const values = selected?.getValues();

    // Update properties by layer value
    values &&
      this.getProperties().forEach((prop) => {
        const value = values[prop.getId()] ?? '';
        prop.__getFullValue() !== value && prop.upValue(value, { ...opts, __up: true });
      });

    !noEvent && sm.__trgEv(sm.events.layerSelect, { property: this });
  }

  // @ts-ignore
  _up(props: Partial<PropertyStackProps>, opts: OptionsUpdate = {}) {
    const { __layers = [], ...rest } = props;
    // Detached props will update their layers later in sm.__upProp
    !this.isDetached() && this.__setLayers(__layers);
    this.__upSelected({ noEvent: true }, opts);
    PropertyBase.prototype._up.call(this, rest, opts);
    return this;
  }

  __setLayers(newLayers: LayerValues[] = [], opts: { isEmptyValue?: boolean } = {}) {
    const { layers } = this;
    const layersNew = newLayers.map((values) => ({ values }));

    if (layers.length === layersNew.length) {
      layersNew.map((layer, n) => layers.at(n)?.upValues(layer.values));
    } else {
      layers.reset(layersNew);
    }

    this.set({ isEmptyValue: !!opts.isEmptyValue });
    this.__upSelected({ noEvent: true });
  }

  __parseValue(value: string) {
    const result = this.parseValue(value);
    result.__layers = value
      .split(VALUES_REG)
      .map((v) => v.trim())
      .map((v) => this.__parseLayer(v))
      .filter(Boolean);

    return result;
  }

  __parseLayer(value: string) {
    const parseFn = this.get('parseLayer');
    const values = value.split(PARTS_REG);
    const properties = this.getProperties();
    return parseFn
      ? parseFn({ value, values })
      : properties.reduce((acc, prop, i) => {
          const value = values[i];
          acc[prop.getId()] = !isUndefined(value) ? value : prop.getDefaultValue();
          return acc;
        }, {} as PropValues);
  }

  __getLayersFromStyle(style: StyleProps = {}): LayerValues[] | null {
    if (!this.__styleHasProps(style)) return null;
    if (this.isEmptyValueStyle(style)) return [];

    const name = this.getName();
    const props = this.getProperties();
    const sep = this.getLayerSeparator();
    const { fromStyle } = this.attributes;
    let result = fromStyle ? fromStyle(style, { property: this, name, separatorLayers: sep }) : [];

    if (!fromStyle) {
      // Get layers from the main property
      const layers = this.__splitStyleName(style, name, sep)
        .map((value) => value.split(this.getSplitSeparator()))
        .map((parts) => {
          const result: PropValues = {};
          props.forEach((prop, i) => {
            const value = parts[i];
            result[prop.getId()] = !isUndefined(value) ? value : prop.getDefaultValue();
          });
          return result;
        });
      // Get layers from the inner properties
      props.forEach((prop) => {
        const id = prop.getId();
        this.__splitStyleName(style, prop.getName(), sep)
          .map((value) => ({ [id]: value || prop.getDefaultValue() }))
          .forEach((inLayer, i) => {
            layers[i] = layers[i] ? { ...layers[i], ...inLayer } : inLayer;
          });
      });
      result = layers;
    }

    return isArray(result) ? result : [result];
  }

  getStyle(opts: OptionStyleStack = {}) {
    return this.getStyleFromLayers(opts);
  }

  getStyleFromLayers(opts: OptionStyleStack = {}) {
    let result: StyleProps = {};
    const name = this.getName();
    const layers = this.getLayers();
    const props = this.getProperties();
    const styles = layers.map((l) => this.getStyleFromLayer(l, opts));
    styles.forEach((style) => {
      keys(style).map((key) => {
        if (!result[key]) {
          result[key] = [];
        }
        // @ts-ignore
        result[key].push(style[key]);
      });
    });
    keys(result).map((key) => {
      result[key] = (result[key] as string[]).join(this.__getJoinLayers());
    });

    if (this.isDetached()) {
      result[name] = '';
      !layers.length &&
        props.map((prop) => {
          result[prop.getName()] = '';
        });
    } else {
      const style = props.reduce((acc, prop) => {
        acc[prop.getName()] = '';
        return acc;
      }, {} as StyleProps);
      result[name] = result[name] || '';
      result = { ...result, ...style };
    }

    return {
      ...result,
      ...(opts.__clear ? {} : this.getEmptyValueStyle()),
    };
  }

  isEmptyValueStyle(style: StyleProps = {}) {
    const emptyStyle = this.getEmptyValueStyle({ force: true });
    const props = keys(emptyStyle);
    return !!props.length && props.every((prop) => emptyStyle[prop] === style[prop]);
  }

  getEmptyValueStyle(opts: { force?: boolean } = {}) {
    const { emptyValue } = this.attributes;

    if (emptyValue && (!this.hasLayers() || opts.force)) {
      const name = this.getName();
      const props = this.getProperties();
      const result = isString(emptyValue) ? emptyValue : emptyValue({ property: this });

      if (isString(result)) {
        const style: StyleProps = {};

        if (this.isDetached()) {
          props.map((prop) => {
            style[prop.getName()] = result;
          });
        } else {
          style[name] = result;
        }

        return style;
      } else {
        return result;
      }
    } else {
      return {};
    }
  }

  __getJoinLayers() {
    const join = this.get('layerJoin')!;
    const sep = this.get('layerSeparator');

    return join || (isString(sep) ? sep : join);
  }

  __getFullValue() {
    if (this.get('detached')) return '';
    const style = this.getStyleFromLayers();

    return getLastStyleValue(style[this.getName()]);
  }

  /**
   * Extended
   * @private
   */
  hasValue(opts: { noParent?: boolean } = {}) {
    const { noParent } = opts;
    const parentValue = noParent && this.getParentTarget();
    return (this.hasLayers() || this.hasEmptyValue()) && !parentValue;
  }

  /**
   * Extended
   * @private
   */
  clear(opts = {}) {
    this.layers.reset();
    this.__upTargetsStyleProps({ ...opts, __clear: true });
    PropertyBase.prototype.clear.call(this);
    return this;
  }

  __canClearProp() {
    return false;
  }

  /**
   * @deprecated
   * @private
   */
  __getLayers() {
    return this.layers;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Sector.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/model/Sector.ts

```typescript
import { extend, isString } from 'underscore';
import { AddOptions, Collection, Model } from '../../common';
import EditorModel from '../../editor/model/Editor';
import Properties from './Properties';
import Property from './Property';
import { PropertyTypes } from '..';

/** @private */
export interface SectorProperties {
  id?: string;
  name: string;
  open?: boolean;
  visible?: boolean;
  buildProps?: string[];
  extendBuilded?: boolean;
  properties?: PropertyTypes[];
}

/**
 *
 * [Property]: property.html
 *
 * @typedef Sector
 * @property {String} id Sector id, eg. `typography`
 * @property {String} name Sector name, eg. `Typography`
 * @property {Boolean} [open=true] Indicates the open state.
 * @property {Array<Object>} [properties=[]] Indicate an array of Property definitions.
 */
export default class Sector extends Model<SectorProperties> {
  em: EditorModel;

  defaults() {
    return {
      id: '',
      name: '',
      open: true,
      visible: true,
      extendBuilded: true,
      properties: [],
    };
  }

  /**
   * @hideconstructor
   */
  constructor(prp: SectorProperties, opts: { em?: EditorModel } = {}) {
    super(prp);
    const { em } = opts;
    this.em = em!;
    const o = prp || {};
    const builded = this.buildProperties(o.buildProps!);
    const name = this.get('name') || '';
    let props = [];
    !this.get('id') && this.set('id', name.replace(/ /g, '_').toLowerCase());

    if (!builded) {
      props = this.get('properties')!
        .map((prop) => (isString(prop) ? this.buildProperties(prop)[0] : prop))
        .filter(Boolean);
    } else {
      props = this.extendProperties(builded);
    }

    props = props.map((prop) => this.checkExtend(prop));

    const propsModel = new Properties(props, { em });
    propsModel.sector = this;
    this.set('properties', propsModel);
  }

  get properties() {
    return this.get('properties') as unknown as Collection<Property>;
  }

  /**
   * Get sector id.
   * @returns {String}
   */
  getId() {
    return this.get('id')!;
  }

  /**
   * Get sector name.
   * @returns {String}
   */
  getName(): string {
    const id = this.getId();
    return this.em?.t(`styleManager.sectors.${id}`) || this.get('name');
  }

  /**
   * Update sector name.
   * @param {String} value New sector name
   */
  setName(value: string) {
    return this.set('name', value);
  }

  /**
   * Check if the sector is open
   * @returns {Boolean}
   */
  isOpen() {
    return !!this.get('open');
  }

  /**
   * Update Sector open state
   * @param {Boolean} value
   */
  setOpen(value: boolean) {
    return this.set('open', value);
  }

  /**
   * Check if the sector is visible
   * @returns {Boolean}
   */
  isVisible() {
    return !!this.get('visible');
  }

  /**
   * Get sector properties.
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.withValue=false] Get only properties with value
   * @param {Boolean} [opts.withParentValue=false] Get only properties with parent value
   * @returns {Array<[Property]>}
   */
  getProperties(opts: { withValue?: boolean; withParentValue?: boolean } = {}) {
    const props = this.properties;
    const res = (props.models ? [...props.models] : props) as Property[];
    return res.filter((prop) => {
      let result = true;

      if (opts.withValue) {
        result = prop.hasValue({ noParent: true });
      }

      if (opts.withParentValue) {
        const hasVal = prop.hasValue({ noParent: true });
        result = !hasVal && prop.hasValue();
      }

      return result;
    });
  }

  getProperty(id: string): Property | undefined {
    return this.getProperties().filter((prop) => prop.get('id') === id)[0] || undefined;
  }

  addProperty(property: PropertyTypes, opts: AddOptions) {
    return this.properties.add(this.checkExtend(property), opts);
  }

  /**
   * Extend properties
   * @param {Array<Object>} props Start properties
   * @param {Array<Object>} moProps Model props
   * @param {Boolean} ex Returns the same amount of passed model props
   * @return {Array<Object>} Final props
   * @private
   */
  extendProperties(props: PropertyTypes[], moProps?: PropertyTypes[], ex = false) {
    var pLen = props.length;
    var mProps = moProps || this.get('properties')!;
    var ext = this.get('extendBuilded');
    var isolated = [];

    for (var i = 0, len = mProps.length; i < len; i++) {
      var mProp = mProps[i];
      var found = 0;

      for (var j = 0; j < pLen; j++) {
        var prop = props[j];
        if (mProp.property == prop.property || mProp.id == prop.property) {
          // @ts-ignore Check for nested properties
          var mPProps = mProp.properties;
          if (mPProps && mPProps.length) {
            // @ts-ignore
            mProp.properties = this.extendProperties(prop.properties || [], mPProps, 1);
          }
          props[j] = ext ? extend(prop, mProp) : mProp;
          isolated[j] = props[j];
          found = 1;
          continue;
        }
      }

      if (!found) {
        props.push(mProp);
        isolated.push(mProp);
      }
    }

    return ex ? isolated.filter((i) => i) : props;
  }

  checkExtend(prop: any): PropertyTypes {
    const { extend, ...rest } = (isString(prop) ? { extend: prop } : prop) || {};
    if (extend) {
      return {
        ...(this.buildProperties([extend])[0] || {}),
        ...rest,
      };
    } else {
      return prop;
    }
  }

  /**
   * Build properties
   * @param {Array<string>} propr Array of props as sting
   * @return {Array<Object>}
   * @private
   */
  buildProperties(props: string | string[]): PropertyTypes[] {
    const buildP = props || [];

    if (!buildP.length) return [];

    const builtIn = this.em?.Styles.builtIn;

    return builtIn?.build(buildP);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Sectors.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/model/Sectors.ts

```typescript
import { Collection } from '../../common';
import EditorModel from '../../editor/model/Editor';
import Sector from './Sector';

export default class Sectors extends Collection<Sector> {
  em!: EditorModel;
  module!: any;

  initialize(prop: any, opts: { em?: EditorModel; module?: any } = {}) {
    const { module, em } = opts;
    this.em = em!;
    this.module = module;
    this.listenTo(this, 'reset', this.onReset);
  }

  /** @ts-ignore */
  model(props, opts = {}) {
    // @ts-ignore
    const { em } = opts.collection;
    return new Sector(props, { ...opts, em });
  }

  onReset(models: any, opts: { previousModels?: Sector[] } = {}) {
    const prev = opts.previousModels || [];
    // @ts-ignore
    prev.forEach((sect) => sect.get('properties').reset());
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LayersView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/LayersView.ts

```typescript
import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import StyleManagerSorter from '../../utils/sorter/StyleManagerSorter';
import { DragDirection } from '../../utils/sorter/types';
import Layer from '../model/Layer';
import Layers from '../model/Layers';
import LayerView from './LayerView';
import PropertyStackView from './PropertyStackView';

export default class LayersView extends View<Layer> {
  pfx: string;
  ppfx: string;
  config: any;
  propertyView: PropertyStackView;
  items: LayerView[];
  sorter?: StyleManagerSorter;

  constructor(o: any) {
    super(o);
    const coll = this.collection;
    const config = o.config || {};
    const em = config.em as EditorModel;
    const pfx = config.stylePrefix || '';
    const ppfx = config.pStylePrefix || '';
    this.config = config;
    this.pfx = pfx;
    this.ppfx = ppfx;
    this.propertyView = o.propertyView;
    this.className = `${pfx}layers ${ppfx}field`;
    this.listenTo(coll, 'add', this.addTo);
    this.listenTo(coll, 'reset', this.reset);
    this.items = [];
    const placeholderElement = this.createPlaceholder(config.pStylePrefix);
    this.$el.append(placeholderElement);

    // For the Sorter
    const utils = em?.Utils;
    this.sorter = utils
      ? new utils.StyleManagerSorter({
          em,
          containerContext: {
            container: this.el,
            containerSel: `.${pfx}layers`,
            itemSel: `.${pfx}layer`,
            pfx: config.pStylePrefix,
            document: document,
            placeholderElement: placeholderElement,
          },
          dragBehavior: {
            dragDirection: DragDirection.Vertical,
            nested: false,
          },
        })
      : undefined;
    // @ts-ignore
    coll.view = this;
    this.$el.data('model', coll);
    this.$el.data('collection', coll);
  }

  addTo(model: Layer) {
    const i = this.collection.indexOf(model);
    this.addToCollection(model, null, i);
  }

  addToCollection(model: Layer, fragmentEl: DocumentFragment | null, index?: number) {
    const fragment = fragmentEl || null;
    const { propertyView, config, sorter, $el } = this;
    const view = new LayerView({
      model,
      // @ts-ignore
      config,
      sorter,
      propertyView,
    });
    const rendered = view.render().el;
    this.items.push(view);

    if (fragment) {
      fragment.appendChild(rendered);
    } else {
      if (typeof index != 'undefined') {
        let method = 'before';

        if ($el.children().length === index) {
          index--;
          method = 'after';
        }

        if (index < 0) {
          $el.append(rendered);
        } else {
          // @ts-ignore
          $el.children().eq(index)[method](rendered);
        }
      } else {
        $el.append(rendered);
      }
    }

    return rendered;
  }

  reset(coll: any, opts: any) {
    this.clearItems();
    this.render();
  }

  remove() {
    this.clearItems();
    View.prototype.remove.apply(this, arguments as any);
    return this;
  }

  clearItems() {
    this.items.forEach((item) => item.remove());
    this.items = [];
  }

  render() {
    const { $el } = this;
    const frag = document.createDocumentFragment();
    $el.empty();
    this.collection.forEach((m) => this.addToCollection(m, frag));
    $el.append(frag);
    $el.attr('class', this.className!);

    return this;
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
}
```

--------------------------------------------------------------------------------

---[FILE: LayerView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/LayerView.ts

```typescript
import { View } from '../../common';
import { keys } from 'underscore';
import Layer from '../model/Layer';
import EditorModel from '../../editor/model/Editor';
import PropertyStackView from './PropertyStackView';

export default class LayerView extends View<Layer> {
  pfx!: string;
  ppfx!: string;
  em!: EditorModel;
  propertyView!: PropertyStackView;
  propsWrapEl?: HTMLElement;
  previewEl?: HTMLElement;
  labelEl?: HTMLElement;
  sorter!: any;
  config!: any;

  events() {
    return {
      click: 'select',
      'click [data-close-layer]': 'removeItem',
      'mousedown [data-move-layer]': 'initSorter',
      'touchstart [data-move-layer]': 'initSorter',
    };
  }

  template() {
    const { pfx, ppfx, em } = this;
    const icons = em?.getConfig().icons;
    const iconClose = icons?.close || '';
    const iconMove = icons?.move || '';

    return `
      <div class="${pfx}label-wrp">
        <div id="${pfx}move" class="${ppfx}no-touch-actions" data-move-layer>
          ${iconMove}
        </div>
        <div id="${pfx}label" data-label></div>
        <div id="${pfx}preview-box" class="${pfx}layer-preview" style="display: none" data-preview-box>
          <div id="${pfx}preview" class="${pfx}layer-preview-cnt" data-preview></div>
        </div>
        <div id="${pfx}close-layer" class="${pfx}btn-close" data-close-layer>
          ${iconClose}
        </div>
      </div>
      <div id="${pfx}inputs" data-properties></div>
    `;
  }

  initialize(o: any = {}) {
    const { model } = this;
    const config = o.config || {};
    this.em = config.em;
    this.config = config;
    this.sorter = o.sorter;
    this.pfx = config.stylePrefix || '';
    this.ppfx = config.pStylePrefix || '';
    this.propertyView = o.propertyView;
    const pModel = this.propertyView.model;
    this.listenTo(model, 'destroy remove', this.remove);
    this.listenTo(model, 'change:values', this.updateLabel);
    this.listenTo(pModel, 'change:selectedLayer', this.updateVisibility);

    // For the sorter
    model.view = this;
    // @ts-ignore
    model.set({ droppable: 0, draggable: 1 });
    this.$el.data('model', model);
  }

  initSorter() {
    this.sorter?.startSort([{ element: this.el }]);
  }

  removeItem(ev: Event) {
    ev && ev.stopPropagation();
    this.model.remove();
  }

  select() {
    this.model.select();
  }

  getPropertiesWrapper() {
    if (!this.propsWrapEl) this.propsWrapEl = this.el.querySelector('[data-properties]')!;
    return this.propsWrapEl;
  }

  getPreviewEl() {
    if (!this.previewEl) this.previewEl = this.el.querySelector('[data-preview]')!;
    return this.previewEl;
  }

  getLabelEl() {
    if (!this.labelEl) this.labelEl = this.el.querySelector('[data-label]')!;
    return this.labelEl;
  }

  updateLabel() {
    const { model } = this;
    const label = model.getLabel();
    this.getLabelEl().innerHTML = label;

    if (model.hasPreview()) {
      const prvEl = this.getPreviewEl();
      const style = model.getStylePreview({ number: { min: -3, max: 3 } });
      const styleStr = keys(style)
        .map((k) => `${k}:${style[k]}`)
        .join(';');
      prvEl.setAttribute('style', styleStr);
    }
  }

  updateVisibility() {
    const { pfx, model, propertyView } = this;
    const wrapEl = this.getPropertiesWrapper();
    const isSelected = model.isSelected();
    wrapEl.style.display = isSelected ? '' : 'none';
    this.$el[isSelected ? 'addClass' : 'removeClass'](`${pfx}active`);
    isSelected && wrapEl.appendChild(propertyView.props?.el!);
  }

  render() {
    const { el, pfx, model } = this;
    el.innerHTML = this.template();
    el.className = `${pfx}layer`;
    if (model.hasPreview()) {
      (el.querySelector('[data-preview-box]') as HTMLElement).style.display = '';
    }
    this.updateLabel();
    this.updateVisibility();
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertiesView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/PropertiesView.ts

```typescript
import { View } from '../../common';
import { appendAtIndex } from '../../utils/dom';
import PropertyView from './PropertyView';

export default class PropertiesView extends View {
  config?: any;
  pfx: string;
  properties: PropertyView[];
  parent?: PropertyView;

  constructor(o: any) {
    super(o);
    this.config = o.config || {};
    this.pfx = this.config.stylePrefix || '';
    this.properties = [];
    this.parent = o.parent;
    const coll = this.collection;
    this.listenTo(coll, 'add', this.addTo);
    this.listenTo(coll, 'reset', this.render);
  }

  addTo(model: any, coll: any, opts: any) {
    this.add(model, null, opts);
  }

  add(model: any, frag: DocumentFragment | null, opts: any = {}) {
    const { parent, config } = this;
    const appendTo = frag || this.el;
    const view = new model.typeView({ model, config });
    parent && (view.parent = parent);
    view.render();
    const rendered = view.el;
    this.properties.push(view);
    appendAtIndex(appendTo, rendered, opts.at);
  }

  remove() {
    View.prototype.remove.apply(this, arguments as any);
    this.clearItems();
    return this;
  }

  clearItems() {
    this.properties.forEach((item) => item.remove());
    this.properties = [];
  }

  render() {
    const { $el, pfx } = this;
    this.clearItems();
    const fragment = document.createDocumentFragment();
    this.collection.forEach((model) => this.add(model, fragment));
    $el.empty();
    $el.append(fragment);
    $el.attr('class', `${pfx}properties`);
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertyColorView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/PropertyColorView.ts

```typescript
import PropertyNumberView from './PropertyNumberView';
import InputColor from '../../domain_abstract/ui/InputColor';

export default class PropertyColorView extends PropertyNumberView {
  setValue(value: string) {
    this.inputInst?.setValue(value, {
      fromTarget: 1,
      def: this.model.getDefaultValue(),
    });
  }

  remove() {
    PropertyNumberView.prototype.remove.apply(this, arguments as any);
    const inp = this.inputInst;
    inp && inp.remove && inp.remove();
    // @ts-ignore
    ['inputInst', '$color'].forEach((i) => (this[i] = null));
    return this;
  }

  __handleChange(value: string, partial: boolean) {
    this.model.upValue(value, { partial });
  }

  onRender() {
    if (!this.inputInst) {
      this.__handleChange = this.__handleChange.bind(this);
      const { ppfx, model, em, el } = this;
      const inputColor = new InputColor({
        target: em,
        model,
        ppfx,
        onChange: this.__handleChange,
      });
      const input = inputColor.render();
      el.querySelector(`.${ppfx}fields`)!.appendChild(input.el);
      this.input = input.inputEl?.get(0) as HTMLInputElement;
      this.inputInst = input;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertyCompositeView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/PropertyCompositeView.ts

```typescript
import PropertyView from './PropertyView';
import PropertiesView from './PropertiesView';
import PropertyComposite from '../model/PropertyComposite';

export default class PropertyCompositeView extends PropertyView {
  props?: PropertiesView;

  templateInput() {
    const { pfx } = this;
    return `
      <div class="${pfx}field ${pfx}composite">
        <span id="${pfx}input-holder"></span>
      </div>
    `;
  }

  remove() {
    this.props?.remove();
    PropertyView.prototype.remove.apply(this, arguments as any);
    return this;
  }

  onValueChange() {}

  onRender() {
    const { pfx } = this;
    const model = this.model as PropertyComposite;
    const props = model.get('properties')!;

    if (props.length && !this.props) {
      const detached = model.isDetached();
      const propsView = new PropertiesView({
        config: {
          ...this.config,
          highlightComputed: detached,
          highlightChanged: detached,
        },
        // @ts-ignore
        collection: props,
        parent: this,
      });
      propsView.render();
      this.$el.find(`#${pfx}input-holder`).append(propsView.el);
      this.props = propsView;
    }
  }

  clearCached() {
    PropertyView.prototype.clearCached.apply(this, arguments as any);
    delete this.props;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertyFileView.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/view/PropertyFileView.ts

```typescript
import { isString } from 'underscore';
import PropertyView from './PropertyView';

export default class PropertyFileView extends PropertyView {
  events() {
    return {
      ...PropertyView.prototype.events(),
      'click [data-clear-asset]': 'clear',
      'click [data-open-assets]': 'openAssetManager',
    };
  }

  templateInput() {
    const { pfx, em } = this;
    const icons = this.em?.getConfig().icons;
    const iconClose = icons?.close;

    return `
      <div class="${pfx}field ${pfx}file">
        <div id='${pfx}input-holder'>
          <div class="${pfx}btn-c">
            <button class="${pfx}btn" id="${pfx}images" type="button" data-open-assets>
              ${em.t('styleManager.fileButton')}
            </button>
          </div>
          <div style="clear:both;"></div>
        </div>
        <div id="${pfx}preview-box" class="${pfx}preview-file" data-preview-box>
          <div id="${pfx}preview-file" class="${pfx}preview-file-cnt" data-preview></div>
          <div id="${pfx}close" class="${pfx}preview-file-close" data-clear-asset>${iconClose}</div>
        </div>
      </div>
    `;
  }

  __setValueInput(value: string) {
    const { model, el } = this;
    const valueDef = model.getDefaultValue();
    const prvBoxEl = el.querySelector('[data-preview-box]') as HTMLElement;
    const prvEl = el.querySelector('[data-preview]') as HTMLElement;
    prvBoxEl.style.display = !value || value === valueDef ? 'none' : '';
    prvEl.style.backgroundImage = value || model.getDefaultValue();
  }

  openAssetManager() {
    const am = this.em?.Assets;

    am?.open({
      select: (asset, complete) => {
        const url = isString(asset) ? asset : asset.get('src');
        this.model.upValue(url, { partial: !complete });
        complete && am.close();
      },
      types: ['image'],
      accept: 'image/*',
    });
  }
}
```

--------------------------------------------------------------------------------

````
