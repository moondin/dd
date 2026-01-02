---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 66
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 66 of 97)

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

---[FILE: Trait.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/model/Trait.ts

```typescript
import { isString, isUndefined } from 'underscore';
import Category from '../../abstract/ModuleCategory';
import { LocaleOptions, Model, SetOptions } from '../../common';
import Component from '../../dom_components/model/Component';
import EditorModel from '../../editor/model/Editor';
import { isDef } from '../../utils/mixins';
import TraitsEvents, { TraitGetValueOptions, TraitOption, TraitProperties, TraitSetValueOptions } from '../types';
import TraitView from '../view/TraitView';
import Traits from './Traits';

/**
 * @property {String} id Trait id, eg. `my-trait-id`.
 * @property {String} type Trait type, defines how the trait should be rendered. Possible values: `text` (default), `number`, `select`, `checkbox`, `color`, `button`
 * @property {String} label The trait label to show for the rendered trait.
 * @property {String} name The name of the trait used as a key for the attribute/property. By default, the name is used as attribute name or property in case `changeProp` in enabled.
 * @property {String} default Default value to use in case the value is not defined on the component.
 * @property {String} placeholder Placeholder to show inside the default input (if the UI type allows it).
 * @property {String} [category=''] Trait category.
 * @property {Boolean} changeProp If `true`, the trait value is applied on the component property, otherwise, on component attributes.
 *
 * @module docsjs.Trait
 *
 */
export default class Trait extends Model<TraitProperties> {
  target!: Component;
  em: EditorModel;
  view?: TraitView;
  el?: HTMLElement;

  defaults() {
    return {
      type: 'text',
      label: '',
      name: '',
      unit: '',
      step: 1,
      value: '',
      default: '',
      placeholder: '',
      category: '',
      changeProp: false,
      options: [],
    };
  }

  constructor(prop: TraitProperties, em: EditorModel) {
    super(prop);
    const { target, name } = this.attributes;
    !this.get('id') && this.set('id', name);
    if (target) {
      this.setTarget(target);
    }
    this.em = em;
  }

  get parent() {
    return this.collection as unknown as Traits;
  }

  get category(): Category | undefined {
    const cat = this.get('category');
    return cat instanceof Category ? cat : undefined;
  }

  get component() {
    return this.target;
  }

  get changeProp() {
    return !!this.get('changeProp');
  }

  setTarget(component: Component) {
    if (component) {
      const { name, changeProp, value: initValue, getValue } = this.attributes;
      this.target = component;
      this.unset('target');
      const targetEvent = changeProp ? `change:${name}` : `change:attributes:${name}`;
      this.listenTo(component, targetEvent, this.targetUpdated);
      const value =
        initValue ||
        // Avoid the risk of loops in case the trait has a custom getValue
        (!getValue ? this.getValue() : undefined);
      !isUndefined(value) && this.set({ value }, { silent: true });
    }
  }

  /**
   * Get the trait id.
   * @returns {String}
   */
  getId() {
    return this.get('id')!;
  }

  /**
   * Get the trait type.
   * @returns {String}
   */
  getType() {
    return this.get('type')!;
  }

  /**
   * Get the trait name.
   * @returns {String}
   */
  getName() {
    return this.get('name')!;
  }

  /**
   * Get the trait label.
   * @param {Object} [opts={}] Options.
   * @param {Boolean} [opts.locale=true] Use the locale string from i18n module.
   * @returns {String}
   */
  getLabel(opts: { locale?: boolean } = {}) {
    const { locale = true } = opts;
    const id = this.getId();
    const name = this.get('label') || this.getName();
    return (locale && this.em?.t(`traitManager.traits.labels.${id}`)) || name;
  }

  /**
   * Get the trait value.
   * The value is taken from component attributes by default or from properties if the trait has the `changeProp` enabled.
   * @param {Object} [opts={}] Options.
   * @param {Boolean} [opts.useType=false] Get the value based on type (eg. the checkbox will always return a boolean).
   * @returns {any}
   */
  getValue(opts?: TraitGetValueOptions) {
    return this.getTargetValue(opts);
  }

  /**
   * Update the trait value.
   * The value is applied on component attributes by default or on properties if the trait has the `changeProp` enabled.
   * @param {any} value Value of the trait.
   * @param {Object} [opts={}] Options.
   * @param {Boolean} [opts.partial] If `true` the update won't be considered complete (not stored in UndoManager).
   */
  setValue(value: any, opts: TraitSetValueOptions = {}) {
    const { component, em } = this;
    const { partial } = opts;
    const valueOpts: { avoidStore?: boolean } = {};
    const { setValue } = this.attributes;

    if (setValue) {
      setValue({
        value,
        component,
        editor: em?.getEditor()!,
        trait: this,
        partial: !!partial,
        options: opts,
        emitUpdate: () => this.targetUpdated(),
      });
      return;
    }

    if (partial) {
      valueOpts.avoidStore = true;
    }

    this.setTargetValue(value, valueOpts);
  }

  /**
   * Get default value.
   */
  getDefault() {
    return this.get('default');
  }

  /**
   * Get trait options.
   */
  getOptions(): TraitOption[] {
    return this.get('options') || [];
  }

  /**
   * Get current selected option or by id.
   * @param {String} [id] Option id.
   * @returns {Object | null}
   */
  getOption(id?: string): TraitOption | undefined {
    const idSel = isDef(id) ? id : this.getValue();
    return this.getOptions().filter((o) => this.getOptionId(o) === idSel)[0];
  }

  /**
   * Get the option id from the option object.
   * @param {Object} option Option object
   * @returns {String} Option id
   */
  getOptionId(option: TraitOption): string {
    return option.id || (option.value as string);
  }

  /**
   * Get option label.
   * @param {String|Object} id Option id or the option object
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.locale=true] Use the locale string from i18n module
   * @returns {String} Option label
   */
  getOptionLabel(id: string | TraitOption, opts: LocaleOptions = {}): string {
    const { locale = true } = opts;
    const option = (isString(id) ? this.getOption(id) : id)!;
    const optId = this.getOptionId(option);
    const label = option.label || (option as any).name || optId;
    const propName = this.getName();
    return (locale && this.em?.t(`traitManager.traits.options.${propName}.${optId}`)) || label;
  }

  /**
   * Get category label.
   * @param {Object} [opts={}] Options.
   * @param {Boolean} [opts.locale=true] Use the locale string from i18n module.
   * @returns {String}
   */
  getCategoryLabel(opts: LocaleOptions = {}): string {
    const { em, category } = this;
    const { locale = true } = opts;
    const catId = category?.getId();
    const catLabel = category?.getLabel();
    return (locale && em?.t(`traitManager.categories.${catId}`)) || catLabel || '';
  }

  /**
   * Run the trait command (used on the button trait type).
   */
  runCommand() {
    const { em } = this;
    const { command } = this.attributes;

    if (command && em) {
      if (isString(command)) {
        return em.Commands.run(command);
      } else {
        return command(em.Editor, this);
      }
    }
  }

  props() {
    return this.attributes;
  }

  targetUpdated() {
    const { component, em } = this;
    const value = this.getTargetValue({ useType: true });
    this.set({ value }, { fromTarget: 1 });
    const props = { trait: this, component, value };
    component.trigger(TraitsEvents.value, props);
    em?.trigger(TraitsEvents.value, props);
    // This should be triggered for any trait prop change
    em?.trigger('trait:update', props);
  }

  getTargetValue(opts: TraitGetValueOptions = {}) {
    const { component, em } = this;
    const name = this.getName();
    const getValue = this.get('getValue');
    let value;

    const skipResolve = opts.skipResolve;
    if (getValue) {
      value = getValue({
        editor: em?.getEditor()!,
        trait: this,
        component,
      });
    } else if (this.changeProp) {
      value = component.get(name);
      if (skipResolve) value = component.dataResolverWatchers.getValueOrResolver('props', { [name]: value })[name];
    } else {
      value = component.getAttributes({ skipResolve })[name];
    }

    if (opts.useType) {
      const type = this.getType();
      if (type === 'checkbox') {
        const { valueTrue, valueFalse } = this.attributes;

        if (!isUndefined(valueTrue) && valueTrue === value) {
          value = true;
        } else if (!isUndefined(valueFalse) && valueFalse === value) {
          value = false;
        }
      }
    }

    return !isUndefined(value) ? value : '';
  }

  setTargetValue(value: any, opts: SetOptions = {}) {
    const { component, attributes } = this;
    const name = this.getName();
    if (isUndefined(value)) return;
    let valueToSet = value;

    if (value === 'false') {
      valueToSet = false;
    } else if (value === 'true') {
      valueToSet = true;
    }

    if (this.getType() === 'checkbox') {
      const { valueTrue, valueFalse } = attributes;

      if (valueToSet && !isUndefined(valueTrue)) {
        valueToSet = valueTrue;
      }

      if (!valueToSet && !isUndefined(valueFalse)) {
        valueToSet = valueFalse;
      }
    }

    const props = { [name]: valueToSet };
    // This is required for the UndoManager to properly detect changes
    props.__p = opts.avoidStore ? null : undefined;

    if (this.changeProp) {
      component.set(props, opts);
    } else {
      component.addAttributes(props, opts);
    }
  }

  setValueFromInput(value: any, final = true, opts: SetOptions = {}) {
    const toSet = { value };
    this.set(toSet, { ...opts, avoidStore: 1 });

    // Have to trigger the change
    if (final) {
      this.set('value', '', opts);
      this.set(toSet, opts);
    }
  }

  getInitValue() {
    const { component } = this;
    const name = this.getName();
    let value;

    if (component) {
      const attrs = component.get('attributes')!;
      value = this.changeProp ? component.get(name) : attrs[name];
    }

    return value || this.get('value') || this.get('default');
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TraitFactory.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/model/TraitFactory.ts

```typescript
import { isString } from 'underscore';
import EditorModel from '../../editor/model/Editor';
import { TraitManagerConfig } from '../config/config';
import { TraitProperties } from '../types';
import Trait from './Trait';

export default class TraitFactory {
  config: Partial<TraitManagerConfig>;

  constructor(config: Partial<TraitManagerConfig> = {}) {
    this.config = config;
  }

  /**
   * Build props object by their name
   */
  build(prop: string | TraitProperties, em: EditorModel): Trait {
    return isString(prop) ? this.buildFromString(prop, em) : new Trait(prop, em);
  }

  private buildFromString(name: string, em: EditorModel): Trait {
    const obj: TraitProperties = {
      name: name,
      type: 'text',
    };

    switch (name) {
      case 'target':
        obj.type = 'select';
        obj.default = false;
        obj.options = this.config.optionsTarget as any;
        break;
    }
    return new Trait(obj, em);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Traits.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/model/Traits.ts

```typescript
import { isArray } from 'underscore';
import TraitManager from '..';
import { CollectionWithCategories } from '../../abstract/CollectionWithCategories';
import Categories from '../../abstract/ModuleCategories';
import { AddOptions } from '../../common';
import Component from '../../dom_components/model/Component';
import EditorModel from '../../editor/model/Editor';
import TraitsEvents, { TraitProperties } from '../types';
import Trait from './Trait';
import TraitFactory from './TraitFactory';

export default class Traits extends CollectionWithCategories<Trait> {
  em: EditorModel;
  target!: Component;
  tf: TraitFactory;
  categories = new Categories();

  constructor(coll: TraitProperties[], options: { em: EditorModel }) {
    super(coll);
    const { em } = options;
    this.em = em;
    this.categories = new Categories([], {
      em,
      events: { update: TraitsEvents.categoryUpdate },
    });
    this.on('add', this.handleAdd);
    this.on('reset', this.handleReset);
    const tm = this.module;
    const tmOpts = tm?.getConfig();
    this.tf = new TraitFactory(tmOpts);
  }

  get module(): TraitManager {
    return this.em.Traits;
  }

  getCategories() {
    return this.categories;
  }

  handleReset(coll: TraitProperties[], { previousModels = [] }: { previousModels?: Trait[] } = {}) {
    previousModels.forEach((model) => model.trigger('remove'));
  }

  handleAdd(model: Trait) {
    model.em = this.em;
    const target = this.target;

    if (target) {
      model.target = target;
    }

    this.initCategory(model);
  }

  setTarget(target: Component) {
    this.target = target;
    this.models.forEach((trait) => trait.setTarget(target));
  }

  add(model: string | TraitProperties | Trait, options?: AddOptions): Trait;
  add(models: Array<string | TraitProperties | Trait>, options?: AddOptions): Trait[];
  add(models: unknown, opt?: AddOptions): any {
    if (models == undefined) {
      return undefined;
    }
    const { target, em } = this;

    if (isArray(models)) {
      var traits: Trait[] = [];
      for (var i = 0, len = models.length; i < len; i++) {
        const trait = models[i];
        traits[i] = trait instanceof Trait ? trait : this.tf.build(trait, em);
        traits[i].setTarget(target);
      }
      return super.add(traits, opt);
    }
    const trait = models instanceof Trait ? models : this.tf.build(models as any, em);
    trait.setTarget(target);

    return super.add(trait, opt);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TraitButtonView.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/view/TraitButtonView.ts

```typescript
import { isString } from 'underscore';
import TraitView from './TraitView';

export default class TraitButtonView extends TraitView {
  templateInput() {
    return '';
  }

  onChange() {
    this.handleClick();
  }

  handleClick() {
    this.model.runCommand();
  }

  renderLabel() {
    if (this.model.get('label')) {
      TraitView.prototype.renderLabel.apply(this);
    }
  }

  getInputEl() {
    const { model, ppfx } = this;
    const { labelButton, text, full } = model.props();
    const label = labelButton || text;
    const className = `${ppfx}btn`;
    const input: any = `<button type="button" class="${className}-prim${
      full ? ` ${className}--full` : ''
    }">${label}</button>`;
    return input;
  }
}

// Fix #4388
TraitButtonView.prototype.eventCapture = ['click button'];
```

--------------------------------------------------------------------------------

---[FILE: TraitCheckboxView.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/view/TraitCheckboxView.ts

```typescript
import { isUndefined } from 'underscore';
import TraitView from './TraitView';

export default class TraitCheckboxView extends TraitView {
  appendInput = false;

  templateInput() {
    const { ppfx, clsField } = this;
    return `<label class="${clsField}" data-input>
    <i class="${ppfx}chk-icon"></i>
  </label>`;
  }

  /**
   * Fires when the input is changed
   * @private
   */
  onChange() {
    this.model.set('value', this.getInputElem().checked);
  }

  setInputValue(value: any) {
    const el = this.getInputElem();
    el && (el.checked = !!value);
  }

  /**
   * Returns input element
   * @return {HTMLElement}
   * @private
   */
  getInputEl(...args: any) {
    const toInit = !this.$input;
    const el = TraitView.prototype.getInputEl.apply(this, args);

    if (toInit) {
      let checked, targetValue;
      const { model, target } = this;
      const { valueFalse } = model.attributes;
      const name = model.getName();

      if (model.changeProp) {
        checked = target.get(name);
        targetValue = checked;
      } else {
        targetValue = target.get('attributes')![name];
        checked = targetValue || targetValue === '' ? !0 : !1;
      }

      if (!isUndefined(valueFalse) && targetValue === valueFalse) {
        checked = !1;
      }

      el!.checked = checked;
    }

    return el;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TraitColorView.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/view/TraitColorView.ts

```typescript
import TraitView from './TraitView';
import InputColor from '../../domain_abstract/ui/InputColor';

export default class TraitColorView extends TraitView {
  templateInput() {
    return '';
  }

  /**
   * Returns input element
   * @return {HTMLElement}
   * @private
   */
  getInputEl() {
    if (!this.input) {
      const model = this.model;
      const value = this.getModelValue();
      const inputColor = new InputColor({
        model,
        target: this.config.em,
        contClass: this.ppfx + 'field-color',
        ppfx: this.ppfx,
      });
      const input = inputColor.render();
      input.setValue(value, { fromTarget: 1 });
      this.input = input.el as HTMLInputElement;
    }

    return this.input;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TraitNumberView.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/view/TraitNumberView.ts

```typescript
import { isUndefined } from 'underscore';
import InputNumber from '../../domain_abstract/ui/InputNumber';
import TraitView from './TraitView';

export default class TraitNumberView extends TraitView {
  $unit?: HTMLElement;
  getValueForTarget() {
    const { model } = this;
    const { value, unit } = model.attributes;
    return !isUndefined(value) && value !== '' ? value + unit : model.get('default');
  }

  /**
   * Returns input element
   * @return {HTMLElement}
   * @private
   */
  getInputEl() {
    if (!this.input) {
      const { ppfx, model } = this;
      const value = this.getModelValue();
      const inputNumber = new InputNumber({
        contClass: `${ppfx}field-int`,
        type: 'number',
        model: model,
        ppfx,
      });
      inputNumber.render();
      this.$input = inputNumber.inputEl as JQuery<HTMLInputElement>;
      this.$unit = inputNumber.unitEl as HTMLElement;
      // @ts-ignore
      model.set('value', value, { fromTarget: true });
      this.$input.val(value);
      this.input = inputNumber.el as HTMLInputElement;
    }
    return this.input;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TraitSelectView.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/view/TraitSelectView.ts

```typescript
import { isString, isUndefined } from 'underscore';
import { $ } from '../../common';
import TraitView from './TraitView';

export default class TraitSelectView extends TraitView {
  constructor(o = {}) {
    super(o);
    this.listenTo(this.model, 'change:options', this.rerender);
  }

  templateInput() {
    const { ppfx, clsField } = this;
    return `<div class="${clsField}">
      <div data-input></div>
      <div class="${ppfx}sel-arrow">
        <div class="${ppfx}d-s-arrow"></div>
      </div>
    </div>`;
  }

  /**
   * Returns input element
   * @return {HTMLElement}
   * @private
   */
  getInputEl() {
    if (!this.$input) {
      const { model, em } = this;
      const propName = model.get('name');
      const opts = model.get('options') || [];
      const values: string[] = [];
      let input = '<select>';

      opts.forEach((el) => {
        let attrs = '';
        let name, value, style;

        if (isString(el)) {
          name = el;
          value = el;
        } else {
          name = el.name || el.label || el.value;
          value = `${isUndefined(el.value) ? el.id : el.value}`.replace(/"/g, '&quot;');
          style = el.style ? (el.style as string).replace(/"/g, '&quot;') : '';
          attrs += style ? ` style="${style}"` : '';
        }
        const resultName = em.t(`traitManager.traits.options.${propName}.${value}`) || name;
        input += `<option value="${value}"${attrs}>${resultName}</option>`;
        values.push(value);
      });

      input += '</select>';
      this.$input = $(input);
      const val = model.getTargetValue();
      const valResult = values.indexOf(val) >= 0 ? val : model.get('default');
      !isUndefined(valResult) && this.$input!.val(valResult);
    }

    return this.$input!.get(0);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TraitsView.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/view/TraitsView.ts

```typescript
import TraitManager from '..';
import CategoryView from '../../abstract/ModuleCategoryView';
import DomainViews from '../../domain_abstract/view/DomainViews';
import EditorModel from '../../editor/model/Editor';
import Trait from '../model/Trait';
import Traits from '../model/Traits';
import { TraitManagerConfigModule } from '../types';
import TraitView from './TraitView';

interface TraitsViewProps {
  el?: HTMLElement;
  collection: any[];
  editor: EditorModel;
  config: TraitManagerConfigModule;
}

const ATTR_CATEGORIES = 'data-categories';
const ATTR_NO_CATEGORIES = 'data-no-categories';

export default class TraitsView extends DomainViews {
  reuseView = true;
  em: EditorModel;
  pfx: string;
  ppfx: string;
  renderedCategories = new Map<string, CategoryView>();
  config: TraitManagerConfigModule;
  traitContClass: string;
  catsClass: string;
  classNoCat: string;
  catsEl?: HTMLElement;
  traitsEl?: HTMLElement;
  rendered?: boolean;
  itemsView: TraitManager['types'];
  collection: Traits;

  constructor(props: TraitsViewProps, itemsView: TraitManager['types']) {
    super(props);
    this.itemsView = itemsView;
    const config = props.config || {};
    this.config = config;

    const em = props.editor;
    this.em = em;
    const ppfx = config.pStylePrefix || '';
    this.ppfx = ppfx;
    this.pfx = ppfx + config.stylePrefix || '';
    this.className = `${this.pfx}traits`;
    this.traitContClass = `${ppfx}traits-c`;
    this.classNoCat = `${ppfx}traits-empty-c`;
    this.catsClass = `${ppfx}trait-categories`;
    this.collection = new Traits([], { em });
    this.listenTo(em, 'component:toggled', this.updatedCollection);
    this.updatedCollection();
  }

  /**
   * Update view collection
   * @private
   */
  updatedCollection() {
    const { ppfx, em } = this;
    const comp = em.getSelected();
    this.el.className = `${this.traitContClass}s ${ppfx}one-bg ${ppfx}two-color`;
    this.collection = comp?.traits || new Traits([], { em });
    this.render();
  }

  /**
   * Render new model inside the view
   * @param {Model} model
   * @param {Object} fragment Fragment collection
   * @private
   * */
  add(model: Trait, fragment?: DocumentFragment) {
    const { config, renderedCategories } = this;
    let itemView = this.itemView;
    const typeField = model.get(this.itemType as any);
    if (this.itemsView && this.itemsView[typeField]) {
      itemView = this.itemsView[typeField];
    }
    const view = new itemView({
      config,
      model,
      attributes: model.get('attributes'),
    });
    const rendered = view.render().el;
    const category = model.parent.initCategory(model);

    if (category) {
      const catId = category.getId();
      const categories = this.getCategoriesEl();
      let catView = renderedCategories.get(catId);

      if (!catView && categories) {
        catView = new CategoryView({ model: category }, config, 'trait').render();
        renderedCategories.set(catId, catView);
        categories.appendChild(catView.el);
      }

      catView?.append(rendered);
      return;
    }

    fragment ? fragment.appendChild(rendered) : this.append(rendered);
  }

  getCategoriesEl() {
    if (!this.catsEl) {
      this.catsEl = this.el.querySelector(`[${ATTR_CATEGORIES}]`)!;
    }
    return this.catsEl;
  }

  getTraitsEl() {
    if (!this.traitsEl) {
      this.traitsEl = this.el.querySelector(`[${ATTR_NO_CATEGORIES}]`)!;
    }

    return this.traitsEl;
  }

  append(el: HTMLElement | DocumentFragment) {
    const traits = this.getTraitsEl();
    traits?.appendChild(el);
  }

  render() {
    const { el, ppfx, catsClass, traitContClass, classNoCat } = this;
    const frag = document.createDocumentFragment();
    delete this.catsEl;
    delete this.traitsEl;
    this.renderedCategories = new Map();
    el.innerHTML = `
      <div class="${catsClass}" ${ATTR_CATEGORIES}></div>
      <div class="${classNoCat} ${traitContClass}" ${ATTR_NO_CATEGORIES}></div>
    `;

    this.collection.forEach((model) => this.add(model, frag));
    this.append(frag);
    const cls = `${traitContClass}s ${ppfx}one-bg ${ppfx}two-color`;
    this.$el.addClass(cls);
    this.rendered = true;
    return this;
  }
}

TraitsView.prototype.itemView = TraitView;
```

--------------------------------------------------------------------------------

---[FILE: TraitView.ts]---
Location: grapesjs-dev/packages/core/src/trait_manager/view/TraitView.ts

```typescript
import { isFunction, isString, isUndefined } from 'underscore';
import { $, SetOptions, View } from '../../common';
import Component from '../../dom_components/model/Component';
import EditorModel from '../../editor/model/Editor';
import { capitalize } from '../../utils/mixins';
import Trait from '../model/Trait';

export default class TraitView extends View<Trait> {
  pfx: string;
  ppfx: string;
  config: any;
  clsField: string;
  elInput!: HTMLInputElement;
  input?: HTMLInputElement;
  $input?: JQuery<HTMLInputElement>;
  eventCapture!: string[];
  noLabel?: boolean;
  em: EditorModel;
  target: Component;
  createLabel?: (data: { label: string; component: Component; trait: TraitView }) => string | HTMLElement;
  createInput?: (data: ReturnType<TraitView['getClbOpts']>) => string | HTMLElement;

  events: any = {};

  appendInput = true;

  /** @ts-ignore */
  attributes() {
    return this.model.get('attributes') || {};
  }

  templateLabel(cmp?: Component) {
    const { ppfx } = this;
    const label = this.getLabel();
    return `<div class="${ppfx}label" title="${label}">${label}</div>`;
  }

  templateInput(data: ReturnType<TraitView['getClbOpts']>) {
    const { clsField } = this;
    return `<div class="${clsField}" data-input></div>`;
  }

  constructor(o: any = {}) {
    super(o);
    const { config = {} } = o;
    const { model, eventCapture } = this;
    const { target } = model;
    const { type } = model.attributes;
    this.config = config;
    this.em = config.em;
    this.pfx = config.stylePrefix || '';
    this.ppfx = config.pStylePrefix || '';
    this.target = target;
    this.className = this.pfx + 'trait';
    this.clsField = `${this.ppfx}field ${this.ppfx}field-${type}`;
    const evToListen: [string, any][] = [
      ['change:value', this.onValueChange],
      ['remove', this.removeView],
    ];
    evToListen.forEach(([event, clb]) => {
      model.off(event, clb);
      this.listenTo(model, event, clb);
    });
    model.view = this;
    this.listenTo(model, 'change:label', this.render);
    this.listenTo(model, 'change:placeholder', this.rerender);
    this.events = {};
    eventCapture.forEach((event) => (this.events[event] = 'onChange'));
    this.delegateEvents();
    this.init();
  }

  getClbOpts() {
    return {
      component: this.target,
      trait: this.model,
      elInput: this.getInputElem(),
    };
  }

  removeView() {
    this.remove();
    this.removed();
  }

  init() {}
  removed() {}
  onRender(props: ReturnType<TraitView['getClbOpts']>) {}
  onUpdate(props: ReturnType<TraitView['getClbOpts']>) {}
  onEvent(props: ReturnType<TraitView['getClbOpts']> & { event: Event }) {}

  /**
   * Fires when the input is changed
   * @private
   */
  onChange(event: Event) {
    const el = this.getInputElem();
    if (el && !isUndefined(el.value)) {
      this.model.set('value', el.value);
    }
    this.onEvent({
      ...this.getClbOpts(),
      event,
    });
  }

  getValueForTarget() {
    return this.model.get('value');
  }

  setInputValue(value: string) {
    const el = this.getInputElem();
    el && (el.value = value);
  }

  /**
   * On change callback
   * @private
   */
  onValueChange(_m: Trait, _v: string, opts: SetOptions & { fromTarget?: boolean } = {}) {
    const { model } = this;
    const value = this.getValueForTarget();

    if (opts.fromTarget) {
      this.setInputValue(value);
      this.postUpdate();
    } else {
      model.setValue(value, opts as any);
    }
  }

  /**
   * Render label
   * @private
   */
  renderLabel() {
    const { $el, target } = this;
    const label = this.getLabel();
    let tpl: string | HTMLElement = this.templateLabel(target);

    if (this.createLabel) {
      tpl =
        this.createLabel({
          label,
          component: target,
          trait: this,
        }) || '';
    }

    $el.find('[data-label]').append(tpl);
  }

  /**
   * Returns label for the input
   * @return {string}
   * @private
   */
  getLabel() {
    const { em } = this;
    const { label, name } = this.model.attributes;
    return em.t(`traitManager.traits.labels.${name}`) || capitalize(label || name).replace(/-/g, ' ');
  }

  /**
   * Returns current target component
   */
  getComponent() {
    return this.target;
  }

  /**
   * Returns input element
   * @return {HTMLElement}
   * @private
   */
  getInputEl() {
    if (!this.$input) {
      const { em, model } = this;
      const md = model;
      const { name } = model.attributes;
      const placeholder = md.get('placeholder') || md.get('default') || '';
      const type = md.get('type') || 'text';
      const min = md.get('min');
      const max = md.get('max');
      const value = this.getModelValue();
      const input: JQuery<HTMLInputElement> = $(`<input type="${type}">`);
      const i18nAttr = em.t(`traitManager.traits.attributes.${name}`) || {};
      input.attr({
        placeholder,
        ...i18nAttr,
      });

      if (!isUndefined(value)) {
        md.set({ value }, { silent: true });
        input.prop('value', value);
      }

      if (min) {
        input.prop('min', min);
      }

      if (max) {
        input.prop('max', max);
      }

      this.$input = input;
    }
    return this.$input.get(0);
  }

  getInputElem() {
    const { input, $input } = this;
    return input || ($input && $input.get && $input.get(0)) || this.getElInput();
  }

  getModelValue() {
    return this.model.getValue();
  }

  getElInput() {
    return this.elInput;
  }

  /**
   * Renders input
   * @private
   * */
  renderField() {
    const { $el, appendInput, model } = this;
    const inputs = $el.find('[data-input]');
    const el = inputs[inputs.length - 1];
    let tpl: HTMLElement | string | undefined = model.el;

    if (!tpl) {
      tpl = this.createInput ? this.createInput(this.getClbOpts()) : this.getInputEl();
    }

    if (isString(tpl)) {
      el.innerHTML = tpl;
      this.elInput = el.firstChild as HTMLInputElement;
    } else {
      appendInput ? el.appendChild(tpl!) : el.insertBefore(tpl!, el.firstChild);
      this.elInput = tpl as HTMLInputElement;
    }

    model.el = this.elInput;
  }

  hasLabel() {
    const { label } = this.model.attributes;
    return !this.noLabel && label !== false;
  }

  rerender() {
    delete this.model.el;
    this.render();
  }

  postUpdate() {
    this.onUpdate(this.getClbOpts());
  }

  render() {
    const { $el, pfx, ppfx, model } = this;
    const { type, id } = model.attributes;
    const hasLabel = this.hasLabel && this.hasLabel();
    const cls = `${pfx}trait`;
    delete this.$input;
    let tmpl = `<div class="${cls} ${cls}--${type}">
      ${hasLabel ? `<div class="${ppfx}label-wrp" data-label></div>` : ''}
      <div class="${ppfx}field-wrp ${ppfx}field-wrp--${type}" data-input>
        ${
          this.templateInput
            ? isFunction(this.templateInput)
              ? this.templateInput(this.getClbOpts())
              : this.templateInput
            : ''
        }
      </div>
    </div>`;
    $el.empty().append(tmpl);
    hasLabel && this.renderLabel();
    this.renderField();
    this.el.className = `${cls}__wrp ${cls}__wrp-${id}`;
    this.postUpdate();
    this.onRender(this.getClbOpts());
    return this;
  }
}
TraitView.prototype.eventCapture = ['change'];
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/undo_manager/config.ts

```typescript
export interface UndoManagerConfig {
  /**
   * Maximum number of undo items.
   * @default 500
   */
  maximumStackLength?: number;
  /**
   * Track component selection.
   * @default true
   */
  trackSelection?: boolean;
}

const config: () => UndoManagerConfig = () => ({
  maximumStackLength: 500,
  trackSelection: true,
});

export default config;
```

--------------------------------------------------------------------------------

````
