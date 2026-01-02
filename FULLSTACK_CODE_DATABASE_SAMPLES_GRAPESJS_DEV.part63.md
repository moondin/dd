---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 63
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 63 of 97)

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

---[FILE: PropertyFactory.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/model/PropertyFactory.ts

```typescript
import { isFunction, isString } from 'underscore';
import { PropertyProps } from './Property';
import { PropertyCompositeProps } from './PropertyComposite';
import PropertyNumber, { PropertyNumberProps } from './PropertyNumber';
import PropertySelect, { PropertySelectProps } from './PropertySelect';
import { PropertyStackProps } from './PropertyStack';

type Option = {
  id: string;
  label?: string;
};

type PartialProps = Partial<
  PropertyProps | PropertyStackProps | PropertyNumberProps | PropertySelectProps | { properties?: any }
>;

const getOptions = (items: string[]): Option[] => items.map((item) => ({ id: item }));

export default class PropertyFactory {
  props: Record<string, PropertyProps | undefined> = {};
  typeNumber: string;
  typeColor: string;
  typeRadio: string;
  typeSelect: string;
  typeFile: string;
  typeSlider: string;
  typeComposite: string;
  typeStack: string;
  unitsSize: string[];
  unitsSizeNoPerc: string[];
  unitsTime: string[];
  unitsAngle: string[];
  fixedValues: string[];
  optsBgSize: Option[];
  optsBgAttach: Option[];
  optsBgRepeat: Option[];
  optsWrap: Option[];
  optsOverflow: Option[];
  optsDir: Option[];
  opstDisplay: Option[];
  optsTransitFn: Option[];
  optsCursor: Option[];
  optsFloat: Option[];
  optsPos: Option[];
  optsTextAlign: Option[];
  optsFlexAlign: Option[];
  optsJustCont: Option[];
  optsAlignCont: Option[];
  optsAlignSelf: Option[];
  optsTransitProp: Option[];
  optsBorderStyle: Option[];
  optsBgPos: Option[];
  optsWeight: Option[];
  optsShadowType: Option[];
  optsFonts: Option[];
  fixedFontSizes: string[];
  fixedLetSpace: string[];
  requireFlex: Record<string, any>;

  constructor() {
    this.typeNumber = 'number';
    this.typeColor = 'color';
    this.typeRadio = 'radio';
    this.typeSelect = 'select';
    this.typeFile = 'file';
    this.typeSlider = 'slider';
    this.typeComposite = 'composite';
    this.typeStack = 'stack';
    this.unitsSize = ['px', '%', 'em', 'rem', 'vh', 'vw'];
    this.unitsSizeNoPerc = ['px', 'em', 'rem', 'vh', 'vw'];
    this.unitsTime = ['s', 'ms'];
    this.unitsAngle = ['deg', 'rad', 'grad'];
    this.fixedValues = ['initial', 'inherit', 'auto'];
    const ss = ', sans-serif';
    const optsFlex = ['flex-start', 'flex-end', 'center'];
    const optsFlexAlign = [...optsFlex, 'baseline', 'stretch'];

    this.optsBgSize = getOptions(['auto', 'cover', 'contain']);
    this.optsBgAttach = getOptions(['scroll', 'fixed', 'local']);
    this.optsBgRepeat = getOptions(['repeat', 'repeat-x', 'repeat-y', 'no-repeat']);
    this.optsWrap = getOptions(['nowrap', 'wrap', 'wrap-reverse']);
    this.optsOverflow = getOptions(['visible', 'hidden', 'scroll', 'auto']);
    this.optsDir = getOptions(['row', 'row-reverse', 'column', 'column-reverse']);
    this.opstDisplay = getOptions(['block', 'inline', 'inline-block', 'flex', 'none']);
    this.optsTransitFn = getOptions(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']);
    this.optsCursor = getOptions(['auto', 'pointer', 'copy', 'crosshair', 'grab', 'grabbing', 'help', 'move', 'text']);
    this.optsFloat = getOptions(['none', 'left', 'right']);
    this.optsPos = getOptions(['static', 'relative', 'absolute', 'fixed']);
    this.optsTextAlign = getOptions(['left', 'center', 'right', 'justify']);
    this.optsFlexAlign = getOptions(optsFlexAlign);
    this.optsJustCont = getOptions([...optsFlex, 'space-between', 'space-around', 'space-evenly']);
    this.optsAlignCont = getOptions([...optsFlex, 'space-between', 'space-around', 'stretch']);
    this.optsAlignSelf = getOptions(['auto', ...optsFlexAlign]);
    this.optsTransitProp = getOptions([
      'all',
      'width',
      'height',
      'background-color',
      'transform',
      'box-shadow',
      'opacity',
    ]);
    this.optsBorderStyle = getOptions([
      'none',
      'solid',
      'dotted',
      'dashed',
      'double',
      'groove',
      'ridge',
      'inset',
      'outset',
    ]);
    this.optsBgPos = getOptions([
      'left top',
      'left center',
      'left bottom',
      'right top',
      'right center',
      'right bottom',
      'center top',
      'center center',
      'center bottom',
    ]);
    this.optsWeight = [
      { id: '100', label: 'Thin' },
      { id: '200', label: 'Extra-Light' },
      { id: '300', label: 'Light' },
      { id: '400', label: 'Normal' },
      { id: '500', label: 'Medium' },
      { id: '600', label: 'Semi-Bold' },
      { id: '700', label: 'Bold' },
      { id: '800', label: 'Extra-Bold' },
      { id: '900', label: 'Ultra-Bold' },
    ];
    this.optsShadowType = [
      { id: '', label: 'Outside' },
      { id: 'inset', label: 'Inside' },
    ];
    this.optsFonts = [
      'Arial, Helvetica' + ss,
      'Arial Black, Gadget' + ss,
      'Brush Script MT' + ss,
      'Comic Sans MS, cursive' + ss,
      'Courier New, Courier, monospace',
      'Georgia, serif',
      'Helvetica' + ss,
      'Impact, Charcoal' + ss,
      'Lucida Sans Unicode, Lucida Grande' + ss,
      'Tahoma, Geneva' + ss,
      'Times New Roman, Times, serif',
      'Trebuchet MS, Helvetica' + ss,
      'Verdana, Geneva' + ss,
    ].map((font) => {
      return { id: font, label: font.split(',')[0] };
    });

    // Fixed values
    this.fixedFontSizes = [
      'medium',
      'xx-small',
      'x-small',
      'small',
      'large',
      'x-large',
      'xx-large',
      'smaller',
      'larger',
      'length',
      'initial',
      'inherit',
    ];
    this.fixedLetSpace = ['normal', 'initial', 'inherit'];
    this.requireFlex = { display: ['flex'] };

    this.init();
  }

  __sub(items: (string | PropertyProps)[]) {
    return () =>
      items.map((p) => {
        if (isString(p)) return this.get(p)!;
        const { extend, ...rest } = p;
        return {
          ...this.get(extend!),
          ...rest,
        };
      });
  }

  init() {
    const { fixedValues, requireFlex, typeNumber } = this;
    this.props = {};

    // Build default built-in properties (the order, in the array here below, matters)
    // [propertyName, propertyDefinition, extendFromProperty]
    const propsToCreate: ([string, PartialProps, string] | [string, PartialProps])[] = [
      // Number types
      ['text-shadow-h', { type: typeNumber, default: '0', units: this.unitsSizeNoPerc }],
      ['top', { default: 'auto', units: this.unitsSize, fixedValues }, 'text-shadow-h'],
      ['right', {}, 'top'],
      ['bottom', {}, 'top'],
      ['left', {}, 'top'],
      ['margin-top', { default: '0' }, 'top'],
      ['margin-right', {}, 'margin-top'],
      ['margin-bottom', {}, 'margin-top'],
      ['margin-left', {}, 'margin-top'],
      ['padding-top', { min: 0 }, 'margin-top'],
      ['padding-right', {}, 'padding-top'],
      ['padding-bottom', {}, 'padding-top'],
      ['padding-left', {}, 'padding-top'],
      ['width', { min: 0 }, 'top'],
      ['min-width', {}, 'width'],
      ['max-width', {}, 'width'],
      ['height', {}, 'width'],
      ['min-height', {}, 'width'],
      ['max-height', {}, 'width'],
      ['flex-basis', { requiresParent: requireFlex }, 'width'],
      ['font-size', { default: 'medium', fixedValues: this.fixedFontSizes }, 'width'],
      ['letter-spacing', { default: 'normal', fixedValues: this.fixedLetSpace }, 'top'],
      ['line-height', {}, 'letter-spacing'],
      ['text-shadow-v', {}, 'text-shadow-h'],
      ['text-shadow-blur', { min: 0 }, 'text-shadow-h'],
      ['border-radius-c', { property: 'border-radius', fixedValues: undefined }, 'padding-top'],
      ['border-top-left-radius', {}, 'border-radius-c'],
      ['border-top-right-radius', {}, 'border-radius-c'],
      ['border-bottom-left-radius', {}, 'border-radius-c'],
      ['border-bottom-right-radius', {}, 'border-radius-c'],
      ['border-width', { units: this.unitsSizeNoPerc }, 'border-radius-c'],
      ['box-shadow-h', {}, 'text-shadow-h'],
      ['box-shadow-v', {}, 'text-shadow-h'],
      ['box-shadow-blur', { default: '5px' }, 'text-shadow-blur'],
      ['box-shadow-spread', {}, 'text-shadow-h'],
      ['transition-duration', { default: '2s', units: this.unitsTime }, 'border-radius-c'],
      ['perspective', {}, 'border-radius-c'],
      ['order', { type: typeNumber, default: '0', requiresParent: requireFlex }],
      ['flex-grow', {}, 'order'],
      ['flex-shrink', { default: '1' }, 'order'],

      // Radio types
      ['float', { type: this.typeRadio, default: 'none', options: this.optsFloat }],
      ['position', { default: 'static', options: this.optsPos }, 'float'],
      ['text-align', { default: 'left', options: this.optsTextAlign }, 'float'],

      // Color types
      ['color', { type: this.typeColor, default: 'black', full: true }],
      ['text-shadow-color', {}, 'color'],
      ['border-color', {}, 'color'],
      ['box-shadow-color', {}, 'color'],
      ['background-color', { default: 'none' }, 'color'],

      // File type
      [
        'background-image',
        {
          type: this.typeFile,
          functionName: 'url',
          default: 'none',
          full: true,
        },
      ],

      // Slider type
      ['opacity', { type: this.typeSlider, default: '1', min: 0, max: 1, step: 0.01, full: true }],

      // Select types
      ['display', { type: this.typeSelect, default: 'block', options: this.opstDisplay }],
      ['flex-direction', { default: 'row', options: this.optsDir, requires: requireFlex }, 'display'],
      ['flex-wrap', { default: 'nowrap', options: this.optsWrap }, 'flex-direction'],
      ['justify-content', { default: 'flex-start', options: this.optsJustCont }, 'flex-wrap'],
      ['align-items', { default: 'stretch', options: this.optsFlexAlign }, 'flex-wrap'],
      ['align-content', { options: this.optsAlignCont }, 'align-items'],
      [
        'align-self',
        {
          default: 'auto',
          options: this.optsAlignSelf,
          requiresParent: requireFlex,
        },
        'display',
      ],
      ['font-family', { default: 'Arial, Helvetica, sans-serif', options: this.optsFonts }, 'display'],
      ['font-weight', { default: '400', options: this.optsWeight }, 'display'],
      ['border-style', { default: 'solid', options: this.optsBorderStyle }, 'display'],
      ['box-shadow-type', { default: '', options: this.optsShadowType }, 'display'],
      ['background-repeat', { default: 'repeat', options: this.optsBgRepeat }, 'display'],
      ['background-position', { default: 'left top', options: this.optsBgPos }, 'display'],
      ['background-attachment', { default: 'scroll', options: this.optsBgAttach }, 'display'],
      ['background-size', { default: 'auto', options: this.optsBgSize }, 'display'],
      ['transition-property', { default: 'width', options: this.optsTransitProp }, 'display'],
      ['transition-timing-function', { default: 'ease', options: this.optsTransitFn }, 'display'],
      ['cursor', { default: 'auto', options: this.optsCursor }, 'display'],
      ['overflow', { default: 'visible', options: this.optsOverflow }, 'display'],
      ['overflow-x', {}, 'overflow'],
      ['overflow-y', {}, 'overflow'],

      // Composite types
      [
        'margin',
        {
          type: this.typeComposite,
          properties: this.__sub([
            { extend: 'margin-top', id: 'margin-top-sub' },
            { extend: 'margin-right', id: 'margin-right-sub' },
            { extend: 'margin-bottom', id: 'margin-bottom-sub' },
            { extend: 'margin-left', id: 'margin-left-sub' },
          ]),
        },
      ],
      [
        'padding',
        {
          properties: this.__sub([
            { extend: 'padding-top', id: 'padding-top-sub' },
            { extend: 'padding-right', id: 'padding-right-sub' },
            { extend: 'padding-bottom', id: 'padding-bottom-sub' },
            { extend: 'padding-left', id: 'padding-left-sub' },
          ]),
        },
        'margin',
      ],
      [
        'border',
        {
          properties: this.__sub([
            { extend: 'border-width', id: 'border-width-sub' },
            { extend: 'border-style', id: 'border-style-sub' },
            { extend: 'border-color', id: 'border-color-sub' },
          ]),
        },
        'margin',
      ],
      [
        'border-radius',
        {
          properties: this.__sub([
            {
              extend: 'border-top-left-radius',
              id: 'border-top-left-radius-sub',
            },
            {
              extend: 'border-top-right-radius',
              id: 'border-top-right-radius-sub',
            },
            {
              extend: 'border-bottom-left-radius',
              id: 'border-bottom-left-radius-sub',
            },
            {
              extend: 'border-bottom-right-radius',
              id: 'border-bottom-right-radius-sub',
            },
          ]),
        },
        'margin',
      ],

      // Stack types
      [
        'transition',
        {
          type: this.typeStack,
          properties: this.__sub([
            { extend: 'transition-property', id: 'transition-property-sub' },
            { extend: 'transition-duration', id: 'transition-duration-sub' },
            {
              extend: 'transition-timing-function',
              id: 'transition-timing-function-sub',
            },
          ]),
        },
      ],
      [
        'box-shadow',
        {
          preview: true,
          layerLabel: (l, { values }) => {
            const x = values['box-shadow-h'];
            const y = values['box-shadow-v'];
            const blur = values['box-shadow-blur'];
            const spread = values['box-shadow-spread'];
            return `${x} ${y} ${blur} ${spread}`;
          },
          properties: this.__sub([
            'box-shadow-h',
            'box-shadow-v',
            'box-shadow-blur',
            'box-shadow-spread',
            'box-shadow-color',
            'box-shadow-type',
          ]),
        },
        'transition',
      ],
      [
        'text-shadow',
        {
          default: 'none',
          layerLabel: (l, { values }) => {
            const x = values['text-shadow-h'];
            const y = values['text-shadow-v'];
            const blur = values['text-shadow-blur'];
            return `${x} ${y} ${blur}`;
          },
          properties: this.__sub(['text-shadow-h', 'text-shadow-v', 'text-shadow-blur', 'text-shadow-color']),
        },
        'box-shadow',
      ],
      [
        'background',
        {
          detached: true,
          layerLabel: (l, { values }) => {
            const repeat = values['background-repeat-sub'] || '';
            const pos = values['background-position-sub'] || '';
            const att = values['background-attachment-sub'] || '';
            const size = values['background-size-sub'] || '';
            return [repeat, pos, att, size].join(' ');
          },
          properties: this.__sub([
            { extend: 'background-image', id: 'background-image-sub' },
            { extend: 'background-repeat', id: 'background-repeat-sub' },
            { extend: 'background-position', id: 'background-position-sub' },
            {
              extend: 'background-attachment',
              id: 'background-attachment-sub',
            },
            { extend: 'background-size', id: 'background-size-sub' },
          ]),
        },
        'box-shadow',
      ],
      [
        'transform',
        {
          type: 'stack',
          layerSeparator: ' ',
          fromStyle(style, { property, name }) {
            const filter = (style[name] || '') as string;
            const sep = property.getLayerSeparator();
            return filter
              ? filter.split(sep).map((input) => {
                  const { name, value } = property.__parseFn(input);
                  return {
                    'transform-type': name,
                    'transform-value': value,
                  };
                })
              : [];
          },
          toStyle(values, { name }) {
            return { [name]: `${values['transform-type']}(${values['transform-value']})` };
          },
          properties: [
            {
              property: 'transform-type',
              name: 'Type',
              type: this.typeSelect,
              default: 'rotateZ',
              full: true,
              options: [
                { id: 'scaleX', propValue: { units: [''], step: 0.01 } },
                { id: 'scaleY', propValue: { units: [''], step: 0.01 } },
                { id: 'scaleZ', propValue: { units: [''], step: 0.01 } },
                {
                  id: 'rotateX',
                  propValue: { units: this.unitsAngle, step: 1 },
                },
                {
                  id: 'rotateY',
                  propValue: { units: this.unitsAngle, step: 1 },
                },
                {
                  id: 'rotateZ',
                  propValue: { units: this.unitsAngle, step: 1 },
                },
                {
                  id: 'translateX',
                  propValue: { units: this.unitsSize, step: 1 },
                },
                {
                  id: 'translateY',
                  propValue: { units: this.unitsSize, step: 1 },
                },
              ],
              onChange({ property, to }) {
                if (to.value) {
                  const option = (property as PropertySelect).getOption();
                  const props = { ...(option.propValue || {}) };
                  const propToUp = property.getParent().getProperty('transform-value') as PropertyNumber;
                  const unit = propToUp.getUnit();
                  if (!unit || props?.units.indexOf(unit) < 0) {
                    props.unit = props?.units[0] || '';
                  }
                  propToUp.up(props);
                }
              },
            },
            {
              property: 'transform-value',
              type: this.typeNumber,
              default: '0',
              full: true,
            },
          ],
        },
      ],
    ];

    propsToCreate.forEach(([prop, def, from]) => {
      this.add(prop, def || {}, { from });
    });

    return this;
  }

  add(property: string, def: Record<string, any> = {}, opts: { from?: string } = {}) {
    const from = opts.from || '';
    const fromRes = this.props[from || property] || {};
    const result: any = { ...fromRes, property, ...def };
    if (result.properties && isFunction(result.properties)) {
      result.properties = result.properties();
    }
    this.props[property] = result;
    return result;
  }

  get(prop: string) {
    return this.props[prop];
  }

  /**
   * Build props object by their name
   * @param  {Array<string>|string} props Array of properties name
   * @return {Array<Object>}
   */
  build(props: string | string[]) {
    const result: PropertyProps[] = [];
    const propsArr = isString(props) ? [props] : props;

    propsArr.forEach((prop) => {
      result.push(this.get(prop) || { property: prop });
    });

    return result;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertyNumber.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/model/PropertyNumber.ts

```typescript
import { isUndefined } from 'underscore';
import Property, { PropertyProps } from './Property';
import InputNumber from '../../domain_abstract/ui/InputNumber';
import { hasWin } from '../../utils/mixins';

/** @private */
export interface PropertyNumberProps extends PropertyProps {
  /**
   * Array of units, eg. `['px', '%']`
   */
  units?: string[];
  /**
   * Unit defualt value.
   */
  unit?: string;
  /**
   * Minimum value.
   */
  min?: number;
  /**
   * Maximum value.
   */
  max?: number;
  /**
   * Step value.
   * @default 1
   */
  step?: number;
}

/**
 * @typedef PropertyNumber
 * @property {Array<String>} units Array of units, eg. `['px', '%']`
 * @property {Number} min Minimum value.
 * @property {Number} max Maximum value.
 * @property {Number} step Step value.
 *
 */
export default class PropertyNumber extends Property<PropertyNumberProps> {
  input?: InputNumber;

  defaults() {
    return {
      ...Property.getDefaults(),
      units: [],
      unit: '',
      min: '',
      max: '',
      step: 1,
    };
  }

  /**
   * Get property units.
   * @returns {Array<String>}
   */
  getUnits() {
    return this.get('units') || [];
  }

  /**
   * Get property unit value.
   * @returns {String}
   */
  getUnit() {
    return this.get('unit')!;
  }

  /**
   * Get min value.
   * @returns {Number}
   */
  getMin() {
    return this.get('min')!;
  }

  /**
   * Get max value.
   * @returns {Number}
   */
  getMax() {
    return this.get('max')!;
  }

  /**
   * Get step value.
   * @returns {Number}
   */
  getStep() {
    return this.get('step')!;
  }

  /**
   * Update property unit value.
   * The change is also propagated to the selected targets.
   * @param {String} unit New unit value
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.noTarget=false] If `true` the change won't be propagated to selected targets.
   * @returns {String}
   */
  upUnit(unit: string, opts: { noTarget?: boolean } = {}) {
    return this._up({ unit }, opts);
  }

  initialize(props = {}, opts = {}) {
    // @ts-ignore
    Property.callParentInit(Property, this, props, opts);
    const unit = this.get('unit');
    const units = this.getUnits();
    this.input = hasWin() ? new InputNumber({ model: this }) : undefined;

    if (units.length && !unit) {
      this.set('unit', units[0], { silent: true });
    }
    // @ts-ignore
    Property.callInit(this, props, opts);
  }

  __getClearProps() {
    return {
      ...Property.prototype.__getClearProps(),
      unit: '',
    };
  }

  parseValue(val: any, opts = {}): Partial<PropertyNumberProps> {
    const parsed = Property.prototype.parseValue.apply(this, arguments as any);
    const { value, unit } = this.input!.validateInputValue(parsed.value, {
      deepCheck: 1,
      ...opts,
    }) as any;
    parsed.value = value;
    parsed.unit = unit;
    return parsed;
  }

  getFullValue() {
    const valueProp = this.get('value');
    const unitProp = this.get('unit');
    const value = !isUndefined(valueProp) ? `${valueProp}` : '';
    const unit = !isUndefined(unitProp) && value ? unitProp : '';
    const result = `${value}${unit}`;
    return Property.prototype.getFullValue.apply(this, [result]);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertyRadio.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/model/PropertyRadio.ts

```typescript
import PropertySelect from './PropertySelect';

export default class PropertyRadio extends PropertySelect {
  defaults() {
    return {
      ...PropertySelect.getDefaults(),
      full: 1,
    };
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertySelect.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/model/PropertySelect.ts

```typescript
import { isString } from 'underscore';
import { ObjectAny } from '../../common';
import { isDef } from '../../utils/mixins';
import Property, { PropertyProps } from './Property';

type SelectOption = {
  id: string;
  value?: string;
  label?: string;
  name?: string;
  className?: string;
  title?: string;
  style?: string;
  propValue?: ObjectAny;
};

/** @private */
export interface PropertySelectProps extends PropertyProps {
  options?: SelectOption[];
  list?: SelectOption[];
}

/**
 * @typedef PropertySelect
 * @property {Array<Object>} options Array of option definitions.
 * \n
 * ```js
 * options: [
 *  { id: '100', label: 'Set 100' },
 *  { id: '200', label: 'Set 200' },
 * ]
 * ```
 */
export default class PropertySelect extends Property<PropertySelectProps> {
  defaults() {
    return {
      ...Property.getDefaults(),
      options: [],
      full: 0,
    };
  }

  /**
   * Get available options.
   * @returns {Array<Object>} Array of options
   */
  getOptions() {
    // support old list property
    const { options, list } = this.attributes;
    return (options && options.length ? options : list) || [];
  }

  /**
   * Get current selected option or by id.
   * @param {String} [id] Option id.
   * @returns {Object | null}
   */
  getOption(id?: string): SelectOption {
    const idSel = isDef(id) ? id : this.getValue();
    return this.getOptions().filter((o) => this.getOptionId(o) === idSel)[0] || null;
  }

  /**
   * Update options.
   * @param {Array<Object>} value New array of options, eg. `[{ id: 'val-1', label: 'Value 1' }]`
   */
  setOptions(value: SelectOption[] = []) {
    this.set('options', value);
    return this;
  }

  /**
   * Add new option.
   * @param {Object} value Option object, eg. `{ id: 'val-1', label: 'Value 1' }`
   */
  addOption(value: SelectOption) {
    if (value) {
      const opts = this.getOptions();
      this.setOptions([...opts, value]);
    }
    return this;
  }

  /**
   * Get the option id from the option object.
   * @param {Object} option Option object
   * @returns {String} Option id
   */
  getOptionId(option: SelectOption) {
    return isDef(option.id) ? option.id : (option.value as string);
  }

  /**
   * Get option label.
   * @param {String|Object} id Option id or the option object
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.locale=true] Use the locale string from i18n module
   * @returns {String} Option label
   */
  getOptionLabel(id: string | SelectOption, opts: { locale?: boolean; property?: string } = {}): string {
    const { locale = true } = opts;
    const option = (isString(id) ? this.getOption(id) : id) || {};
    const optId = this.getOptionId(option);
    const label = option.label || option.name || optId;
    const propId = opts.property || this.getId();
    return (locale && this.em?.t(`styleManager.options.${propId}.${optId}`)) || label;
  }

  initialize(...args: any) {
    Property.prototype.initialize.apply(this, args);
    this.listenTo(this, 'change:options', this.__onOptionChange);
  }

  __onOptionChange() {
    this.set('list', this.get('options'));
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PropertySlider.ts]---
Location: grapesjs-dev/packages/core/src/style_manager/model/PropertySlider.ts

```typescript
import PropertyNumber from './PropertyNumber';

export default class PropertySlider extends PropertyNumber {
  defaults() {
    return {
      ...PropertyNumber.getDefaults(),
      showInput: 1,
    };
  }
}
```

--------------------------------------------------------------------------------

````
