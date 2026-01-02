---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 39
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 39 of 97)

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
Location: grapesjs-dev/packages/core/src/dom_components/index.ts

```typescript
/**
 * With this module is possible to manage components inside the canvas. You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/dom_components/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  domComponents: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API and listen to its events. Before using these methods, you should get the module from the instance.
 *
 * ```js
 * // Listen to events
 * editor.on('component:create', () => { ... });
 *
 * // Use the API
 * const cmp = editor.Components;
 * cmp.addType(...);
 * ```
 *
 * ## Available Events
 * * `component:create` - Component is created (only the model, is not yet mounted in the canvas), called after the init() method
 * * `component:mount` - Component is mounted to an element and rendered in canvas
 * * `component:add` - Triggered when a new component is added to the editor, the model is passed as an argument to the callback
 * * `component:remove` - Triggered when a component is removed, the model is passed as an argument to the callback
 * * `component:remove:before` - Triggered before the remove of the component, the model, remove function (if aborted via options, with this function you can complete the remove) and options (use options.abort = true to prevent remove), are passed as arguments to the callback
 * * `component:clone` - Triggered when a component is cloned, the new model is passed as an argument to the callback
 * * `component:update` - Triggered when a component is updated (moved, styled, etc.), the model is passed as an argument to the callback
 * * `component:update:{propertyName}` - Listen any property change, the model is passed as an argument to the callback
 * * `component:styleUpdate` - Triggered when the style of the component is updated, the model is passed as an argument to the callback
 * * `component:styleUpdate:{propertyName}` - Listen for a specific style property change, the model is passed as an argument to the callback
 * * `component:selected` - New component selected, the selected model is passed as an argument to the callback
 * * `component:deselected` - Component deselected, the deselected model is passed as an argument to the callback
 * * `component:toggled` - Component selection changed, toggled model is passed as an argument to the callback
 * * `component:type:add` - New component type added, the new type is passed as an argument to the callback
 * * `component:type:update` - Component type updated, the updated type is passed as an argument to the callback
 * * `component:drag:start` - Component drag started. Passed an object, to the callback, containing the `target` (component to drag), `parent` (parent of the component) and `index` (component index in the parent)
 * * `component:drag` - During component drag. Passed the same object as in `component:drag:start` event, but in this case, `parent` and `index` are updated by the current pointer
 * * `component:drag:end` - Component drag ended. Passed the same object as in `component:drag:start` event, but in this case, `parent` and `index` are updated by the final pointer
 * * `component:resize` - During component resize.
 *
 * ## Methods
 * * [getWrapper](#getwrapper)
 * * [getComponents](#getcomponents)
 * * [addComponent](#addcomponent)
 * * [clear](#clear)
 * * [addType](#addtype)
 * * [getType](#gettype)
 * * [getTypes](#gettypes)
 *
 * [Component]: component.html
 *
 * @module Components
 */
import { debounce, isArray, isEmpty, isFunction, isString, isSymbol, result } from 'underscore';
import { ItemManagerModule } from '../abstract/Module';
import { BlockProperties } from '../block_manager/model/Block';
import { ObjectAny } from '../common';
import ComponentDataVariable from '../data_sources/model/ComponentDataVariable';
import ComponentDataCondition from '../data_sources/model/conditional_variables/ComponentDataCondition';
import ComponentDataOutput from '../data_sources/model/conditional_variables/ComponentDataOutput';
import ComponentDataCollection from '../data_sources/model/data_collection/ComponentDataCollection';
import { DataComponentTypes } from '../data_sources/types';
import ComponentDataCollectionView from '../data_sources/view/ComponentDataCollectionView';
import ComponentDataConditionView from '../data_sources/view/ComponentDataConditionView';
import ComponentDataVariableView from '../data_sources/view/ComponentDataVariableView';
import EditorModel from '../editor/model/Editor';
import { isComponent } from '../utils/mixins';
import defConfig, { DomComponentsConfig } from './config/config';
import Component, { IComponent, keyUpdate, keyUpdateInside } from './model/Component';
import ComponentComment from './model/ComponentComment';
import ComponentFrame from './model/ComponentFrame';
import ComponentHead, { type as typeHead } from './model/ComponentHead';
import ComponentImage from './model/ComponentImage';
import ComponentLabel from './model/ComponentLabel';
import ComponentLink from './model/ComponentLink';
import ComponentMap from './model/ComponentMap';
import ComponentScript from './model/ComponentScript';
import ComponentSvg from './model/ComponentSvg';
import ComponentSvgIn from './model/ComponentSvgIn';
import ComponentTable from './model/ComponentTable';
import ComponentTableBody from './model/ComponentTableBody';
import ComponentTableCell from './model/ComponentTableCell';
import ComponentTableFoot from './model/ComponentTableFoot';
import ComponentTableHead from './model/ComponentTableHead';
import ComponentTableRow from './model/ComponentTableRow';
import ComponentText from './model/ComponentText';
import ComponentTextNode from './model/ComponentTextNode';
import ComponentVideo from './model/ComponentVideo';
import ComponentWrapper from './model/ComponentWrapper';
import Components from './model/Components';
import {
  detachSymbolInstance,
  getSymbolInstances,
  getSymbolMain,
  getSymbolsToUpdate,
  getSymbolTop,
  isSymbol as isSymbolComponent,
  isSymbolInstance,
  isSymbolMain,
  isSymbolRoot,
} from './model/SymbolUtils';
import Symbols from './model/Symbols';
import {
  AddComponentsOption,
  ComponentAdd,
  ComponentDefinition,
  ComponentDefinitionDefined,
  ComponentStackItem,
} from './model/types';
import { ComponentsEvents, SymbolInfo } from './types';
import ComponentCommentView from './view/ComponentCommentView';
import ComponentFrameView from './view/ComponentFrameView';
import ComponentImageView from './view/ComponentImageView';
import ComponentLabelView from './view/ComponentLabelView';
import ComponentLinkView from './view/ComponentLinkView';
import ComponentMapView from './view/ComponentMapView';
import ComponentScriptView from './view/ComponentScriptView';
import ComponentSvgView from './view/ComponentSvgView';
import ComponentTableBodyView from './view/ComponentTableBodyView';
import ComponentTableCellView from './view/ComponentTableCellView';
import ComponentTableFootView from './view/ComponentTableFootView';
import ComponentTableHeadView from './view/ComponentTableHeadView';
import ComponentTableRowView from './view/ComponentTableRowView';
import ComponentTableView from './view/ComponentTableView';
import ComponentTextNodeView from './view/ComponentTextNodeView';
import ComponentTextView from './view/ComponentTextView';
import ComponentVideoView from './view/ComponentVideoView';
import ComponentView, { IComponentView } from './view/ComponentView';
import ComponentWrapperView from './view/ComponentWrapperView';
import ComponentsView from './view/ComponentsView';

export type ComponentEvent =
  | 'component:create'
  | 'component:mount'
  | 'component:add'
  | 'component:remove'
  | 'component:remove:before'
  | 'component:clone'
  | 'component:update'
  | 'component:styleUpdate'
  | 'component:selected'
  | 'component:deselected'
  | 'component:toggled'
  | 'component:type:add'
  | 'component:type:update'
  | 'component:drag:start'
  | 'component:drag'
  | 'component:drag:end'
  | 'component:resize';

export interface ComponentModelDefinition extends IComponent {
  defaults?: ComponentDefinition | (() => ComponentDefinition);
  [key: string]: any;
}

export interface ComponentViewDefinition extends IComponentView {
  [key: string]: any;
}

export interface AddComponentTypeOptions {
  isComponent?: (el: HTMLElement) => boolean | ComponentDefinitionDefined | undefined;
  model?: Partial<ComponentModelDefinition> & ThisType<ComponentModelDefinition & Component>;
  view?: Partial<ComponentViewDefinition> & ThisType<ComponentViewDefinition & ComponentView>;
  block?: boolean | Partial<BlockProperties>;
  extend?: string;
  extendView?: string;
  extendFn?: string[];
  extendFnView?: string[];
}

/** @private */
export enum CanMoveReason {
  /**
   * Invalid source. This is a default value and should be ignored in case the `result` is true
   */
  InvalidSource = 0,
  /**
   * Source doesn't accept target as destination.
   */
  SourceReject = 1,
  /**
   * Target doesn't accept source.
   */
  TargetReject = 2,
}

export interface CanMoveResult {
  result: boolean;
  reason: CanMoveReason;
  target: Component;
  source?: Component | null;
}

export default class ComponentManager extends ItemManagerModule<DomComponentsConfig, any> {
  componentTypes: ComponentStackItem[] = [
    {
      id: DataComponentTypes.collectionItem,
      model: ComponentDataOutput,
      view: ComponentView,
    },
    {
      id: DataComponentTypes.conditionTrue,
      model: ComponentDataOutput,
      view: ComponentView,
    },
    {
      id: DataComponentTypes.conditionFalse,
      model: ComponentDataOutput,
      view: ComponentView,
    },
    {
      id: DataComponentTypes.collection,
      model: ComponentDataCollection,
      view: ComponentDataCollectionView,
    },
    {
      id: DataComponentTypes.condition,
      model: ComponentDataCondition,
      view: ComponentDataConditionView,
    },
    {
      id: DataComponentTypes.variable,
      model: ComponentDataVariable,
      view: ComponentDataVariableView,
    },
    {
      id: 'cell',
      model: ComponentTableCell,
      view: ComponentTableCellView,
    },
    {
      id: 'row',
      model: ComponentTableRow,
      view: ComponentTableRowView,
    },
    {
      id: 'table',
      model: ComponentTable,
      view: ComponentTableView,
    },
    {
      id: 'thead',
      model: ComponentTableHead,
      view: ComponentTableHeadView,
    },
    {
      id: 'tbody',
      model: ComponentTableBody,
      view: ComponentTableBodyView,
    },
    {
      id: 'tfoot',
      model: ComponentTableFoot,
      view: ComponentTableFootView,
    },
    {
      id: 'map',
      model: ComponentMap,
      view: ComponentMapView,
    },
    {
      id: 'link',
      model: ComponentLink,
      view: ComponentLinkView,
    },
    {
      id: 'label',
      model: ComponentLabel,
      view: ComponentLabelView,
    },
    {
      id: 'video',
      model: ComponentVideo,
      view: ComponentVideoView,
    },
    {
      id: 'image',
      model: ComponentImage,
      view: ComponentImageView,
    },
    {
      id: 'script',
      model: ComponentScript,
      view: ComponentScriptView,
    },
    {
      id: 'svg-in',
      model: ComponentSvgIn,
      view: ComponentSvgView,
    },
    {
      id: 'svg',
      model: ComponentSvg,
      view: ComponentSvgView,
    },
    {
      id: 'iframe',
      model: ComponentFrame,
      view: ComponentFrameView,
    },
    {
      id: 'comment',
      model: ComponentComment,
      view: ComponentCommentView,
    },
    {
      id: 'textnode',
      model: ComponentTextNode,
      view: ComponentTextNodeView,
    },
    {
      id: typeHead,
      model: ComponentHead,
      view: ComponentView,
    },
    {
      id: 'wrapper',
      model: ComponentWrapper,
      view: ComponentWrapperView,
    },
    {
      id: 'text',
      model: ComponentText,
      view: ComponentTextView,
    },
    {
      id: 'default',
      model: Component,
      view: ComponentView,
    },
  ];

  componentsById: { [id: string]: Component } = {};
  componentView?: ComponentWrapperView;

  Component = Component;

  Components = Components;

  ComponentView = ComponentView;

  ComponentsView = ComponentsView;

  /**
   * Name of the module
   * @type {String}
   * @private
   */
  //name = "DomComponents";

  storageKey = 'components';
  keySymbols = 'symbols';

  shallow?: Component;
  symbols: Symbols;
  events = ComponentsEvents;

  /**
   * Initialize module. Called on a new instance of the editor with configurations passed
   * inside 'domComponents' field
   * @param {Object} config Configurations
   * @private
   */
  constructor(em: EditorModel) {
    super(em, 'DomComponents', new Components(undefined, { em }), ComponentsEvents, defConfig());
    const { config } = this;
    this.symbols = new Symbols([], { em, config, domc: this });

    if (em) {
      //@ts-ignore
      this.config.components = em.config.components || this.config.components;
    }

    const ppfx = this.config.pStylePrefix;
    if (ppfx) this.config.stylePrefix = ppfx + this.config.stylePrefix;

    // Load dependencies
    if (em) {
      em.get('Parser').compTypes = this.componentTypes;
      em.on('change:componentHovered', this.componentHovered, this);

      const selected = em.get('selected');
      em.listenTo(selected, 'add', (sel, c, opts) => this.selectAdd(selected.getComponent(sel), opts));
      em.listenTo(selected, 'remove', (sel, c, opts) => this.selectRemove(selected.getComponent(sel), opts));
    }

    return this;
  }

  postLoad() {
    const { em, symbols } = this;
    const { UndoManager } = em;
    UndoManager.add(symbols);
  }

  load(data: any) {
    const result = this.loadProjectData(data, {
      onResult: (result: Component) => {
        let wrapper = this.getWrapper()!;

        if (!wrapper) {
          this.em.Pages.add({}, { select: true });
          wrapper = this.getWrapper()!;
        }

        if (isArray(result)) {
          result.length && wrapper.components(result);
        } else {
          const { components = [], ...rest } = result;
          wrapper.set(rest);
          //@ts-ignore
          wrapper.components(components);
        }
      },
    });

    this.symbols.reset(data[this.keySymbols] || []);

    return result;
  }

  store() {
    return {
      [this.keySymbols]: this.symbols,
    };
  }

  /**
   * Returns the main wrapper.
   * @return {Object}
   * @private
   */
  getComponent() {
    const sel = this.em.Pages.getSelected();
    const frame = sel?.getMainFrame();
    return frame?.getComponent();
  }

  /**
   * Returns root component inside the canvas. Something like `<body>` inside HTML page
   * The wrapper doesn't differ from the original Component Model
   * @return {[Component]} Root Component
   * @example
   * // Change background of the wrapper and set some attribute
   * var wrapper = cmp.getWrapper();
   * wrapper.set('style', {'background-color': 'red'});
   * wrapper.set('attributes', {'title': 'Hello!'});
   */
  getWrapper() {
    return this.getComponent();
  }

  /**
   * Returns wrapper's children collection. Once you have the collection you can
   * add other Components(Models) inside. Each component can have several nested
   * components inside and you can nest them as more as you wish.
   * @return {Components} Collection of components
   * @example
   * // Let's add some component
   * var wrapperChildren = cmp.getComponents();
   * var comp1 = wrapperChildren.add({
   *   style: { 'background-color': 'red'}
   * });
   * var comp2 = wrapperChildren.add({
   *   tagName: 'span',
   *   attributes: { title: 'Hello!'}
   * });
   * // Now let's add an other one inside first component
   * // First we have to get the collection inside. Each
   * // component has 'components' property
   * var comp1Children = comp1.get('components');
   * // Procede as before. You could also add multiple objects
   * comp1Children.add([
   *   { style: { 'background-color': 'blue'}},
   *   { style: { height: '100px', width: '100px'}}
   * ]);
   * // Remove comp2
   * wrapperChildren.remove(comp2);
   */
  getComponents(): Components {
    const wrp = this.getWrapper();
    return wrp?.components()!;
  }

  /**
   * Add new components to the wrapper's children. It's the same
   * as 'cmp.getComponents().add(...)'
   * @param {Object|[Component]|Array<Object>} component Component/s to add
   * @param {string} [component.tagName='div'] Tag name
   * @param {string} [component.type=''] Type of the component. Available: ''(default), 'text', 'image'
   * @param {boolean} [component.removable=true] If component is removable
   * @param {boolean} [component.draggable=true] If is possible to move the component around the structure
   * @param {boolean} [component.droppable=true] If is possible to drop inside other components
   * @param {boolean} [component.badgable=true] If the badge is visible when the component is selected
   * @param {boolean} [component.stylable=true] If is possible to style component
   * @param {boolean} [component.copyable=true] If is possible to copy&paste the component
   * @param {string} [component.content=''] String inside component
   * @param {Object} [component.style={}] Style object
   * @param {Object} [component.attributes={}] Attribute object
   * @param {Object} opt the options object to be used by the [Components.add]{@link getComponents} method
   * @return {[Component]|Array<[Component]>} Component/s added
   * @example
   * // Example of a new component with some extra property
   * var comp1 = cmp.addComponent({
   *   tagName: 'div',
   *   removable: true, // Can't remove it
   *   draggable: true, // Can't move it
   *   copyable: true, // Disable copy/past
   *   content: 'Content text', // Text inside component
   *   style: { color: 'red'},
   *   attributes: { title: 'here' }
   * });
   */
  addComponent(component: ComponentAdd, opt: AddComponentsOption = {}): Component | Component[] {
    return this.getComponents().add(component, opt);
  }

  /**
   * Render and returns wrapper element with all components inside.
   * Once the wrapper is rendered, and it's what happens when you init the editor,
   * the all new components will be added automatically and property changes are all
   * updated immediately
   * @return {HTMLElement}
   * @private
   */
  render() {
    return this.componentView?.render().el;
  }

  /**
   * Remove all components
   * @return {this}
   */
  clear(opts = {}) {
    const components = this.getComponents();
    //@ts-ignore
    components?.filter(Boolean).forEach((i) => i.remove(opts));
    return this;
  }

  /**
   * Set components
   * @param {Object|string} components HTML string or components model
   * @param {Object} opt the options object to be used by the {@link addComponent} method
   * @return {this}
   * @private
   */
  setComponents(components: ComponentAdd, opt: AddComponentsOption = {}) {
    this.clear(opt).addComponent(components, opt);
  }

  /**
   * Add new component type.
   * Read more about this in [Define New Component](https://grapesjs.com/docs/modules/Components.html#define-new-component)
   * @param {string} type Component ID
   * @param {Object} methods Component methods
   * @return {this}
   */
  addType(type: string, methods: AddComponentTypeOptions) {
    const { em } = this;
    const { model = {}, view = {}, isComponent, extend, extendView, extendFn = [], extendFnView = [], block } = methods;
    const compType = this.getType(type);
    const extendType = this.getType(extend!);
    const extendViewType = this.getType(extendView!);
    const typeToExtend = extendType ? extendType : compType ? compType : this.getType('default');
    const modelToExt = typeToExtend.model as typeof Component;
    const viewToExt = extendViewType ? extendViewType.view : typeToExtend.view;

    // Function for extending source object methods
    const getExtendedObj = (fns: any[], target: any, srcToExt: any) =>
      fns.reduce((res, next) => {
        const fn = target[next];
        const parentFn = srcToExt.prototype[next];
        if (fn && parentFn) {
          res[next] = function (...args: any[]) {
            parentFn.bind(this)(...args);
            fn.bind(this)(...args);
          };
        }
        return res;
      }, {});

    // If the model/view is a simple object I need to extend it
    if (typeof model === 'object') {
      const modelDefaults = { defaults: model.defaults };
      delete model.defaults;
      const typeExtends = new Set(modelToExt.typeExtends);
      typeExtends.add(modelToExt.getDefaults().type);

      methods.model = modelToExt.extend(
        {
          ...model,
          ...getExtendedObj(extendFn, model, modelToExt),
        },
        {
          typeExtends,
          isComponent: compType && !extendType && !isComponent ? modelToExt.isComponent : isComponent || (() => 0),
        },
      );
      // Reassign the defaults getter to the model
      Object.defineProperty(methods.model!.prototype, 'defaults', {
        get: () => ({
          ...(result(modelToExt.prototype, 'defaults') || {}),
          ...(result(modelDefaults, 'defaults') || {}),
        }),
      });
    }

    if (typeof view === 'object') {
      methods.view = viewToExt.extend({
        ...view,
        ...getExtendedObj(extendFnView, view, viewToExt),
      });
    }

    if (compType) {
      compType.model = methods.model;
      compType.view = methods.view;
    } else {
      // @ts-ignore
      methods.id = type;
      this.componentTypes.unshift(methods as any);
    }

    if (block) {
      const defBlockProps: BlockProperties = {
        id: type,
        label: type,
        content: { type },
      };
      const blockProps: BlockProperties = block === true ? defBlockProps : { ...defBlockProps, ...block };
      em.Blocks.add(blockProps.id || type, blockProps);
    }

    const event = `component:type:${compType ? 'update' : 'add'}`;
    em?.trigger(event, compType || methods);

    return this;
  }

  /**
   * Get component type.
   * Read more about this in [Define New Component](https://grapesjs.com/docs/modules/Components.html#define-new-component)
   * @param {string} type Component ID
   * @return {Object} Component type definition, eg. `{ model: ..., view: ... }`
   */
  getType(type: 'default'): { id: string; model: any; view: any };
  getType(type: string): { id: string; model: any; view: any } | undefined;
  getType(type: string) {
    var df = this.componentTypes;

    for (var it = 0; it < df.length; it++) {
      var dfId = df[it].id;
      if (dfId == type) {
        return df[it];
      }
    }
    return;
  }

  /**
   * Remove component type
   * @param {string} type Component ID
   * @returns {Object|undefined} Removed component type, undefined otherwise
   */
  removeType(id: string) {
    const df = this.componentTypes;
    const type = this.getType(id);
    if (!type) return;
    const index = df.indexOf(type);
    df.splice(index, 1);
    return type;
  }

  /**
   * Return the array of all types
   * @return {Array}
   */
  getTypes() {
    return this.componentTypes;
  }

  selectAdd(component: Component, opts = {}) {
    if (component) {
      component.set({
        status: 'selected',
      });
      ['component:selected', 'component:toggled'].forEach((event) => this.em.trigger(event, component, opts));
    }
  }

  selectRemove(component: Component, opts = {}) {
    if (component) {
      const { em } = this;
      component.set({
        status: '',
        state: '',
      });
      ['component:deselected', 'component:toggled'].forEach((event) => this.em.trigger(event, component, opts));
    }
  }

  /**
   * Triggered when the component is hovered
   * @private
   */
  componentHovered() {
    const { em } = this;
    const model = em.get('componentHovered');
    const previous = em.previous('componentHovered');
    const state = 'hovered';

    // Deselect the previous component
    previous &&
      previous.get('status') == state &&
      previous.set({
        status: '',
        state: '',
      });

    model && isEmpty(model.get('status')) && model.set('status', state);
  }

  getShallowWrapper() {
    let { shallow, em } = this;

    if (!shallow && em) {
      const shallowEm = em.shallow;
      if (!shallowEm) return;
      const domc = shallowEm.Components;
      domc.componentTypes = this.componentTypes;
      shallow = domc.getWrapper();
      if (shallow) {
        const events = [keyUpdate, keyUpdateInside].join(' ');
        shallow.on(
          events,
          debounce(() => shallow?.components(''), 100),
        );
      }
      this.shallow = shallow;
    }

    return shallow;
  }

  /**
   * Check if the object is a [Component].
   * @param {Object} obj
   * @returns {Boolean}
   * @example
   * cmp.isComponent(editor.getSelected()); // true
   * cmp.isComponent({}); // false
   */
  isComponent(obj?: ObjectAny): obj is Component {
    return isComponent(obj);
  }

  /**
   * Add a new symbol from a component.
   * If the passed component is not a symbol, it will be converted to an instance and will return the main symbol.
   * If the passed component is already an instance, a new instance will be created and returned.
   * If the passed component is the main symbol, a new instance will be created and returned.
   * @param {[Component]} component Component from which create a symbol.
   * @returns {[Component]}
   * @example
   * const symbol = cmp.addSymbol(editor.getSelected());
   * // cmp.getSymbolInfo(symbol).isSymbol === true;
   */
  addSymbol(component: Component) {
    if (isSymbol(component) && !isSymbolRoot(component)) {
      return;
    }

    const symbol = component.clone({ symbol: true });
    isSymbolMain(symbol) && this.symbols.add(symbol);
    this.em.trigger('component:toggled');

    return symbol;
  }

  /**
   * Get the array of main symbols.
   * @returns {Array<[Component]>}
   * @example
   * const symbols = cmp.getSymbols();
   * // [Component, Component, ...]
   * // Removing the main symbol will detach all the relative instances.
   * symbols[0].remove();
   */
  getSymbols() {
    return [...this.symbols.models];
  }

  /**
   * Detach symbol instance from the main one.
   * The passed symbol instance will become a regular component.
   * @param {[Component]} component The component symbol to detach.
   * @example
   * const cmpInstance = editor.getSelected();
   * // cmp.getSymbolInfo(cmpInstance).isInstance === true;
   * cmp.detachSymbol(cmpInstance);
   * // cmp.getSymbolInfo(cmpInstance).isInstance === false;
   */
  detachSymbol(component: Component) {
    if (isSymbolInstance(component)) {
      detachSymbolInstance(component);
    }
  }

  /**
   * Get info about the symbol.
   * @param {[Component]} component Component symbol from which to get the info.
   * @returns {Object} Object containing symbol info.
   * @example
   * cmp.getSymbolInfo(editor.getSelected());
   * // > { isSymbol: true, isMain: false, isInstance: true, ... }
   */
  getSymbolInfo(component: Component, opts: { withChanges?: string } = {}): SymbolInfo {
    const isMain = isSymbolMain(component);
    const mainRef = getSymbolMain(component);
    const isInstance = !!mainRef;
    const instances = (isMain ? getSymbolInstances(component) : getSymbolInstances(mainRef)) || [];
    const main = mainRef || (isMain ? component : undefined);
    const relatives = getSymbolsToUpdate(component, { changed: opts.withChanges });
    const isSymbol = isMain || isInstance;
    const isRoot = isSymbol && isSymbolRoot(component);

    return {
      isSymbol,
      isMain,
      isInstance,
      isRoot,
      main,
      instances: instances,
      relatives: relatives || [],
    };
  }

  /**
   * Check if a component can be moved inside another one.
   * @param {[Component]} target The target component is the one that is supposed to receive the source one.
   * @param {[Component]|String} source The source can be another component, a component definition or an HTML string.
   * @param {Number} [index] Index position, if not specified, the check will be performed against appending the source to the target.
   * @returns {Object} Object containing the `result` (Boolean), `source`, `target` (as Components), and a `reason` (Number) with these meanings:
   * * `0` - Invalid source. This is a default value and should be ignored in case the `result` is true.
   * * `1` - Source doesn't accept target as destination.
   * * `2` - Target doesn't accept source.
   * @example
   * const rootComponent = editor.getWrapper();
   * const someComponent = editor.getSelected();
   *
   * // Check with two components
   * editor.Components.canMove(rootComponent, someComponent);
   *
   * // Check with component definition
   * editor.Components.canMove(rootComponent, { tagName: 'a', draggable: false });
   *
   * // Check with HTML string
   * editor.Components.canMove(rootComponent, '<form>...</form>');
   */
  canMove(target: Component, source?: Component | ComponentDefinition | string, index?: number): CanMoveResult {
    const result: CanMoveResult = {
      result: false,
      reason: CanMoveReason.InvalidSource,
      target,
      source: null,
    };
    if (!source || !target) return result;

    // Check if the target and source belong to the same root symbol
    if (isSymbolComponent(target) && source instanceof Component && isSymbolComponent(source)) {
      const targetRootSymbol = getSymbolTop(target);
      const targetMain = isSymbolMain(targetRootSymbol) ? targetRootSymbol : getSymbolMain(targetRootSymbol);
      const sourceRootSymbol = getSymbolTop(source as Component);
      const sourceMain = isSymbolMain(sourceRootSymbol) ? sourceRootSymbol : getSymbolMain(sourceRootSymbol);

      const sameRoot = targetMain === sourceMain;
      const differentInstance = targetRootSymbol !== sourceRootSymbol;
      if (sameRoot && differentInstance) return { ...result, reason: CanMoveReason.TargetReject };
    }

    let srcModel = isComponent(source) ? source : null;

    if (!srcModel) {
      const wrapper = this.getShallowWrapper();
      srcModel = wrapper?.append(source, { temporary: true })[0] || null;
    }

    result.source = srcModel;

    if (!srcModel) return result;

    // Check if the source is draggable in the target
    let draggable = srcModel.get('draggable');

    if (isFunction(draggable)) {
      draggable = !!draggable(srcModel, target, index);
    } else {
      const el = target.getEl();
      draggable = isArray(draggable) ? draggable.join(',') : draggable;
      draggable = isString(draggable) ? el?.matches(draggable) : draggable;
    }

    if (!draggable) return { ...result, reason: CanMoveReason.SourceReject };

    // Check if the target accepts the source
    let droppable = target.get('droppable');

    if (isFunction(droppable)) {
      droppable = !!droppable(srcModel, target, index);
    } else {
      if (droppable === false && target.isInstanceOf('text') && srcModel.get('textable')) {
        droppable = true;
      } else {
        const el = srcModel.getEl();
        droppable = isArray(droppable) ? droppable.join(',') : droppable;
        droppable = isString(droppable) ? el?.matches(droppable) : droppable;
      }
    }

    // Ensure the target is not inside the source
    const isTargetInside = [target].concat(target.parents()).indexOf(srcModel) > -1;

    if (!droppable || isTargetInside) return { ...result, reason: CanMoveReason.TargetReject };

    return { ...result, result: true };
  }

  allById() {
    return this.componentsById;
  }

  getById(id: string) {
    return this.componentsById[id] || null;
  }

  destroy() {
    const all = this.allById();
    Object.keys(all).forEach((id) => all[id] && all[id].remove());
    this.componentView?.remove();
    [this.em, this.componentsById, this.componentView].forEach((i) => (i = {}));
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/types.ts

```typescript
import { AddOptions, OptionAsDocument, WithHTMLParserOptions } from '../common';
import Component from './model/Component';

export enum ActionLabelComponents {
  remove = 'component:remove',
  add = 'component:add',
  move = 'component:move',
}

export interface SymbolInfo {
  isSymbol: boolean;
  isMain: boolean;
  isInstance: boolean;
  isRoot: boolean;
  main?: Component;
  instances: Component[];
  relatives: Component[];
}

export interface ParseStringOptions extends AddOptions, OptionAsDocument, WithHTMLParserOptions {
  keepIds?: string[];
  cloneRules?: boolean;
}

export enum ComponentsEvents {
  /**
   * @event `component:add` New component added.
   * @example
   * editor.on('component:add', (component) => { ... });
   */
  add = 'component:add',

  /**
   * @event `component:remove` Component removed.
   * @example
   * editor.on('component:remove', (component) => { ... });
   */
  remove = 'component:remove',
  removeBefore = 'component:remove:before',
  removed = 'component:removed',

  /**
   * @event `component:create` Component created.
   * @example
   * editor.on('component:create', (component) => { ... });
   */
  create = 'component:create',

  /**
   * @event `component:update` Component is updated, the component is passed as an argument to the callback.
   * @example
   * editor.on('component:update', (component) => { ... });
   */
  update = 'component:update',
  updateInside = 'component:update-inside',

  /**
   * @event `component:styleUpdate` Component related styles are updated, the component is passed as an argument to the callback.
   * @example
   * editor.on('component:styleUpdate', (component) => { ... });
   */
  styleUpdate = 'component:styleUpdate',
  styleUpdateProperty = 'component:styleUpdate:',

  /**
   * @event `component:select` Component selected.
   * @example
   * editor.on('component:select', (component) => { ... });
   */
  select = 'component:select',
  selectBefore = 'component:select:before',

  /**
   * @event `component:mount` Component is mounted in the canvas.
   * @example
   * editor.on('component:mount', (component) => { ... });
   */
  mount = 'component:mount',

  /**
   * @event `component:script:mount` Component with script is mounted.
   * @example
   * editor.on('component:script:mount', ({ component, view, el }) => { ... });
   */
  scriptMount = 'component:script:mount',
  scriptMountBefore = 'component:script:mount:before',

  /**
   * @event `component:script:unmount` Component with script is unmounted. This is triggered when the component is removed or the script execution has to be refreshed. This event might be useful to clean up resources.
   * @example
   * editor.on('component:script:unmount', ({ component, view, el }) => { ... });
   */
  scriptUnmount = 'component:script:unmount',

  /**
   * @event `component:render` Component rendered in the canvas. This event could be triggered multiple times for the same component (eg. undo/redo, explicit rerender).
   * @example
   * editor.on('component:render', ({ component, view, el }) => { ... });
   */
  render = 'component:render',

  /**
   * @event `component:input` Event triggered on `input` DOM event. This is useful to catch direct input changes in the component (eg. Text component).
   * @example
   * editor.on('component:input', (component) => { ... });
   */
  input = 'component:input',

  /**
   * @event `component:resize` Component resized. This event is triggered when the component is resized in the canvas.
   * @example
   * editor.on('component:resize', ({ component, type }) => {
   *  // type can be 'start', 'move', or 'end'
   * });
   */
  resize = 'component:resize',

  /**
   * @event `component:resize:start` Component resize started. This event is triggered when the component starts being resized in the canvas.
   * @example
   * editor.on('component:resize:start', ({ component, event, ... }) => {})
   */
  resizeStart = 'component:resize:start',

  /**
   * @event `component:resize:move` Component resize in progress. This event is triggered while the component is being resized in the canvas.
   * @example
   * editor.on('component:resize:move', ({ component, event, ... }) => {})
   */
  resizeMove = 'component:resize:move',

  /**
   * @event `component:resize:end` Component resize ended. This event is triggered when the component stops being resized in the canvas.
   * @example
   * editor.on('component:resize:end', ({ component, event, ... }) => {})
   */
  resizeEnd = 'component:resize:end',

  /**
   * @event `component:resize:update` Component resize style update. This event is triggered when the component is resized in the canvas and the size is updated.
   * @example
   * editor.on('component:resize:update', ({ component, style, updateStyle, ... }) => {
   *  // If updateStyle is triggered during the event, the default style update will be skipped.
   *  updateStyle({ ...style, width: '...' })
   * })
   */
  resizeUpdate = 'component:resize:update',

  /**
   * @event `component:resize:init` Component resize init. This event allows you to control the resizer options dinamically.
   * @example
   * editor.on('component:resize:init', (opts) => {
   *  if (opts.component.is('someType')) {
   *   opts.resizable = true; // Update resizable options
   *  }
   * });
   */
  resizeInit = 'component:resize:init',

  /**
   * @event `symbol:main:add` Added new main symbol.
   * @example
   * editor.on('symbol:main:add', ({ component }) => { ... });
   */
  symbolMainAdd = 'symbol:main:add',

  /**
   * @event `symbol:main:update` Main symbol updated.
   * @example
   * editor.on('symbol:main:update', ({ component }) => { ... });
   */
  symbolMainUpdate = 'symbol:main:update',
  symbolMainUpdateDeep = 'symbol:main:update-deep',

  /**
   * @event `symbol:main:remove` Main symbol removed.
   * @example
   * editor.on('symbol:main:remove', ({ component }) => { ... });
   */
  symbolMainRemove = 'symbol:main:remove',

  /**
   * @event `symbol:main` Catch-all event related to main symbol updates.
   * @example
   * editor.on('symbol:main', ({ event, component }) => { ... });
   */
  symbolMain = 'symbol:main',

  /**
   * @event `symbol:instance:add` Added new root instance symbol.
   * @example
   * editor.on('symbol:instance:add', ({ component }) => { ... });
   */
  symbolInstanceAdd = 'symbol:instance:add',

  /**
   * @event `symbol:instance:remove` Root instance symbol removed.
   * @example
   * editor.on('symbol:instance:remove', ({ component }) => { ... });
   */
  symbolInstanceRemove = 'symbol:instance:remove',

  /**
   * @event `symbol:instance` Catch-all event related to instance symbol updates.
   * @example
   * editor.on('symbol:instance', ({ event, component }) => { ... });
   */
  symbolInstance = 'symbol:instance',

  /**
   * @event `symbol` Catch-all event for any symbol update (main or instance).
   * @example
   * editor.on('symbol', () => { ... });
   */
  symbol = 'symbol',
}
```

--------------------------------------------------------------------------------

````
