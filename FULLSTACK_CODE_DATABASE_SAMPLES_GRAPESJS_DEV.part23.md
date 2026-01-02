---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 23
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 23 of 97)

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
Location: grapesjs-dev/packages/core/src/index.ts
Signals: TypeORM

```typescript
import { isElement } from 'underscore';
import Editor from './editor';
import { EditorConfig } from './editor/config/config';
import PluginManager, { Plugin, getPlugin, logPluginWarn } from './plugin_manager';
import $ from './utils/cash-dom';
import polyfills from './utils/polyfills';

export interface InitEditorConfig extends EditorConfig {
  grapesjs?: typeof grapesjs;
}

polyfills();

const plugins = new PluginManager();
const editors: Editor[] = [];

export const usePlugin = <P extends Plugin<any> | string>(plugin: P, opts?: P extends Plugin<infer C> ? C : {}) => {
  let pluginResult = getPlugin(plugin, plugins);

  return (editor: Editor) => {
    if (pluginResult) {
      pluginResult(editor, opts || {});
    } else {
      logPluginWarn(editor, plugin as string);
    }
  };
};

export const grapesjs = {
  $,

  editors,

  plugins,

  usePlugin,

  // @ts-ignore Will be replaced on build
  version: __GJS_VERSION__ as string,

  /**
   * Initialize the editor with passed options
   * @param {Object} config Configuration object
   * @param {string|HTMLElement} config.container Selector which indicates where render the editor
   * @param {Boolean} [config.autorender=true] If true, auto-render the content
   * @param {Array} [config.plugins=[]] Array of plugins to execute on start
   * @param {Object} [config.pluginsOpts={}] Custom options for plugins
   * @param {Boolean} [config.headless=false] Init headless editor
   * @return {Editor} Editor instance
   * @example
   * var editor = grapesjs.init({
   *   container: '#myeditor',
   *   components: '<article class="hello">Hello world</article>',
   *   style: '.hello{color: red}',
   * })
   */
  init(config: EditorConfig = {}) {
    const { headless } = config;
    const els = config.container;
    if (!els && !headless) throw new Error("'container' is required");
    const initConfig: InitEditorConfig = {
      autorender: true,
      plugins: [],
      pluginsOpts: {},
      ...config,
      grapesjs: this,
      el: headless ? undefined : isElement(els) ? els : (document.querySelector(els!) as HTMLElement),
    };
    const editor = new Editor(initConfig, { $ });
    const em = editor.getModel();
    em.initModules();

    // Load plugins
    initConfig.plugins!.forEach((pluginId) => {
      const plugin = getPlugin(pluginId, plugins);
      const plgOptions = initConfig.pluginsOpts![pluginId as string] || {};

      if (plugin) {
        plugin(editor, plgOptions);
      } else {
        logPluginWarn(editor, pluginId as string);
      }
    });

    // Execute `onLoad` on modules once all plugins are initialized.
    // A plugin might have extended/added some custom type so this
    // is a good point to load stuff like components, css rules, etc.
    em.loadOnStart();
    initConfig.autorender && !headless && editor.render();
    editors.push(editor);

    return editor;
  },
};

/**
 * @deprecated Changed to CategoryProperties
 */
export type { CategoryProperties as BlockCategoryProperties } from './abstract/ModuleCategory';
export type { ComponentDragEventProps } from './commands/view/ComponentDrag';

// Exports for TS
export type { default as Asset } from './asset_manager/model/Asset';
export type { default as Assets } from './asset_manager/model/Assets';
export type { default as Block } from './block_manager/model/Block';
export type { default as Blocks } from './block_manager/model/Blocks';
export type { default as Categories } from './abstract/ModuleCategories';
export type { default as Category } from './abstract/ModuleCategory';
export type { default as Canvas } from './canvas/model/Canvas';
export type { default as CanvasSpot } from './canvas/model/CanvasSpot';
export type { default as CanvasSpots } from './canvas/model/CanvasSpots';
export type { default as Frame } from './canvas/model/Frame';
export type { default as Frames } from './canvas/model/Frames';
export type { default as CssRule } from './css_composer/model/CssRule';
export type { default as CssRules } from './css_composer/model/CssRules';
export type { default as Device } from './device_manager/model/Device';
export type { default as Devices } from './device_manager/model/Devices';
export type { default as ComponentManager } from './dom_components';
export type { default as Component } from './dom_components/model/Component';
export type { default as Components } from './dom_components/model/Components';
export type { default as ComponentView } from './dom_components/view/ComponentView';
export type { default as Editor } from './editor';
export type { default as Modal } from './modal_dialog/model/Modal';
export type { default as Page } from './pages/model/Page';
export type { default as Pages } from './pages/model/Pages';
export type { default as Button } from './panels/model/Button';
export type { default as Buttons } from './panels/model/Buttons';
export type { default as Panel } from './panels/model/Panel';
export type { default as Panels } from './panels/model/Panels';
export type { default as Selector } from './selector_manager/model/Selector';
export type { default as Selectors } from './selector_manager/model/Selectors';
export type { default as State } from './selector_manager/model/State';
export type { default as Properties } from './style_manager/model/Properties';
export type { default as Property } from './style_manager/model/Property';
export type { default as PropertyRadio } from './style_manager/model/PropertyRadio';
export type { default as PropertySelect } from './style_manager/model/PropertySelect';
export type { default as PropertyNumber } from './style_manager/model/PropertyNumber';
export type { default as PropertySlider } from './style_manager/model/PropertySlider';
export type { default as PropertyComposite } from './style_manager/model/PropertyComposite';
export type { default as PropertyStack } from './style_manager/model/PropertyStack';
export type { default as Sector } from './style_manager/model/Sector';
export type { default as Sectors } from './style_manager/model/Sectors';
export type { default as Trait } from './trait_manager/model/Trait';
export type { default as Traits } from './trait_manager/model/Traits';
export type { default as DataSourceManager } from './data_sources';
export type { default as DataSources } from './data_sources/model/DataSources';
export type { default as DataSource } from './data_sources/model/DataSource';
export type { default as DataRecord } from './data_sources/model/DataRecord';
export type { default as DataRecords } from './data_sources/model/DataRecords';
export type { default as DataVariable } from './data_sources/model/DataVariable';
export type { default as ComponentDataVariable } from './data_sources/model/ComponentDataVariable';
export type { default as ComponentWithCollectionsState } from './data_sources/model/ComponentWithCollectionsState';
export type { ComponentWithDataResolver } from './data_sources/model/ComponentWithDataResolver';
export type { default as ComponentDataCollection } from './data_sources/model/data_collection/ComponentDataCollection';
export type { default as ComponentDataCondition } from './data_sources/model/conditional_variables/ComponentDataCondition';
export type {
  DataCondition,
  LogicGroupProps,
  DataConditionProps,
  ExpressionProps,
} from './data_sources/model/conditional_variables/DataCondition';

export default grapesjs;
```

--------------------------------------------------------------------------------

---[FILE: CollectionWithCategories.ts]---
Location: grapesjs-dev/packages/core/src/abstract/CollectionWithCategories.ts

```typescript
import { isString } from 'underscore';
import { Collection, Model } from '../common';
import Categories from './ModuleCategories';
import Category, { CategoryProperties } from './ModuleCategory';
import { isObject } from '../utils/mixins';

interface ModelWithCategoryProps {
  category?: string | CategoryProperties;
}

const CATEGORY_KEY = 'category';

export abstract class CollectionWithCategories<T extends Model<ModelWithCategoryProps>> extends Collection<T> {
  abstract getCategories(): Categories;

  initCategory(model: T) {
    let category = model.get(CATEGORY_KEY);
    const isDefined = category instanceof Category;

    // Ensure the category exists and it's not already initialized
    if (category && !isDefined) {
      if (isString(category)) {
        category = { id: category, label: category };
      } else if (isObject(category) && !category.id) {
        category.id = category.label;
      }

      const catModel = this.getCategories().add(category);
      model.set(CATEGORY_KEY, catModel as any, { silent: true });
      return catModel;
    } else if (isDefined) {
      const catModel = category as unknown as Category;
      this.getCategories().add(catModel);
      return catModel;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/abstract/index.ts

```typescript
export { default as ModuleModel } from './ModuleModel';
export { default as ModuleCollection } from './ModuleCollection';
export { default as ModuleView } from './ModuleView';
export { default as Module } from './Module';
```

--------------------------------------------------------------------------------

---[FILE: Module.ts]---
Location: grapesjs-dev/packages/core/src/abstract/Module.ts

```typescript
import { isElement, isUndefined, isString } from 'underscore';
import { Collection, Debounced, Model, View } from '../common';
import { EditorConfigKeys } from '../editor/config/config';
import EditorModel from '../editor/model/Editor';
import { ProjectData } from '../storage_manager/model/IStorage';
import { createId, isDef, deepMerge } from '../utils/mixins';

export interface IModule<TConfig extends ModuleConfig = ModuleConfig> extends IBaseModule<TConfig> {
  destroy(): void;
  postLoad(key: any): any;
  onInit(): void;
  onLoad?(): void;
  name: string;
  postRender?(view: any): void;
}

export interface IBaseModule<TConfig extends any> {
  em: EditorModel;
  config: TConfig;
}

export interface ModuleConfig {
  name?: string;
  stylePrefix?: string;
  appendTo?: string | HTMLElement;
}

export interface IStorableModule {
  storageKey: string[] | string;
  store(result: any): any;
  load(keys: ProjectData): void;
  clear(): void;
}

export interface ILoadableModule {
  onLoad(): void;
}

export default abstract class Module<T extends ModuleConfig = ModuleConfig> implements IModule<T> {
  private _em: EditorModel;
  private _config: T & { pStylePrefix?: string };
  private _name: string;
  debounced: Debounced[] = [];
  collections: Collection[] = [];
  cls: any[] = [];
  state?: Model;
  events: object = {};
  model?: any;
  view?: any;

  constructor(em: EditorModel, moduleName: string, defaults?: T) {
    this._em = em;
    this._name = moduleName;
    const name = (this.name.charAt(0).toLowerCase() + this.name.slice(1)) as EditorConfigKeys;
    const cfgParent = !isUndefined(em.config[name]) ? em.config[name] : em.config[this.name as EditorConfigKeys];
    const cfg = (cfgParent === true ? {} : cfgParent || {}) as Record<string, any>;
    cfg.pStylePrefix = em.config.pStylePrefix || '';

    if (!isUndefined(cfgParent) && !cfgParent) {
      cfg._disable = 1;
    }

    cfg.em = em;
    this._config = deepMerge(defaults || {}, cfg) as T;
  }

  public get em() {
    return this._em;
  }
  public get config() {
    return this._config;
  }

  render(opts?: any): HTMLElement | JQuery<HTMLElement> | void {}
  postLoad(key: any): void {}
  onInit(): void {}

  get name(): string {
    return this._name;
  }

  getConfig<P extends keyof T | undefined = undefined, R = P extends keyof T ? T[P] : T>(
    name?: P,
  ): R & { pStylePrefix?: string } {
    // @ts-ignore
    return name ? this.config[name] : this.config;
  }

  __logWarn(str: string, opts = {}) {
    this.em.logWarning(`[${this.name}]: ${str}`, opts);
  }

  postRender?(view: any): void;

  destroy() {
    this.__destroy();
  }

  __destroy() {
    this.view?.remove();
    this.state?.stopListening();
    this.state?.clear();
    this.debounced.forEach((d) => d.cancel());
    this.collections.forEach((c) => {
      c.stopListening();
      c.reset();
    });
  }

  /**
   * Move the main DOM element of the module.
   * To execute only post editor render (in postRender)
   */
  __appendTo() {
    const elTo = this.getConfig().appendTo;

    if (elTo) {
      const el = isElement(elTo) ? elTo : document.querySelector(elTo);
      if (!el) return this.__logWarn('"appendTo" element not found');
      el.appendChild(this.render() as any);
    }
  }
}

export abstract class ItemManagerModule<
  TConf extends ModuleConfig = ModuleConfig,
  TCollection extends Collection = Collection,
> extends Module<TConf> {
  cls: any[] = [];
  all: TCollection;
  view?: View;
  events!: Record<string, string>;
  protected _itemCache = new Map<string, Model>();

  constructor(
    em: EditorModel,
    moduleName: string,
    all: any,
    events?: Record<string, string>,
    defaults?: TConf,
    opts: { skipListen?: boolean } = {},
  ) {
    super(em, moduleName, defaults);
    this.all = all;
    if (events) this.events = events;
    !opts.skipListen && this.__initListen();
  }

  private: boolean = false;

  abstract storageKey: string;
  abstract destroy(): void;
  postLoad(key: any): void {}
  render(opts?: any) {}

  getProjectData(data?: any) {
    const obj: any = {};
    const key = this.storageKey;
    if (key) {
      obj[key] = data || this.getAll();
    }
    return obj;
  }

  loadProjectData(data: any = {}, param: { all?: TCollection; onResult?: Function; reset?: boolean } = {}) {
    const { all, onResult, reset } = param;
    const key = this.storageKey;
    const opts: any = { action: 'load' };
    const coll = all || this.all;
    let result = data[key];

    if (typeof result == 'string') {
      try {
        result = JSON.parse(result);
      } catch (err) {
        this.__logWarn('Data parsing failed', { input: result });
      }
    }

    reset && result && coll.reset(undefined, opts);

    if (onResult) {
      result && onResult(result, opts);
    } else if (result && isDef(result.length)) {
      coll.reset(result, opts);
    }

    return result;
  }

  clear(opts = {}) {
    const { all } = this;
    all && all.reset(undefined, opts);
    return this;
  }

  // getAll(): TCollection extends Collection<infer C> ? C[] : TCollection {
  getAll() {
    return [...this.all.models] as TCollection | any;
  }

  getAllMap(): {
    [key: string]: TCollection extends Collection<infer C> ? C : unknown;
  } {
    return this.getAll().reduce((acc: any, i: any) => {
      acc[i.get(i.idAttribute)] = i;
      return acc;
    }, {} as any);
  }

  protected _makeCacheKey(m: Model) {
    return '';
  }

  protected _cacheItem(item: Model) {
    const key = this._makeCacheKey(item);
    key && this._itemCache.set(key, item);
  }

  protected _uncacheItem(item: Model) {
    const key = this._makeCacheKey(item);
    key && this._itemCache.delete(key);
  }

  protected _clearItemCache() {
    this._itemCache.clear();
  }

  protected _onItemsResetCache(collection: Collection) {
    this._clearItemCache();
    collection.each((item: Model) => this._cacheItem(item));
  }

  protected _onItemKeyChange(item: Model) {
    let oldKey: string | undefined;
    for (const [key, cachedItem] of (this._itemCache as any).entries()) {
      if (cachedItem === item) {
        oldKey = key;
        break;
      }
    }

    if (oldKey) {
      this._itemCache.delete(oldKey);
    }

    this._cacheItem(item);
  }

  protected _setupCacheListeners() {
    this.em.listenTo(this.all, 'add', this._cacheItem.bind(this));
    this.em.listenTo(this.all, 'remove', this._uncacheItem.bind(this));
    this.em.listenTo(this.all, 'reset', this._onItemsResetCache.bind(this));
  }

  __initListen(opts: any = {}) {
    const { all, em, events } = this;
    all &&
      em &&
      all
        .on('add', (m: any, c: any, o: any) => em.trigger(events.add, m, o))
        .on('remove', (m: any, c: any, o: any) => em.trigger(events.remove, m, o))
        .on('change', (p: any, c: any) => em.trigger(events.update, p, p.changedAttributes(), c))
        .on('all', this.__catchAllEvent, this);
    // Register collections
    this.cls = [all].concat(opts.collections || []);
    // Propagate events
    ((opts.propagate as any[]) || []).forEach(({ entity, event }) => {
      entity.on('all', (ev: any, model: any, coll: any, opts: any) => {
        const options = opts || coll;
        const opt = { event: ev, ...options };
        [em, all].map((md) => md.trigger(event, model, opt));
      });
    });
  }

  __remove(model: any, opts: any = {}) {
    const { em } = this;
    //@ts-ignore
    const md = isString(model) ? this.get(model) : model;
    const rm = () => {
      md && this.all.remove(md, opts);
      return md;
    };
    !opts.silent && em?.trigger(this.events.removeBefore, md, rm, opts);
    return !opts.abort && rm();
  }

  __catchAllEvent(event: any, model: any, coll: any, opts?: any) {
    const { em, events } = this;
    const options = opts || coll;
    em && events.all && em.trigger(events.all, { event, model, options });
    this.__onAllEvent();
  }

  __appendTo(renderProps?: any) {
    //@ts-ignore
    const elTo = this.config.appendTo;

    if (elTo) {
      const el = isElement(elTo) ? elTo : document.querySelector(elTo);
      if (!el) return this.__logWarn('"appendTo" element not found');
      // @ts-ignore
      el.appendChild(this.render(renderProps));
    }
  }

  __onAllEvent() {}

  _createId(len = 16) {
    const all = this.getAll();
    const ln = all.length + len;
    const allMap = this.getAllMap();
    let id;

    do {
      id = createId(ln);
    } while (allMap[id]);

    return id;
  }

  __listenAdd(model: TCollection, event: string) {
    model.on('add', (m, c, o) => this.em.trigger(event, m, o));
  }

  __listenRemove(model: TCollection, event: string) {
    model.on('remove', (m, c, o) => this.em.trigger(event, m, o));
  }

  __listenUpdate(model: TCollection, event: string) {
    model.on('change', (p, c) => this.em.trigger(event, p, p.changedAttributes(), c));
  }

  __destroy() {
    this.cls.forEach((coll) => {
      coll.stopListening();
      coll.reset();
    });
    this.view?.remove();
    this.view = undefined;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ModuleCategories.ts]---
Location: grapesjs-dev/packages/core/src/abstract/ModuleCategories.ts

```typescript
import { isArray, isString } from 'underscore';
import { AddOptions, Collection } from '../common';
import { normalizeKey } from '../utils/mixins';
import EditorModel from '../editor/model/Editor';
import Category, { CategoryProperties } from './ModuleCategory';

type CategoryCollectionParams = ConstructorParameters<typeof Collection<Category>>;

interface CategoryOptions {
  events?: { update?: string };
  em?: EditorModel;
}

export default class Categories extends Collection<Category> {
  constructor(models?: CategoryCollectionParams[0], opts: CategoryOptions = {}) {
    super(models, opts);
    const { events, em } = opts;
    const evUpdate = events?.update;
    if (em) {
      evUpdate &&
        this.on('change', (category, options) =>
          em.trigger(evUpdate, { category, changes: category.changedAttributes(), options }),
        );
    }
  }

  /** @ts-ignore */
  add(model: (CategoryProperties | Category)[] | CategoryProperties | Category, opts?: AddOptions) {
    const models = isArray(model) ? model : [model];
    models.forEach((md) => md && (md.id = normalizeKey(`${md.id}`)));
    return super.add(model, opts);
  }

  get(id: string | Category) {
    return super.get(isString(id) ? normalizeKey(id) : id);
  }
}

Categories.prototype.model = Category;
```

--------------------------------------------------------------------------------

---[FILE: ModuleCategory.ts]---
Location: grapesjs-dev/packages/core/src/abstract/ModuleCategory.ts

```typescript
import { Model } from '../common';
import CategoryView from './ModuleCategoryView';

export interface CategoryProperties {
  /**
   * Category id.
   */
  id: string;
  /**
   * Category label.
   */
  label: string;
  /**
   * Category open state.
   * @default true
   */
  open?: boolean;
  /**
   * Category order.
   */
  order?: string | number;
  /**
   * Category attributes.
   * @default {}
   */
  attributes?: Record<string, any>;
}

export interface ItemsByCategory<T> {
  category?: Category;
  items: T[];
}

export interface ModelWithCategory {
  category?: Category;
}

export default class Category extends Model<CategoryProperties> {
  view?: CategoryView;

  defaults() {
    return {
      id: '',
      label: '',
      open: true,
      attributes: {},
    };
  }

  getId() {
    return this.get('id')!;
  }

  getLabel() {
    return this.get('label')!;
  }
}

export function getItemsByCategory<T extends ModelWithCategory>(allItems: T[]) {
  const categorySet = new Set<Category>();
  const categoryMap = new Map<Category, T[]>();
  const emptyItem: ItemsByCategory<T> = { items: [] };

  allItems.forEach((item) => {
    const { category } = item;

    if (category) {
      categorySet.add(category);
      const categoryItems = categoryMap.get(category);

      if (categoryItems) {
        categoryItems.push(item);
      } else {
        categoryMap.set(category, [item]);
      }
    } else {
      emptyItem.items.push(item);
    }
  });

  const categoryWithItems = Array.from(categorySet).map((category) => ({
    category,
    items: categoryMap.get(category) || [],
  }));

  return [...categoryWithItems, emptyItem];
}
```

--------------------------------------------------------------------------------

---[FILE: ModuleCategoryView.ts]---
Location: grapesjs-dev/packages/core/src/abstract/ModuleCategoryView.ts

```typescript
import { View } from '../common';
import EditorModel from '../editor/model/Editor';
import html from '../utils/html';
import Category from './ModuleCategory';

export interface CategoryViewConfig {
  em: EditorModel;
  pStylePrefix?: string;
  stylePrefix?: string;
}

export default class CategoryView extends View<Category> {
  em: EditorModel;
  config: CategoryViewConfig;
  pfx: string;
  caretR: string;
  caretD: string;
  iconClass: string;
  activeClass: string;
  iconEl?: HTMLElement;
  typeEl?: HTMLElement;
  catName: string;

  events() {
    return {
      'click [data-title]': 'toggle',
    };
  }

  template({ pfx, label, catName }: { pfx: string; label: string; catName: string }) {
    return html`
      <div class="${pfx}title" data-title>
        <i class="${pfx}caret-icon"></i>
        ${label}
      </div>
      <div class="${pfx}${catName}s-c"></div>
    `;
  }

  /** @ts-ignore */
  attributes() {
    return this.model.get('attributes') || {};
  }

  constructor(o: any, config: CategoryViewConfig, catName: string) {
    super(o);
    this.config = config;
    const pfx = config.pStylePrefix || '';
    this.em = config.em;
    this.catName = catName;
    this.pfx = pfx;
    this.caretR = 'fa fa-caret-right';
    this.caretD = 'fa fa-caret-down';
    this.iconClass = `${pfx}caret-icon`;
    this.activeClass = `${pfx}open`;
    this.className = `${pfx}${catName}-category`;
    this.listenTo(this.model, 'change:open', this.updateVisibility);
    this.model.view = this;
  }

  updateVisibility() {
    if (this.model.get('open')) this.open();
    else this.close();
  }

  open() {
    this.$el.addClass(this.activeClass);
    this.getIconEl()!.className = `${this.iconClass} ${this.caretD}`;
    this.getTypeEl()!.style.display = '';
  }

  close() {
    this.$el.removeClass(this.activeClass);
    this.getIconEl()!.className = `${this.iconClass} ${this.caretR}`;
    this.getTypeEl()!.style.display = 'none';
  }

  toggle() {
    var model = this.model;
    model.set('open', !model.get('open'));
  }

  getIconEl() {
    if (!this.iconEl) {
      this.iconEl = this.el.querySelector(`.${this.iconClass}`)!;
    }

    return this.iconEl;
  }

  getTypeEl() {
    if (!this.typeEl) {
      this.typeEl = this.el.querySelector(`.${this.pfx}${this.catName}s-c`)!;
    }

    return this.typeEl;
  }

  append(el: HTMLElement) {
    this.getTypeEl().appendChild(el);
  }

  render() {
    const { em, el, $el, model, pfx, catName } = this;
    const label = em.t(`${catName}Manager.categories.${model.id}`) || model.get('label');
    el.innerHTML = this.template({ pfx, label, catName });
    $el.addClass(this.className!);
    $el.css({ order: model.get('order')! });
    this.updateVisibility();

    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ModuleCollection.ts]---
Location: grapesjs-dev/packages/core/src/abstract/ModuleCollection.ts

```typescript
import { isArray, isUndefined } from 'underscore';
import { AddOptions, Collection } from '../common';
import ModuleModel from './ModuleModel';

type ModuleExt<TModel extends ModuleModel> = TModel extends ModuleModel<infer M> ? M : unknown;
type ModelConstructor<TModel extends ModuleModel> = { new (mod: ModuleExt<TModel>, attr: any): TModel };

export default class ModuleCollection<TModel extends ModuleModel = ModuleModel> extends Collection<TModel> {
  module!: ModuleExt<TModel>;
  private newModel!: ModelConstructor<TModel>;

  add(model: Array<Record<string, any>> | TModel, options?: AddOptions): TModel;
  add(models: Array<Array<Record<string, any>> | TModel>, options?: AddOptions): TModel[];
  add(model?: unknown, options?: AddOptions): any {
    //Note: the undefined case needed because backbonejs not handle the reset() correctly
    var models = isArray(model) ? model : !isUndefined(model) ? [model] : undefined;

    models = models?.map((m) => (m instanceof this.newModel ? m : new this.newModel(this.module, m))) ?? [undefined];

    return super.add(isArray(model) ? models : models[0], options);
  }

  constructor(
    module: ModuleExt<TModel>,
    models: TModel[] | Array<Record<string, any>>,
    modelConstructor: ModelConstructor<TModel>,
  ) {
    super(models, { module, modelConstructor });
  }

  preinitialize(models?: TModel[] | Array<Record<string, any>>, options?: any) {
    this.newModel = options.modelConstructor;
    this.module = options.module;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ModuleDomainViews.ts]---
Location: grapesjs-dev/packages/core/src/abstract/ModuleDomainViews.ts

```typescript
import ModuleView from './ModuleView';
import ModuleCollection from './ModuleCollection';
import ModuleModel from './ModuleModel';
import { View } from '../common';

export default abstract class ModuleDomainViews<
  TCollection extends ModuleCollection,
  TItemView extends ModuleView,
> extends ModuleView<TCollection> {
  // Defines the View per type
  itemsView = '';

  protected itemType = 'type';

  reuseView = false;

  viewCollection: TItemView[] = [];
  constructor(opts: any = {}, autoAdd = false) {
    super(opts);
    autoAdd && this.listenTo(this.collection, 'add', this.addTo);
  }

  /**
   * Add new model to the collection
   * @param {ModuleModel} model
   * @private
   * */
  private addTo(model: ModuleModel) {
    this.add(model);
  }

  private itemViewNotFound(type: string) {
    /*const { em, ns } = this;
    const warn = `${ns ? `[${ns}]: ` : ''}'${type}' type not found`;
    em?.logWarning(warn);*/
  }
  protected abstract renderView(model: ModuleModel, itemType: string): TItemView;

  /**
   * Render new model inside the view
   * @param {ModuleModel} model
   * @param {Object} fragment Fragment collection
   * @private
   * */
  private add(model: ModuleModel, fragment?: DocumentFragment) {
    const { reuseView, viewCollection } = this;
    var frag = fragment || null;
    var typeField = model.get(this.itemType);
    let view;

    //@ts-ignore
    if (model.view && reuseView) {
      //@ts-ignore
      view = model.view;
    } else {
      view = this.renderView(model, typeField);
    }

    viewCollection.push(view);
    const rendered = view.render().el;

    if (frag) frag.appendChild(rendered);
    else this.$el.append(rendered);
  }

  render() {
    const frag = document.createDocumentFragment();
    this.clearItems();
    this.$el.empty();

    if (this.collection.length) this.collection.each((model) => this.add(model, frag));

    this.$el.append(frag);
    this.onRender();
    return this;
  }

  onRender() {}

  onRemoveBefore(items: TItemView[], opts: any) {}
  onRemove(items: TItemView[], opts: any) {}

  remove(opts: any = {}) {
    const { viewCollection } = this;
    this.onRemoveBefore(viewCollection, opts);
    this.clearItems();
    View.prototype.remove.apply(this, opts);
    this.onRemove(viewCollection, opts);
    return this;
  }

  clearItems() {
    const items = this.viewCollection || [];
    // TODO Traits do not update the target anymore
    // items.forEach(item => item.remove());
    // this.items = [];
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ModuleModel.ts]---
Location: grapesjs-dev/packages/core/src/abstract/ModuleModel.ts

```typescript
import { Model, ObjectHash, SetOptions, CombinedModelConstructorOptions } from '../common';
import EditorModel from '../editor/model/Editor';
import Module, { IBaseModule } from './Module';

export default class ModuleModel<
  TModule extends IBaseModule<any> = Module,
  T extends ObjectHash = any,
  S = SetOptions,
  E = any,
> extends Model<T, S, E> {
  private _module: TModule;

  constructor(module: TModule, attributes?: T, options?: CombinedModelConstructorOptions<E>) {
    super(attributes, options);
    this._module = module;
  }

  public get module() {
    return this._module;
  }

  public get config(): TModule extends IBaseModule<infer C> ? C : unknown {
    return this._module.config;
  }

  public get em(): EditorModel {
    return this._module.em;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ModuleView.ts]---
Location: grapesjs-dev/packages/core/src/abstract/ModuleView.ts

```typescript
import ModuleCollection from './ModuleCollection';
import ModuleModel from './ModuleModel';
import { IBaseModule } from './Module';
import { View } from '../common';
import EditorModel from '../editor/model/Editor';

type ModuleFromModel<TModel extends ModuleModel> = TModel extends ModuleModel<infer M> ? M : unknown;
type ModuleModelExt<TItem extends ModuleModel | ModuleCollection> =
  TItem extends ModuleCollection<infer M> ? ModuleFromModel<M> : TItem extends ModuleModel<infer M> ? M : unknown;

// type TCollection<TItem extends ModuleModel | ModuleCollection> = TItem extends ModuleCollection ? TItem : unknown;

export default class ModuleView<
  TModel extends ModuleModel | ModuleCollection = ModuleModel,
  TElement extends Element = HTMLElement,
> extends View<TModel extends ModuleModel ? TModel : undefined, TElement> {
  protected get pfx() {
    return this.ppfx + (this.config as any).stylePrefix || '';
  }

  protected get ppfx() {
    return this.em.config.stylePrefix || '';
  }

  collection!: TModel extends ModuleModel ? ModuleCollection<ModuleModel> : TModel;

  protected get module(): ModuleModelExt<TModel> {
    return (this.model as any)?.module ?? this.collection.module;
  }

  protected get em(): EditorModel {
    return this.module.em;
  }

  protected get config(): ModuleModelExt<TModel> extends IBaseModule<infer C> ? C : unknown {
    return this.module.config as any;
  }

  public className!: string;

  preinitialize(options?: any) {
    this.className = '';
  }
}
```

--------------------------------------------------------------------------------

````
